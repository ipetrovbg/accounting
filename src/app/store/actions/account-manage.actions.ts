import { Action } from '@ngrx/store';
import { AccountManageState } from '../states/account-manage.state';
import { AccountModelExtended } from '../../transaction/account.model';

export enum AccountManageActionTypes {
  UPDATE = '[Account Manage] Update',
  LOAD = '[Account Manage] Load',
  UPDATE_EDIT = '[Account Manage] Update Edit',
  DELETE = '[Account Manage] Delete'
}

export class Update implements Action {
  public readonly type: AccountManageActionTypes.UPDATE = AccountManageActionTypes.UPDATE;
  constructor( public field: string, public value: any ) {}
}

export class Delete implements Action {
  public readonly type: AccountManageActionTypes.DELETE = AccountManageActionTypes.DELETE;
}

export class AccountLoad implements Action {
  public readonly type: AccountManageActionTypes.LOAD = AccountManageActionTypes.LOAD;
  constructor( public account: AccountManageState ) {}
}

export class UpdateEdit implements Action {
  public readonly type: AccountManageActionTypes.UPDATE_EDIT = AccountManageActionTypes.UPDATE_EDIT;
  constructor( public account: AccountModelExtended ) {}
}

export type AccountManageActions = Update | AccountLoad | UpdateEdit | Delete;
