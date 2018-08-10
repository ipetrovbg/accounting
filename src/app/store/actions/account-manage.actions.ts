import { Action } from '@ngrx/store';
import { AccountManageState } from '../states/account-manage.state';

export enum AccountManageActionTypes {
  UPDATE = '[Account Manage] Update',
  LOAD = '[Account Manage] Load'
}

export class Update implements Action {
  public readonly type: AccountManageActionTypes.UPDATE = AccountManageActionTypes.UPDATE;
  constructor( public field: string, public value: any ) {}
}

export class AccountLoad implements Action {
  public readonly type: AccountManageActionTypes.LOAD = AccountManageActionTypes.LOAD;
  constructor( public account: AccountManageState ) {}
}

export type AccountManageActions = Update | AccountLoad;
