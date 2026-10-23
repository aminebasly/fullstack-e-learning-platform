export interface ContentDTO {
    type: string;
    url: string;
    level: string;
    unitNumber: number;
    contentNumber: number;
    questions: QuestionDTO[];
    grammarHtml: string; 
    pdfUrl:string;

  }
  
  export interface QuestionDTO {
    text: string;
    type: string;
    options: string[];
    correctOption: number;
  }