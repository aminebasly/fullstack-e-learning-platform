import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Course } from '../models/course';
import { Enrollment } from '../models/enrollment';
import { Wishlist } from '../models/wishlist';
import { User } from 'src/app/models/user';
import { UserProfileDto } from '../models/user-profile.dto';
import { Content, UserProgress } from '../models/contents';

const NAV_URL = environment.apiUrl

;


@Injectable({
  providedIn: 'root'
})
export class UserService {
 

  constructor(private _http : HttpClient) { }
  private apiUrl = `${NAV_URL}/user/userlist`;
  private apiUrl1 = `${NAV_URL}/user`; 

  getAllUsers(): Observable<User[]> {
    return this._http.get<User[]>(this.apiUrl);
  }

  getYoutubeCourseList() : Observable<any>
  {
    return this._http.get<any>(`${NAV_URL}/youtubecourselist`);
  }

  getWebsiteCourseList() : Observable<any>
  {
    return this._http.get<any>(`${NAV_URL}/websitecourselist`);
  }

  getCourseListByName(coursename : string) : Observable<any>
  {
    return this._http.get<any>(`${NAV_URL}/courselistbyname/`+coursename);
  }

  enrollNewCourse(enrollment : Enrollment, loggedUser : string, currRole : string) : Observable<any>
  {
    return this._http.post<any>(`${NAV_URL}/enrollnewcourse/`+loggedUser+"/"+currRole,enrollment);
  }

  addToWishlist(wishlist : Wishlist) : Observable<any>
  {
    return this._http.post<any>(`${NAV_URL}/addtowishlist`,wishlist);
  }

  getEnrollmentStatus(coursename : string, loggedUser : string, currRole : string) : Observable<any>
  {
    return this._http.get<any>(`${NAV_URL}/getenrollmentstatus/`+coursename+"/"+loggedUser+"/"+currRole);
  }

  getEnrollmentByEmail(loggedUser : string, currRole : string) : Observable<any>
  {
    return this._http.get<any>(`${NAV_URL}/getenrollmentbyemail/`+loggedUser+"/"+currRole);
  }

  getWishlistStatus(coursename : string, loggedUser : string) : Observable<any>
  {
    return this._http.get<any>(`${NAV_URL}/getwishliststatus/`+coursename+"/"+loggedUser);
  }

  getWishlistByEmail(loggedUser : string) : Observable<any>
  {
    return this._http.get<any>(`${NAV_URL}/getwishlistbyemail/`+loggedUser);
  }

  getAllWishlist() : Observable<any>
  {
    return this._http.get<any>(`${NAV_URL}/getallwishlist`);
  }

  getChappterListByCourseName(coursename : string) : Observable<any>
  {
    return this._http.get<any>(`${NAV_URL}/getchapterlistbycoursename/`+coursename);
  }

  getProfileDetails(email: string): Observable<User> { // Changed to User instead of User[]
    return this._http.get<User>(`${NAV_URL}/user/profile/${email}`);
  }
  
  updateUserProfile(email: string, userProfile: UserProfileDto): Observable<User> {
  return this._http.put<User>(`${NAV_URL}/user/profile/${email}`, userProfile);
}


  getUserProfile(email: string): Observable<any> {
    const url = `${NAV_URL}/user/profile/${email}`;
    console.log('Fetching profile from:', url); // Debug URL
    return this._http.get<any>(url);
  }
  updateUserLevel(email: string, level: string): Observable<any> {
    return this._http.post<any>(`${NAV_URL}/user/update-level`, { email, level });
  }

  deleteUserByEmail(email: string): Observable<string> {
    const url = `${NAV_URL}/user/delete/${email}`;
    return this._http.delete(url, { responseType: 'text' });
  }

  searchUsers(query: string): Observable<User[]> {
    return this._http.get<User[]>(`${NAV_URL}/user/search?query=${encodeURIComponent(query)}`);
  }

  storeQuizResult(data: any): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.post(`${NAV_URL}/user/quiz-result`, data, {
      headers,
      responseType: 'text' // Expect plain text response
    });
  }

  getLevelAccess(email: string): Observable<{ [key: string]: boolean }> {
    return this._http.get<{ [key: string]: boolean }>(`${NAV_URL}/user/access/${email}`);
  }

  getLastContentVisited(email: string): Observable<Content | null> {
    const params = new HttpParams().set('email', email);
    return this._http.get<Content | null>(`${NAV_URL}/user/last-content`, { params });
  }

  updateLastContentVisited(email: string, contentId: number): Observable<void> {
    const params = new HttpParams()
      .set('email', email)
      .set('contentId', contentId.toString());
    return this._http.post<void>(`${NAV_URL}/user/last-content`, null, { params });
  }


  



  }
  


