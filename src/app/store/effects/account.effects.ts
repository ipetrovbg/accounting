import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { AccountActionTypes, AccountsCreate, AccountsDeleteAll, AddMany, AddOne } from '../actions/account.actions';

import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { TransactionService } from '../../transaction/transaction.service';
import { Account } from '../../transaction/account.model';
import { Observable } from 'rxjs/Observable';
import 'rxjs-compat/add/observable/of';

@Injectable()
export class AccountEffects {

  @Effect() fetchAccounts = this.actions.ofType(AccountActionTypes.FETCH)
    .pipe(
      switchMap(() => this.transactions.fetchAccounts()),
      map((accounts: { response: Account[]}) => accounts.response),
      mergeMap(data => [new AccountsDeleteAll(), new AddMany(data || [])]),
      catchError(err => {
        console.log(err);
        return Observable.of(new AccountsDeleteAll());
      }),
    );
  @Effect() createAccount = this.actions.ofType(AccountActionTypes.CREATE)
    .pipe(
      switchMap((action: AccountsCreate) => this.transactions.createAccount(action.name)),
      map((data: { success: boolean, response: {id: number, name: string}[] }) => data.response),
      map((data: any) => new AddOne(data[0]))
    );

  constructor(
    private actions: Actions,
    private transactions: TransactionService
  ) {}
}

