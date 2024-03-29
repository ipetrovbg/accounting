
import {of as observableOf,  Observable } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { getState, State } from '../store/accounting.state';
import { HttpClient } from '@angular/common/http';
import { CoreService } from '../core/core/core.service';
import { Store } from '@ngrx/store';
import { AccountModelExtended } from '../transaction/account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private http: HttpClient,
    private core: CoreService,
    private store: Store<State>
  ) { }


  fetchAccounts() {
    const user = getState(this.store).user;
    return this.http.post(`${this.core.api}/account`, { token: user.token }).pipe(
      catchError(() => observableOf([])));
  }

  createAccount(name) {
    const user = getState(this.store).user;
    return this.http.post(`${this.core.api}/account/create`, { token: user.token, name });
  }

  updateAccount(account: AccountModelExtended) {
    const user = getState(this.store).user;
    return this.http.post(`${this.core.api}/account/update`, { token: user.token, account });
  }
}
