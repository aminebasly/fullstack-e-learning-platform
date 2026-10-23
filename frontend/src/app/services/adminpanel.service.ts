import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

const NAV_URL = environment.apiUrl;

;

@Injectable({
  providedIn: 'root'
})
export class AdminpanelService {



  // ------- Content CRUD ------- //

    private baseUrl = `${NAV_URL}/admin/content`;
;

  constructor(private http: HttpClient) {}

  getContentList(level: string = '', page: number = 0, size: number = 10): Observable<any> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (level) params = params.set('level', level);
    return this.http.get(this.baseUrl, { params });
  }

    getContentByLevelUnitContentNumber(
    level: string,
    unitNumber: number,
    contentNumber: number
  ): Observable<any> {
    let params = new HttpParams()
      .set('level', level)
      .set('unitNumber', unitNumber.toString())
      .set('contentNumber', contentNumber.toString());

    return this.http.get<any>(`${this.baseUrl}/search`, { params });
  }

  getContentDetail(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  updateContent(id: number, content: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, content);
  }
deleteContent(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { observe: 'response', responseType: 'text' }).pipe(
      map(response => {
        console.log('Delete response:', { status: response.status, body: response.body, headers: response.headers }); // Log for debugging
        if (response.status === 200 || response.status === 204) {
          return {}; // Treat as success, return empty object
        }
        throw new Error(`Unexpected response status: ${response.status}`);
      }),
      catchError(err => {
        console.error('Delete request failed:', err);
        throw err; // Let the component handle the error
      })
    );
  }

  // ------- Quiz (Question) CRUD ------- //

  getQuestionsByQuizType(quizType: string): Observable<any[]> {
    return this.http.get<any[]>(`${NAV_URL}/admin/quiz?level=${quizType}`);
  }

  

  deleteAllQuestionsByType(quizType: string): Observable<void> {
  return this.http.delete<void>(`${NAV_URL}/admin/quiz?level=${quizType}`);
}


  
}
