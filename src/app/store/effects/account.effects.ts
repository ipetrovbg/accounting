
import {of as observableOf,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import { AccountActionTypes, AccountsCreate, AccountsDeleteAll, AddMany, AddOne } from '../actions/account.actions';

import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { AccountModelExtended } from '../../transaction/account.model';
import 'rxjs-compat/add/observable/of';
import { AccountService } from '../../account/account.service';

@Injectable()
export class AccountEffects {

  @Effect() fetchAccounts = this.actions
    .pipe(
      ofType(AccountActionTypes.FETCH),
      switchMap(() => this.account.fetchAccounts()),
      map((accounts: { response: AccountModelExtended[]}) => accounts.response),
      mergeMap(data => [new AccountsDeleteAll(), new AddMany(data || [])]),
      catchError(err => {
        return observableOf(new AccountsDeleteAll());
      }),
    );
  @Effect() createAccount = this.actions
    .pipe(
      ofType(AccountActionTypes.CREATE),
      switchMap((action: AccountsCreate) => this.account.createAccount(action.name)),
      map((data: { success: boolean, response: {id: number, name: string}[] }) => data.response),
      map((data: any) => new AddOne(data[0]))
    );

  constructor(
    private actions: Actions,
    private account: AccountService
  ) {}
}

