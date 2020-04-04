import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {CoreService} from '../../core/core/core.service';
import {getState, State} from '../../store/accounting.state';
import {Store} from '@ngrx/store';
import {Budget} from '../../store/states/budget.state';
import {Observable} from 'rxjs';

export interface BudgetResponse {
  success: boolean;
  response: Budget[];
}

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  constructor(
    private http: HttpClient,
    private core: CoreService,
    private store: Store<State>
  ) {}

  getAll(token: string): Observable<BudgetResponse> {
    return this.http.post<BudgetResponse>(`${this.core.api}/budget`, {token});
  }

  create(budget: Budget) {
    return this.http.post(`${this.core.api}/budget/create`, {budget, token: getState(this.store).user.token});
  }
}
