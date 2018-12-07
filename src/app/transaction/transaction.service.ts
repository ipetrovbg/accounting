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
import 'rxjs-compat/add/observable/of';
import { Account } from './account.model';
import { Update } from '../store/actions/user.actions';

@Injectable()
export class TransactionService {

  constructor(
    private http: HttpClient,
    private core: CoreService,
    private store: Store<State>
  ) { }

  fetchGroup(from: Date = new Date(), to: Date = new Date(), account) {
    return this.http.post(`${this.core.api}/transaction/group`, { token: getState(this.store).user.token, from, to, account })
      .map((response: any) => {
        if (response.success) {
          localStorage.setItem('token', response.token.token);
          this.store.dispatch(new Update({
            id: response.token.userId,
            email: response.token.email,
            token: response.token.token,
            name: getState(this.store).user.name,
            password: ''
          }));
        }
        return response;
      })
      .catch(() => Observable.of([]));
  }
  fetchGroupByCategory(from, to, account) {
    return this.http.post(`${this.core.api}/transaction/group-by-category`, { token: getState(this.store).user.token, from, to, account });
  }

  fetch(from: Date = new Date(), to: Date = new Date(), account?: number): Observable<Transaction[]> {
    return this.http.post(`${this.core.api}/transaction`, { token: getState(this.store).user.token, from, to, account })
      .map((response: any) => {
        if (response.success) {
          localStorage.setItem('token', response.token.token);
          this.store.dispatch(new Update({
            id: response.token.userId,
            email: response.token.email,
            token: response.token.token,
            name: getState(this.store).user.name,
            password: ''
          }));
        }
        return response;
      })
      .catch(() => Observable.of([]))
      .map(this.mapTransactions.bind(this));
  }

  update(transaction: Transaction): Observable<any> {
    const user = getState(this.store).user;
    return this.http.put(`${this.core.api}/transaction/update/${transaction.id}`, { token: user.token, transaction })
      .map((response: any) => {
        if (response.success) {
          localStorage.setItem('token', response.token.token);
          this.store.dispatch(new Update({
            id: response.token.userId,
            email: response.token.email,
            token: response.token.token,
            name: getState(this.store).user.name,
            password: ''
          }));
        }
        return response;
      });
  }

  add(transaction: Transaction): Observable<any> {
    const user = getState(this.store).user;
    return this.http.post(`${this.core.api}/transaction/create`, { token: user.token, transaction })
      .map((response: any) => {
        if (response.success) {
          localStorage.setItem('token', response.token.token);
          this.store.dispatch(new Update({
            id: response.token.userId,
            email: response.token.email,
            token: response.token.token,
            name: getState(this.store).user.name,
            password: ''
          }));
        }
        return response;
      });
  }

  delete(id: number): Observable<any> {

    const user = getState(this.store).user;

    return this.http.request('delete', `${this.core.api}/transaction/delete/${id}`, { body: { token: user.token  } })
      .map((response: any) => {
        if (response.success) {
          localStorage.setItem('token', response.token.token);
          this.store.dispatch(new Update({
            id: response.token.userId,
            email: response.token.email,
            token: response.token.token,
            name: getState(this.store).user.name,
            password: ''
          }));
        }
        return response;
      });
  }

  transfer(withdrawalAccount: Account, depositAccount: Account, amount: number, rate: number) {
    const user = getState(this.store).user;
    const body = { token: user.token, from: withdrawalAccount.id, to: depositAccount.id, amount, rate};
    return this.http.post(`${this.core.api}/transaction/transfer`, body)
      .map((response: any) => {
        if (response.success) {
          localStorage.setItem('token', response.token.token);
          this.store.dispatch(new Update({
            id: response.token.userId,
            email: response.token.email,
            token: response.token.token,
            name: getState(this.store).user.name,
            password: ''
          }));
        }
        return response;
      });
  }

  private mapTransactions(response: { success: boolean, response: Transaction[] }) {
    if (response && !response.success) {
      return [];
    }
    return response.response.map(this.puryFyTransactions.bind(this));
  }

  private puryFyTransactions(transaction: Transaction | any): Transaction {
    transaction.date       = new Date(transaction.date);

    if (transaction.updatedAt) {
      transaction.updatedAt  = new Date(transaction.updatedAt);
    }

    if (transaction.createdAt) {
      transaction.createdAt  = new Date(transaction.createdAt);
    }
    if (transaction.deletedAt) {
      transaction.deletedAt  = new Date(transaction.deletedAt);
    }
    return transaction;
  }
}
