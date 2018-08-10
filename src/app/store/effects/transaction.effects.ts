import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { AddMany, DeleteAll, Fetch, TransactionActionTypes } from '../actions/transaction.actions';

import { switchMap, map } from 'rxjs/operators';
import { TransactionService } from '../../transaction/transaction.service';

@Injectable()
export class TransactionEffects {

  constructor(
    private actions: Actions,
    private transactions: TransactionService
  ) {}

  @Effect() fetchTransactions = this.actions.ofType(TransactionActionTypes.FETCH)
    .pipe(
      switchMap((action: Fetch) => this.transactions.fetch(action.from, action.to, action.account)),
      switchMap(data => [new DeleteAll(), new AddMany(data) ])
    );
}

