import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CoreService } from '../core/core.service';
import { Store } from '@ngrx/store';
import { getState, State } from '../../store/accounting.state';

@Injectable({
  providedIn: 'root'
})
export class CommitService {

  constructor(
    private http: HttpClient,
    private core: CoreService,
    private store: Store<State>
  ) { }

  all() {
    const token = getState(this.store).user.token;
    return this.http.post(`${this.core.api}/commit`, { token });
  }

  createCommit() {
    const token = getState(this.store).user.token;
    return this.http.post(`${this.core.api}/commit/create`, { token });
  }
  commit() {
    const token = getState(this.store).user.token;
    return this.http.post(`${this.core.api}/commit/commit`, { token });
  }

  remove() {
    const token = getState(this.store).user.token;
    return this.http.request('delete', `${this.core.api}/commit`, { body: {token} });
  }
}
