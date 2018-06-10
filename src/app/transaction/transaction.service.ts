import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/skipWhile';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(
    private http: HttpClient
  ) { }

  fetch(from: Date = new Date(), to: Date = new Date()) {

    const url = `${from.getFullYear()}-${from.getMonth() + 1}-${from.getDate()}/${to.getFullYear()}-${to.getMonth() + 1 }-${to.getDate()}`;

    return this.http.post(`https://ancient-fjord-87958.herokuapp.com/api/v1/cost/${url}`, {
      token: localStorage.getItem('token')
    }).skipWhile((result: any) => !result.success).map((response: any) => response.response.map(item => {
      item.date       = new Date(item.date);

      if (item.updatedAt)
        item.updatedAt  = new Date(item.updatedAt);
      if (item.createdAt)
        item.createdAt  = new Date(item.createdAt);

      item.cost       = +item.cost;
      return item;
    }));
  }
}
