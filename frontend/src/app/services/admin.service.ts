import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Professor } from '../models/professor';

const NAV_URL = environment.apiUrl;

;

@Injectable({
  providedIn: 'root'
})
export class AdminService 
{
  professor = new Professor();

  constructor(private _http : HttpClient) { }

  

 getTotalProfessors(): Observable<number> {
  return this._http.get<number>(`${NAV_URL}/gettotalprofessors`);
}

  getTotalUsers(): Observable<number> {
  return this._http.get<number>(`${NAV_URL}/user/gettotalusers`);
}


  getTotalCourses(): Observable<any[]> | undefined 
  {
    return this._http.get<any>(`${NAV_URL}/gettotalcourses`);
  }

  getTotalWishlist(): Observable<any[]> | undefined 
  {
    return this._http.get<any>(`${NAV_URL}/gettotalwishlist`);
  }

  getTotalEnrollments(): Observable<any[]> | undefined 
  {
    return this._http.get<any>(`${NAV_URL}/gettotalenrollments`);
  }

  getTotalEnrollmentCount(): Observable<any[]> | undefined 
  {
    return this._http.get<any>(`${NAV_URL}/gettotalenrollmentcount`);
  }

  getTotalChapters(): Observable<any[]> | undefined 
  {
    return this._http.get<any>(`${NAV_URL}/gettotalchapters`);
  }

  getUsersAccessGender(): Observable<any> {
  return this._http.get(`${NAV_URL}/user/users-access-gender`);
}


  

}
