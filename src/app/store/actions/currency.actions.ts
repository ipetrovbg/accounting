import { Action } from '@ngrx/store';
import { Currency } from '../states/currency.state';

export enum CurrencyActionTypes {
  GET_ONE = '[Currency] Get One',
  ADD_ONE = '[Currency] Add One',
  UPDATE_ONE = '[Currency] Update One',
  DELETE_ONE = '[Currency] Delete One',
  DELETE_ALL = '[Currency] Delete All',
  GET_ALL = '[Currency] Get All',
  ADD_MANY = '[Currency] Add Many',
  FETCH = '[Currency] Fetch',
  CREATE = '[Currency] Create',
  LOAD = '[Currency] Load'
}
export class AccountsCreate implements Action {
  public readonly type: CurrencyActionTypes.CREATE = CurrencyActionTypes.CREATE;
  constructor( public name: string ) {}
}

export class Load implements Action {
  public readonly type: CurrencyActionTypes.LOAD = CurrencyActionTypes.LOAD;
  constructor( public currency: Currency ) {}
}

export class AccountsFetch implements Action {
  public readonly type: CurrencyActionTypes.FETCH = CurrencyActionTypes.FETCH;
}

export class AddOne implements Action {
  public readonly type: CurrencyActionTypes.ADD_ONE = CurrencyActionTypes.ADD_ONE;

  constructor( public currency: Currency ) { }
}

export class AddMany implements Action {
  public readonly type: CurrencyActionTypes.ADD_MANY = CurrencyActionTypes.ADD_MANY;

  constructor( public currencies: Currency[] ) { }
}

export class UpdateOne implements Action {
  readonly type: CurrencyActionTypes.UPDATE_ONE = CurrencyActionTypes.UPDATE_ONE;

  constructor(
    public id: number,
    public changes: Partial<Currency>,
  ) { }
}

export class DeleteOne implements Action {
  readonly type: CurrencyActionTypes.DELETE_ONE = CurrencyActionTypes.DELETE_ONE;
  constructor(public id: number) { }
}

export class AccountsDeleteAll implements Action {
  readonly type: CurrencyActionTypes.DELETE_ALL = CurrencyActionTypes.DELETE_ALL;
}

export class GetAll implements Action {
  readonly type: CurrencyActionTypes.GET_ALL = CurrencyActionTypes.GET_ALL;
  constructor(public accounts: Currency[]) { }
}

export class GetOne implements Action {
  readonly type: CurrencyActionTypes.GET_ONE = CurrencyActionTypes.GET_ONE;
  constructor(public id: number) { }
}

export type CurrencyActions = AddOne | GetOne | UpdateOne | DeleteOne | GetAll | AddMany | AccountsFetch | AccountsDeleteAll |
                            AccountsCreate | Load;
