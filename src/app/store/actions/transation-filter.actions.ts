import { Action } from '@ngrx/store';

export enum AccountActionTypes {
  UPDATE = '[Transaction Filter] Update'
}

export class TransactionFilterUpdate implements Action {
  public readonly type: AccountActionTypes.UPDATE = AccountActionTypes.UPDATE;
  constructor( public key: string, public value: any ) {}
}

export type TransactionFilterActions = TransactionFilterUpdate;
