import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Professor } from '../models/professor';
import { User } from '../models/user';

const NAV_URL = environment.apiUrl

;

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  

  constructor(private http: HttpClient) {}

  registerUserFromRemote(user: User) {
    return this.http.post(`${NAV_URL}/registeruser`, user, { withCredentials: true });
  }

  registerProfessorFromRemote(professor: Professor) {
    return this.http.post(`${NAV_URL}/registerprofessor`, professor, { withCredentials: true });
  }
}
