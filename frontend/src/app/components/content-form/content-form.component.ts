import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ContentService } from '../../services/content.service';
import { debounceTime, startWith } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-content-form',
  templateUrl: './content-form.component.html',
  styleUrls: ['./content-form.component.css']
})
export class ContentFormComponent implements OnInit {
  contentForm: FormGroup;
  uploadProgress = 0;
  uploading = false;
  uploadSuccess = false;
  contentExists = false;
  isSubmitting = false;
  checkingContent = false;

  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['clean']
    ]
  };

  constructor(
    private fb: FormBuilder,
    private contentService: ContentService,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.contentForm = this.fb.group({
      type: ['', Validators.required],
      url: [''],
      pdfUrl: [''],
      level: ['', Validators.required],
      unitNumber: [1, [Validators.required, Validators.min(1), Validators.max(3)]],
      contentNumber: [1, [Validators.required, Validators.min(1), Validators.max(3)]],
      grammarHtml: [''],
      questions: this.fb.array([])
    });

    this.contentForm.get('type')?.valueChanges.subscribe(type => {
      const urlControl = this.contentForm.get('url');
      const grammarHtmlControl = this.contentForm.get('grammarHtml');
      const pdfUrlControl = this.contentForm.get('pdfUrl');

      if (type === 'GRAMMAR') {
        urlControl?.clearValidators();
        grammarHtmlControl?.setValidators([Validators.required]);
        pdfUrlControl?.clearValidators();
      } else {
        urlControl?.setValidators([Validators.required]);
        grammarHtmlControl?.clearValidators();
        pdfUrlControl?.clearValidators();
      }

      urlControl?.updateValueAndValidity();
      grammarHtmlControl?.updateValueAndValidity();
      pdfUrlControl?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.setupLivePreCheck();
  }

  get questions(): FormArray {
    return this.contentForm.get('questions') as FormArray;
  }

  addQuestion(): void {
    const question = this.fb.group({
      text: ['', Validators.required],
      type: ['MULTIPLE_CHOICE', Validators.required],
      options: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required)
      ]),
      correctOption: [1, [Validators.required, Validators.min(1), Validators.max(4)]]
    });

    this.questions.push(question);
    this.setOptionsForType(question);
  }

  setOptionsForType(questionGroup: FormGroup): void {
    const typeControl = questionGroup.get('type');
    const optionsArray = questionGroup.get('options') as FormArray;

    typeControl?.valueChanges.subscribe((type: string) => {
      optionsArray.clear();
      if (type === 'TRUE_FALSE') {
        optionsArray.push(this.fb.control('True', Validators.required));
        optionsArray.push(this.fb.control('False', Validators.required));
        questionGroup.get('correctOption')?.setValidators([Validators.required, Validators.min(0), Validators.max(1)]);
      } else {
        for (let i = 0; i < 4; i++) {
          optionsArray.push(this.fb.control('', Validators.required));
        }
        questionGroup.get('correctOption')?.setValidators([Validators.required, Validators.min(1), Validators.max(4)]);
      }
      questionGroup.get('correctOption')?.updateValueAndValidity();
    });

    typeControl?.setValue(typeControl.value);
  }

  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }

  getOptions(index: number): FormArray {
    return this.questions.at(index).get('options') as FormArray;
  }

onFileSelected(event: any): void {
  const file: File = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'Elearning');
  
  // Determine folder based on content type
  const contentType = this.contentForm.get('type')?.value;
  const folder = contentType === 'GRAMMAR' ? 'elearning_pdfs' : 'elearning_videos';
  formData.append('folder', folder);

  this.uploading = true;
  this.uploadSuccess = false;

  const cloudName = 'did4va37u';
  
  // KEY FIX: Always use 'auto' resource type for PDFs
  const resourceType = 'auto';  // Cloudinary will detect file type automatically
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  fetch(url, {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.error) throw new Error(data.error.message);

    // For PDFs, use the original secure_url directly
    const pdfUrl = data.secure_url;

    if (contentType === 'GRAMMAR') {
      this.contentForm.patchValue({ pdfUrl });
      console.log('PDF URL:', pdfUrl);
    } else {
      this.contentForm.patchValue({ url: data.secure_url });
    }

    this.uploadSuccess = true;
  })
  .catch(error => {
    console.error('Upload failed:', error);
    this.snackBar.open(`Upload failed: ${error.message}`, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
        verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  })
  .finally(() => {
    this.uploading = false;
  });
}


  submitContent(): void {
    if (this.contentForm.invalid || this.uploading || this.isSubmitting) {
      this.snackBar.open('❌ Please fill out all required fields.', 'Close', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: 'error-snackbar'
      });
      this.contentForm.markAllAsTouched();
      return;
    }

    if (this.contentExists) {
      this.snackBar.open('⚠️ A content already exists at this position.', 'Close', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: 'warning-snackbar'
      });
      return;
    }

    this.isSubmitting = true;
    const contentData = this.contentForm.getRawValue();

    const adjustedQuestions = contentData.questions.map((q: any) => ({
      ...q,
      correctOption: q.type === 'TRUE_FALSE' ? q.correctOption : q.correctOption - 1
    }));

    const adjustedContentData = {
      ...contentData,
      questions: adjustedQuestions
    };

    this.contentService.createContent(adjustedContentData).subscribe({
      next: () => {
        this.snackBar.open('✅ Content submitted successfully!', 'Close', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: 'success-snackbar'
        });
        this.resetForm();
        this.isSubmitting = false;
      },
      error: err => {
        console.error(err);
        this.snackBar.open('❌ Error submitting content.', 'Close', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: 'error-snackbar'
        });
        this.isSubmitting = false;
      }
    });
  }

  setupLivePreCheck(): void {
    const fields = ['level', 'type', 'unitNumber', 'contentNumber'];
    fields.forEach(field => {
      this.contentForm.get(field)?.valueChanges.pipe(
        startWith(this.contentForm.get(field)?.value),
        debounceTime(300)
      ).subscribe(() => this.checkContentExists());
    });
  }

  checkContentExists(): void {
    const { level, type, unitNumber, contentNumber } = this.contentForm.value;
    if (!level || !type || !unitNumber || !contentNumber) {
      this.contentExists = false;
      return;
    }

    this.contentService.checkContentExists(level, type, unitNumber, contentNumber).subscribe({
      next: (exists) => this.contentExists = exists,
      error: (err) => {
        console.warn('Pre-check failed:', err);
        this.contentExists = false;
      }
    });
  }

  resetForm(): void {
    this.contentForm.reset({
      type: '',
      level: '',
      unitNumber: 1,
      contentNumber: 1,
      url: '',
      pdfUrl: '',
      grammarHtml: ''
    });
    this.questions.clear();
    this.uploadSuccess = false;
    this.uploading = false;
    this.uploadProgress = 0;
    this.contentExists = false;
  }
}
