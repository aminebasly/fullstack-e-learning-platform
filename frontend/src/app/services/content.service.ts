import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContentDTO } from '../models/contentDTO';
import { environment } from 'src/environments/environment';
import { Content, ContentWithStatus, UnitProgress } from '../models/contents';
const NAV_URL = environment.apiUrl

;
@Injectable({
  providedIn: 'root'
})
export class ContentService {

  private apiUrl = `${NAV_URL}/content/create`; // Adjust if backend URL differs

  constructor(private http: HttpClient) {}

  createContent(contentData: ContentDTO): Observable<ContentDTO> {
    return this.http.post<ContentDTO>(this.apiUrl, contentData);
  }

  

  getLastVisitedContent(email: string): Observable<Content | null> {
  return this.http.get<Content>(`${NAV_URL}/user/last-content?email=${email}`);
}

getContentsByUnit(level: string, unitNumber: number): Observable<Content[]> {
  return this.http.get<Content[]>(`${NAV_URL}/user/content/by-unit`, {
    params: { level, unitNumber }
  });
}

getContentWithStatus(email: string, level: string, unitNumber: number): Observable<ContentWithStatus[]> {
    return this.http.get<ContentWithStatus[]>(
      `${NAV_URL}/content/status?email=${email}&level=${level}&unitNumber=${unitNumber}`
    );
  }
  getContentById(id: number): Observable<Content> {
  return this.http.get<Content>(`${NAV_URL}/content/${id}`);
}

checkContentExists(level: string, type: string, unitNumber: number, contentNumber: number) {
  return this.http.get<boolean>(`${NAV_URL}/content/exists`, {
    params: {
      level,
      type,
      unitNumber: unitNumber.toString(),
      contentNumber: contentNumber.toString()
    }
  });
}


  

}
