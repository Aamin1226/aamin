import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators'
import {AuthService} from '../services/auth.service';
import {LoadingService} from '../services/loading.service';

@Injectable()
export class AppInterceptorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private loadingService: LoadingService) {
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getAuthToken();
    if (token) {
      // If we have a token, we set it to the header
      request = request.clone({
        setHeaders: {Authorization: `Bearer ${token}`},
      });
    }
    this.loadingService.setLoading(true, request.url);
    return next.handle(request).pipe(
      catchError((err) => {
        this.loadingService.setLoading(false, request.url);
        throw err;
      }),
      map((evt: HttpEvent<any>) => {
        if (evt instanceof HttpResponse) {
          this.loadingService.setLoading(false, request.url);
        }
        return evt;
      })
    );
  }
}
