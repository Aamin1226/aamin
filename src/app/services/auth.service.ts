import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {APP_CONFIG} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {
  }

  getAuthToken(): string | null {
    return localStorage.getItem('kopist-token');
  }

  login(data: object): Observable<any> {
    return this.http.post(`${APP_CONFIG.apiUrl}/login`, data);
  }

  registerUser(data: object): Observable<any> {
    return this.http.post(`${APP_CONFIG.apiUrl}/register`, data);
  }

  googleLogin(data: object): Observable<any> {
    return this.http.post(`${APP_CONFIG.apiUrl}/social/google`, data);
  }

  resetPassword(data: object): Observable<any> {
    return this.http.post(`${APP_CONFIG.apiUrl}/forgot`, data);
  }

  resendCodeOnEmail(data: object): Observable<any> {
    return this.http.post(`${APP_CONFIG.apiUrl}/email/resend`, data);
  }

  changePassword(data: any): Observable<any> {
    return this.http.post(`${APP_CONFIG.apiUrl}/user/changepassword`, data);
  }

  verifyCodeAndPassword(data: any): Observable<any> {
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   Authorization: `Bearer ${auth_token}`,
    // });
    return this.http.post(`${APP_CONFIG.apiUrl}/reset`, data);
  }

  validateCode(data: any): Observable<any> {
    return this.http.post(`${APP_CONFIG.apiUrl}/token/validate`, data);
  }

  validateEmail(data: any): Observable<any> {
    return this.http.get(`${APP_CONFIG.apiUrl}/email/verify/${data.id}/${data.hash}`);
  }

  revokeToken(token: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = `token=${token}`;

    return this.http.post('https://oauth2.googleapis.com/revoke', body, {headers});
  }

  acceptInviation(data: any) {
    return this.http.get(`${APP_CONFIG.apiUrl}/team/join/${data.id}/${data.email}`);
  }

  getPersonalize(): Observable<any> {
    return this.http.get(`${APP_CONFIG.apiUrl}/personalize/questions`);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${APP_CONFIG.apiUrl}/user`);
  }

  getPersonalizeQuestions(): Observable<any> {
    return this.http.get(`${APP_CONFIG.apiUrl}/user/questions`);
  }

  getUserTeam(): Observable<any> {
    return this.http.get(`${APP_CONFIG.apiUrl}/team/teammates`);
  }

  getMyFavorite(): Observable<any> {
    return this.http.get(`${APP_CONFIG.apiUrl}/document/favourite/my`);
  }

  savePersonalizePrefrence(data: any) {
    return this.http.post(`${APP_CONFIG.apiUrl}/save/personalize/questions`, data);
  }

  updateProfile(data: any) {
    return this.http.post(`${APP_CONFIG.apiUrl}/user/update/profile`, data);
  }

  createTeam(data: any) {
    return this.http.post(`${APP_CONFIG.apiUrl}/team/create`, data);
  }

  isLoggedIn() {
    return localStorage.getItem('kopist-token');
  }
}
