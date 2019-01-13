import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CoreService } from '../../core/core/core.service';
import { Router } from '@angular/router';
import { State, getState } from '../../store/accounting.state';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs-compat/add/observable/of';
import { Update } from '../../store/actions/user.actions';
import { Fetch } from '../../store/actions/settings.actions';

@Injectable()
export class AuthService {

  constructor(private http: HttpClient,
              private core: CoreService,
              private router: Router,
              private store: Store<State>) {
  }

  checkAuth() {
    return this.http.get(`${this.core.api}/authenticate/${getState(this.store).user.token}`);
  }

  tokenAuth(token, refreshToken?: string) {
    return this.http.post(`${this.core.api}/authenticate/token`, { token })
      .do((auth: any) => this.store.dispatch(new Fetch(auth.user.id)));
  }

  login(credentials) {
    return this.http.post(`${this.core.api}/authenticate`, credentials)
      .do(this.handleAuthentication.bind(this));
  }

  register(user) {
    return this.http.post(`${this.core.api}/authenticate/create`, { user });
  }

  private handleAuthentication(login: any) {
    if (login.success) {

      this.store.dispatch(new Update({
        token: login.token,
        email: login.user.email,
        name: login.user.name,
        password: '',
        id: login.user.id
      }));
      this.store.dispatch(new Fetch(login.user.id));

      localStorage.setItem('token', login.token);
      this.router.navigate(['/dashboard']);
    }
  }
}
