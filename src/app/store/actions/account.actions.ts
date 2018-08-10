import { Account } from './../../transaction/account.model';
import { Action } from '@ngrx/store';

export enum AccountActionTypes {
  GET_ONE = '[Account] Get One',
  ADD_ONE = '[Account] Add One',
  UPDATE_ONE = '[Account] Update One',
  DELETE_ONE = '[Account] Delete One',
  DELETE_ALL = '[Account] Delete All',
  GET_ALL = '[Account] Get All',
  ADD_MANY = '[Account] Add Many',
  FETCH = '[Account] Fetch',
  CREATE = '[Account] Create'
}
export class AccountsCreate implements Action {
  public readonly type: AccountActionTypes.CREATE = AccountActionTypes.CREATE;
  constructor( public name: string ) {}
}

export class AccountsFetch implements Action {
  public readonly type: AccountActionTypes.FETCH = AccountActionTypes.FETCH;
}

export class AddOne implements Action {
  public readonly type: AccountActionTypes.ADD_ONE = AccountActionTypes.ADD_ONE;

  constructor( public account: Account ) { }
}

export class AddMany implements Action {
  public readonly type: AccountActionTypes.ADD_MANY = AccountActionTypes.ADD_MANY;

  constructor( public accounts: Account[] ) { }
}

export class UpdateOne implements Action {
  readonly type: AccountActionTypes.UPDATE_ONE = AccountActionTypes.UPDATE_ONE;

  constructor(
    public id: number,
    public changes: Partial<Account>,
  ) { }
}

export class DeleteOne implements Action {
  readonly type: AccountActionTypes.DELETE_ONE = AccountActionTypes.DELETE_ONE;
  constructor(public id: number) { }
}

export class AccountsDeleteAll implements Action {
  readonly type: AccountActionTypes.DELETE_ALL = AccountActionTypes.DELETE_ALL;
}

export class GetAll implements Action {
  readonly type: AccountActionTypes.GET_ALL = AccountActionTypes.GET_ALL;
  constructor(public accounts: Account[]) { }
}

export class GetOne implements Action {
  readonly type: AccountActionTypes.GET_ONE = AccountActionTypes.GET_ONE;
  constructor(public id: number) { }
}

export type AccountActions = AddOne | GetOne | UpdateOne | DeleteOne | GetAll | AddMany | AccountsFetch | AccountsDeleteAll |
                            AccountsCreate;
