// progress.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Content, UnitProgress  } from '../models/contents';



const NAV_URL = environment.apiUrl;

;
@Injectable({
  providedIn: 'root',
})
export class ProgressService {
  constructor(private http: HttpClient) {}

 

   getUnitProgress(email: string, level: string): Observable<UnitProgress[]> {
  return this.http.get<UnitProgress[]>(`${NAV_URL}/progress/unit?email=${email}&level=${level}`);
}

  
   
 

markContentCompletedSimple(email: string, contentId: number): Observable<any> {
  return this.http.post(`${NAV_URL}/user/content/complete/${contentId}?email=${email}`, null);
}



   
}
