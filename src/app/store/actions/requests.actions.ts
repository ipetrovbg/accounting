import { Action } from '@ngrx/store';

export enum RequestsActionTypes {
  LOADING = '[Requests] Loading',
  SET_ERROR_MESSAGES = '[Requests] Set Error Messages',
  SET_ERROR = '[Requests] Set Error',
}
export class Loading implements Action {
  public readonly type: RequestsActionTypes.LOADING = RequestsActionTypes.LOADING;
  constructor( public entity: string, public loading: boolean ) {}
}
export class SetErrorMessages implements Action {
  public readonly type: RequestsActionTypes.SET_ERROR_MESSAGES = RequestsActionTypes.SET_ERROR_MESSAGES;
  constructor( public entity: string, public messages: string[] ) {}
}
export class SetError implements Action {
  public readonly type: RequestsActionTypes.SET_ERROR = RequestsActionTypes.SET_ERROR;
  constructor( public entity: string, public error: boolean ) {}
}
export type RequestsActions = Loading | SetErrorMessages | SetError;
