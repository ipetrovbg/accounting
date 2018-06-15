import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Effect } from '@ngrx/effects';
import { TokenAuthentication, Update, UserActionTypes } from '../actions/user.actions';
import 'rxjs-compat/add/operator/switchMap';
import { AuthService } from '../../authentication/auth/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class UserEffects {
  constructor(
    private actions: Actions,
    private auth: AuthService,
    private router: Router
  ) {}

  @Effect() tokenAuth = this.actions.ofType(UserActionTypes.TOKEN_LOGIN)
    .switchMap((action: TokenAuthentication) => this.auth.tokenAuth(action.token))
    .map((response: any) => {
      if (response.success) {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/dashboard']);

        return new Update({
          token: response.token,
          email: response.user.email,
          name: response.user.name,
          password: ''
        });
      } else {
        return new Update({ name: '', email: '', password: '', token: '' });
      }
    });
}
