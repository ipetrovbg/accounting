import { TransactionManageState } from './../../store/states/transaction-manage.state';
import { DialogTransactionComponent } from './../../transaction/dialog-transaction/dialog-transaction.component';
import { TransactionState } from './../../store/states/transaction.state';
import { State as AppState } from './../../store/accounting.state';
import { Observable } from 'rxjs/Observable';
import { TransactionService } from '../../transaction/transaction.service';
import { CoreService } from '../../core/core/core.service';
import { Component, OnDestroy, OnInit, Inject } from '@angular/core';

import 'rxjs/add/operator/map';
import { tap } from 'rxjs/operators/tap';

import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { BehaviorSubject, Subscription } from 'rxjs';
import { selectAllTransactionsSelector } from '../../store/reducers/transaction.reducer';
import { Store } from '@ngrx/store';
import { DeleteAll, Fetch } from '../../store/actions/transaction.actions';
import { DialogService, DialogRef, DialogCloseResult } from '@progress/kendo-angular-dialog';
import { Load } from '../../store/actions/transaction-manage.action';

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
              private store: Store<AppState>,
              private dialogService: DialogService) {
  }

  ngOnInit() {
    this.loading = true;
    const transactions$ = this.store.select(selectAllTransactionsSelector);

    this.subscription.add(
      transactions$
        .subscribe(transactions => {
          this.loading = false;
          this.data = transactions;
          this.gridData.next(process(this.data, this.state));
        })
    );

    const dates = this.core.startEndWorkMonth(5);
    this.store.select(state => state.user.token)
      .subscribe(token => {
        this.loading = true
        if (token) {
          this.store.dispatch(new Fetch(dates.start, dates.end));
        }
      })
  }

  public addHandler(e) {

    this.store.dispatch(new Load({ withdrawal: null, deposit: null, id: null, reason: '', date: null, createdAt: null, updatedAt: null, isTest: false }));

    this.openDialog(e.action);
  }

  public removeHandler(e) {
    console.log(e);
  }

  public editHandler(e) {

    const { withdrawal, deposit, id, costId, incomeId, reason, date, createdAt, updatedAt, isTest } = e.dataItem;
    const dataItem = { withdrawal, deposit, reason, date, createdAt, updatedAt, isTest, id: '' };
    dataItem.id = costId || incomeId;

    this.store.dispatch(new Load(dataItem));
    this.openDialog(e.action);
  }

  public dataStateChange(state: DataStateChangeEvent) {
    this.state = state;
    this.gridData.next(process(this.data, this.state));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store.dispatch(new DeleteAll());
  }

  private openDialog(state: 'add' | 'edit') {

    const dialog: DialogRef = this.dialogService.open({
      title: `${state[0].toUpperCase() + state.substring(1)} transaction`,
      content: DialogTransactionComponent,
      actions: [
          { text: 'Cancel' },
          { text: 'Save', primary: true }
      ],
      width: 450,
      height: 200,
      minWidth: 250
  });

  dialog.result.subscribe((result) => {
      if (!(result instanceof DialogCloseResult) && result.primary) {
        console.log(result);
      }
  });
  }


}
