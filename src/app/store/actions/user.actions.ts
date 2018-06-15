import { Action } from '@ngrx/store';
import { AddMany, AddOne, DeleteOne, Fetch, GetAll, GetOne, UpdateOne } from './transaction.actions';
import { UserState } from '../states/user.state';

export enum UserActionTypes {
  LOGIN = '[User] Login',
  UPDATE = '[User] Update',
  LOGOUT = '[User] Logout',
  TOKEN_LOGIN = '[User] Auto Login'
}

export class Login implements Action {
  public readonly type: UserActionTypes.LOGIN = UserActionTypes.LOGIN;
  constructor( public email: string, public password: string ) {}
}

export class Update implements Action {
  public readonly type: UserActionTypes.UPDATE = UserActionTypes.UPDATE;
  constructor( public user: UserState ) {}
}

export class Logout implements Action {
  public readonly type: UserActionTypes.LOGOUT = UserActionTypes.LOGOUT;
}

export class TokenAuthentication implements Action {
  public readonly type: UserActionTypes.TOKEN_LOGIN = UserActionTypes.TOKEN_LOGIN;
  constructor( public token: string ) {}
}

export type UserActions = Login | Update | Logout | TokenAuthentication;
