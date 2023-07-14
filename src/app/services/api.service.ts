import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {
  }

  post(url: string, object: any) {
    return this.http.post<any>(`${environment.apiUrl}/${url}`, object);
  }

  get(url: string): any {
    return this.http.get<any>(`${environment.apiUrl}/${url}`);
  }

  put(url: string, object: any): any {
    return this.http.put<any>(`${environment.apiUrl}/${url}`, object);
  }

  delete(url: any) {
    return this.http.delete<any>(`${environment.apiUrl}/${url}`);
  }

  uploadFile(url: string, object: any) {
    return this.http.post<any>(`${environment.apiUrl}/${url}`, object, {
      reportProgress: true,
      observe: 'events',
    }).pipe(catchError(this.errorMgmt));
    ;

  }

  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => {
      return errorMessage;
    });
  }
}
