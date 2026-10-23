import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminQuizFormComponent } from './admin-quiz-form.component';

describe('AdminQuizFormComponent', () => {
  let component: AdminQuizFormComponent;
  let fixture: ComponentFixture<AdminQuizFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminQuizFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminQuizFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
