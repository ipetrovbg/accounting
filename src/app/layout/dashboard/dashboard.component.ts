import { TransactionState } from './../../store/states/transaction.state';
import { State as AppState } from './../../store/accounting.state';
import { Observable } from 'rxjs/Observable';
import { TransactionService } from '../../transaction/transaction.service';
import { CoreService } from '../../core/core/core.service';
import { Component, OnDestroy, OnInit } from '@angular/core';

import 'rxjs/add/operator/map';
import { tap } from 'rxjs/operators/tap';

import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { BehaviorSubject, Subscription } from 'rxjs';
import { selectAllTransactionsSelector } from '../../store/reducers/transaction.reducer';
import { Store } from '@ngrx/store';
import { DeleteAll, Fetch } from '../../store/actions/transaction.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  public gridData: BehaviorSubject<any> = new BehaviorSubject([]);
  public data: any[] = [];
  public state: State = { skip: 0, take: 100 };
  public loading: boolean;
  public subscription: Subscription = new Subscription();

  constructor(private core: CoreService,
              private transaction: TransactionService,
              private store: Store<AppState>) {
  }

  ngOnInit() {
    const transactions$ = this.store.select(selectAllTransactionsSelector);
    this.loading = true;

    this.subscription.add(
      transactions$
        .pipe(tap(() => this.loading = false))
        .subscribe(transactions => {
          this.data = transactions;
          this.gridData.next(process(this.data, this.state));
        })
    );

    const dates = this.core.startEndWorkMonth(5);
    this.store.dispatch(new Fetch(dates.start, dates.end));
  }

  public dataStateChange(state: DataStateChangeEvent) {
    this.state = state;
    this.gridData.next(process(this.data, this.state));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store.dispatch(new DeleteAll());
  }


}
