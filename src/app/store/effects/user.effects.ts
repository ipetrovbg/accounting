
import {of as observableOf,  Observable } from 'rxjs';

import {catchError, map, switchMap} from 'rxjs/operators';
import { UserState } from './../states/user.state';
import { Injectable } from '@angular/core';
import {Actions, ofType} from '@ngrx/effects';
import { Effect } from '@ngrx/effects';
import {ServerUserUpdate, TokenAuthentication, Update, UserActionTypes} from '../actions/user.actions';
import { AuthService } from '../../authentication/auth/auth.service';
import { Router } from '@angular/router';
import 'rxjs-compat/add/operator/switchMap';
import 'rxjs-compat/add/operator/catch';

@Injectable()
export class UserEffects {
  constructor(
    private actions: Actions,
    private auth: AuthService
  ) {}

  @Effect() updateUser = this.actions.pipe(
    ofType(UserActionTypes.SERVER_UPDATE),
    switchMap((action: ServerUserUpdate) => this.auth.updateUser(action.user)),
    map((response: any) => {
      if (response.success) {
        localStorage.setItem('token', response.token.token);

        return new Update(new UserState({
          id: response.response.id,
          token: response.token.token,
          email: response.response.email,
          name: response.response.name,
          password: ''
        }));
      } else {
        return new Update(new UserState());
      }
    }),
    catchError(() => observableOf(new Update(new UserState())))
  );

  @Effect() tokenAuth = this.actions.pipe(
    ofType(UserActionTypes.TOKEN_LOGIN),
    switchMap((action: TokenAuthentication) => this.auth.tokenAuth(action.token)),
    map((response: any) => {
      if (response.success) {
        localStorage.setItem('token', response.token);
        return new Update(new UserState({
          id: response.user.id,
          token: response.token,
          email: response.user.email,
          name: response.user.name,
          password: ''
        }));
      } else {
        return new Update(new UserState());
      }
    }),
    catchError(() => observableOf(new Update(new UserState()))));
}
