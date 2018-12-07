import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CoreService } from './core/core.service';
import { getState, State } from '../store/accounting.state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Currency } from '../store/states/currency.state';

export interface Rate {
  id: number;
  rate: number;
  createdAt: Date;
  updateddAt: Date;
  currencyFrom: Currency;
  currencyTo: Currency;
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor(
    private http: HttpClient,
    private core: CoreService,
    private store: Store<State>,
  ) { }

  getCurrencies() {
    const user = getState(this.store).user;
    return this.http.post(`${this.core.api}/currency`, { token: user.token });
  }

  getCurrencyPairRate(from, to): Observable<Rate> {
    return this.http.post<Rate>(`${this.core.api}/rates`, { from, to});
  }
}
