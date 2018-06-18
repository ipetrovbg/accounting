import { TransactionManageState } from './../store/states/transaction-manage.state';
import { CoreService } from './../core/core/core.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/skipWhile';
import { Store } from '@ngrx/store';
import { State, getState } from '../store/accounting.state';
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

  fetch(from: Date = new Date(), to: Date = new Date()): Observable<Transaction[]> {
    return this.http.post(`${this.core.api}/transaction`, { token: getState(this.store).user.token, from, to })
      .map(this.mapTransactions.bind(this));
  }

  update(transaction: Transaction, type: 'withdrawal' | 'deposit'): Observable<any> {
    transaction.userId = getState(this.store).user.id;
    if (type === 'deposit') {
      return this.updateDeposit(transaction);
    } else {
      return this.updateWithdrawal(transaction);
    }
  }

  add(transaction: Transaction, type: 'withdrawal' | 'deposit'): Observable<any> {
    transaction.userId = getState(this.store).user.id;
    if (type === 'deposit') {
      return this.addDeposit(transaction);
    } else {
      return this.addWithdrawal(transaction);
    }
  }

  delete(id: number, type: 'withdrawal' | 'deposit'): Observable<any> {

    const user = getState(this.store).user;
    let url = this.core.api;

    if (type === 'deposit') {
      url += '/income/';
    } else {
      url += '/cost/';
    }

    return this.http.request('delete', `${url}${id}`, { body: { token: user.token  } });
  }

  updateWithdrawal(transaction: Transaction) {
    const user = getState(this.store).user;
    transaction.cost = transaction.withdrawal;
    return this.http
           .put(`${this.core.api}/cost/${transaction.id}`, { token: user.token, cost: JSON.stringify(transaction)});
  }

  updateDeposit(transaction: Transaction) {
    transaction.income = transaction.deposit;
    return this.http
          .put(`${this.core.api}/income/${transaction.id}`, {
            income: JSON.stringify(transaction),
            token: getState(this.store).user.token
          });
  }

  addWithdrawal(transaction: Transaction) {
    transaction.cost = transaction.withdrawal;
    return this.http.post(`${this.core.api}/cost`,
      { token: getState(this.store).user.token, cost: JSON.stringify(transaction)}
    );
  }

  addDeposit(transaction: Transaction) {
    transaction.income = transaction.deposit;
    return this.http.post(`${this.core.api}/income`, {
      income: JSON.stringify(transaction),
      token: getState(this.store).user.token
    });
  }

  private mapTransactions(response: Transaction[]) {
    if (!response) {
      return [];
    }
    return response.map(this.puryFyTransactions.bind(this));
  }

  private puryFyTransactions(transaction: Transaction): Transaction {
    transaction.date       = new Date(transaction.date);
    transaction.id         = this.core.UUID();

    if (transaction.updatedAt) {
      transaction.updatedAt  = new Date(transaction.updatedAt);
    }

    if (transaction.createdAt) {
      transaction.createdAt  = new Date(transaction.createdAt);
    }
    if (transaction.deposit) {
      transaction.deposit       = +transaction.deposit;
    }
    if (transaction.withdrawal) {
      transaction.withdrawal       = +transaction.withdrawal;
    }
    return transaction;
  }
}
