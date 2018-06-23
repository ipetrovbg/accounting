import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getState, State } from '../store/accounting.state';
import { Store } from '@ngrx/store';
import { CoreService } from '../core/core/core.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(
    private http: HttpClient,
    private store: Store<State>,
    private core: CoreService
  ) { }

  fetchCategories(): Observable<any> {
    const user = getState(this.store).user;
    return this.http.post(`${this.core.api}/transaction-category`, { token: user.token });
  }

  create(name) {
    const user = getState(this.store).user;
    return this.http.post(`${this.core.api}/transaction-category/create`, { token: user.token, name });
  }

  assignTransactionCategory(transaction, category, entity) {
    const user = getState(this.store).user;
    return this.http.post(`${this.core.api}/transaction-category/assign`, {token: user.token, transaction, category, entity});
  }
}
