import { Transaction } from './../../transaction/transaction.model';
import { Action } from '@ngrx/store';

export enum TransactionActionTypes {
    GET_ONE = '[Transaction] Get One',
    ADD_ONE = '[Transaction] Add One',
    UPDATE_ONE = '[Transaction] Update One',
    DELETE_ONE = '[Transaction] Delete One',
    DELETE_ALL = '[Transaction] Delete All',
    GET_ALL = '[Transaction] Get All',
    ADD_MANY = '[Transaction] Add Many',
    FETCH = '[Transaction] Fetch'
  }
  export class Fetch implements Action {
    public readonly type: TransactionActionTypes.FETCH = TransactionActionTypes.FETCH;
    constructor( public from: Date, public to: Date ) {}
  }

  export class AddOne implements Action {
    public readonly type: TransactionActionTypes.ADD_ONE = TransactionActionTypes.ADD_ONE;

    constructor( public transaction: Transaction ) { }
  }

  export class AddMany implements Action {
    public readonly type: TransactionActionTypes.ADD_MANY = TransactionActionTypes.ADD_MANY;

    constructor( public transactions: Transaction[] ) { }
  }

  export class UpdateOne implements Action {
    readonly type: TransactionActionTypes.UPDATE_ONE = TransactionActionTypes.UPDATE_ONE;

    constructor(
      public id: string,
      public changes: Partial<Transaction>,
    ) { }
  }

  export class DeleteOne implements Action {
    readonly type: TransactionActionTypes.DELETE_ONE = TransactionActionTypes.DELETE_ONE;
    constructor(public id: string) { }
  }

  export class DeleteAll implements Action {
    readonly type: TransactionActionTypes.DELETE_ALL = TransactionActionTypes.DELETE_ALL;
  }

  export class GetAll implements Action {
    readonly type: TransactionActionTypes.GET_ALL = TransactionActionTypes.GET_ALL;
    constructor(public transactions: Transaction[]) { }
  }

  export class GetOne implements Action {
    readonly type: TransactionActionTypes.GET_ONE = TransactionActionTypes.GET_ONE;
    constructor(public id: string) { }
  }

  export type TransactionsActions = AddOne | GetOne | UpdateOne | DeleteOne | GetAll | AddMany | Fetch | DeleteAll;
