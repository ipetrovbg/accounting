import { CoreService } from './../core/core/core.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/skipWhile';
import { Store } from '@ngrx/store';
import { State } from '../store/accounting.state';
import { AddMany } from '../store/actions/transaction.actions';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(
    private http: HttpClient,
    private core: CoreService,
    private store: Store<State>
  ) { }

  fetch(from: Date = new Date(), to: Date = new Date()) {

    const url = `${from.getFullYear()}-${from.getMonth() + 1}-${from.getDate()}/${to.getFullYear()}-${to.getMonth() + 1 }-${to.getDate()}`;

    return this.http.post(`${this.core.api}/cost/${url}`, {
      token: localStorage.getItem('token')
    }).skipWhile((result: any) => !result.success).map((response: any) => response.response.map(item => {
      item.date       = new Date(item.date);

      if (item.updatedAt)
        item.updatedAt  = new Date(item.updatedAt);
      if (item.createdAt)
        item.createdAt  = new Date(item.createdAt);

      item.cost       = +item.cost;
      return item;
    })).map(transactions => {
      this.store.dispatch(new AddMany(transactions));
      return transactions;
    });
  }
}
