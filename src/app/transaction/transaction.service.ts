import { CoreService } from './../core/core/core.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/skipWhile';
import { Store } from '@ngrx/store';
import { State } from '../store/accounting.state';
import { Transaction } from './transaction.model';
import { Observable } from 'rxjs';
import 'rxjs-compat/add/operator/switchMap';

@Injectable()
export class TransactionService {

  constructor(
    private http: HttpClient,
    private core: CoreService,
    private store: Store<State>
  ) { }

  private static UUID(): string {
    let d = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      // tslint:disable-next-line:no-bitwise
      const r = ( d + Math.random() * 16 ) % 16 | 0;
      d = Math.floor(d / 16 );
      // tslint:disable-next-line:no-bitwise
      return (c === 'x' ? r : ( r & 0x3 | 0x8 )).toString(16);
    });
    return uuid;
  }

  private static puryFyTransactions(transaction: Transaction): Transaction {
    transaction.date       = new Date(transaction.date);
    transaction.id         = TransactionService.UUID();

    if (transaction.updatedAt) {
      transaction.updatedAt  = new Date(transaction.updatedAt);
    }

    if (transaction.createdAt) {
      transaction.createdAt  = new Date(transaction.createdAt);
    }
    transaction.deposit       = +transaction.deposit;
    transaction.withdrawal       = +transaction.withdrawal;

    return transaction;
  }

  fetch(from: Date = new Date(), to: Date = new Date()): Observable<Transaction[]> {
    const url = `${from.getFullYear()}-${from.getMonth() + 1}-${from.getDate()}/${to.getFullYear()}-${to.getMonth() + 1 }-${to.getDate()}`;

    return this.store.select(state => state.user.token)
      .switchMap(token => this.http.post(`${this.core.api}/transaction`, { token }))
      .map(this.mapTransactions.bind(this));
  }

  private mapTransactions(response: Transaction[]) {
    if (!response) {
      return [];
    }
    return response.map(TransactionService.puryFyTransactions.bind(this));
  }
}
