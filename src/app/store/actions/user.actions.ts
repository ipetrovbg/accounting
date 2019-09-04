import { Action } from '@ngrx/store';
import { UserState } from '../states/user.state';

export enum UserActionTypes {
  LOGIN = '[User] Login',
  UPDATE = '[User] Update',
  SERVER_UPDATE = '[User] Server Update',
  LOGOUT = '[User] Logout',
  TOKEN_LOGIN = '[User] Auto Login'
}

export class Login implements Action {
  public readonly type: UserActionTypes.LOGIN = UserActionTypes.LOGIN;
  constructor( public email: string, public password: string ) {}
}

export class ServerUserUpdate implements Action {
  public readonly type: UserActionTypes.SERVER_UPDATE = UserActionTypes.SERVER_UPDATE;
  constructor(public user: Partial<UserState>) {}
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
  constructor( public token: string, public refreshToken?: string) {}
}

export type UserActions = Login | Update | Logout | TokenAuthentication | ServerUserUpdate;
