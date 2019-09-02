
import {tap} from 'rxjs/operators';
import { State } from './../../store/accounting.state';
import { Store } from '@ngrx/store';
import { catchError } from 'rxjs/internal/operators';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Router } from '@angular/router';
import { Logout, TokenAuthentication } from '../../store/actions/user.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
    private router: Router,
    private store: Store<State>
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // this.store.dispatch(new TokenAuthentication(localStorage.getItem('token')));
    return next.handle(req).pipe(tap(response => {
      if (response instanceof HttpResponse) {
        // this.store.dispatch(new TokenAuthentication(localStorage.getItem('token')));
        if (response.status === 401 && (this.router.url !== '/register' && this.router.url !== '/login')) {
          localStorage.removeItem('token');
          this.store.dispatch(new Logout());
          this.router.navigate(['/login']);
        }
      }
    }, error => {

      if (error instanceof HttpErrorResponse) {
        if (error.status === 401 && (this.router.url !== '/register' && this.router.url !== '/login')) {
          localStorage.removeItem('token');
          this.store.dispatch(new Logout());
          this.router.navigate(['/login']);
        }
      }
    }));
  }

}
