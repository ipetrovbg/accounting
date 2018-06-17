import { UpdateOne, AddOne, DeleteOne } from './../../store/actions/transaction.actions';
import { TransactionManageState } from './../../store/states/transaction-manage.state';
import { DialogTransactionComponent } from './../../transaction/dialog-transaction/dialog-transaction.component';
import { TransactionState } from './../../store/states/transaction.state';
import { State as AppState, getState } from './../../store/accounting.state';
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
import { removeDebugNodeFromIndex } from '@angular/core/src/debug/debug_node';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  public gridData: BehaviorSubject<any> = new BehaviorSubject([]);
  public data: any[] = [];
  public state: State = { skip: 0, take: 100 };
  public loading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public subscription: Subscription = new Subscription();
  public menuData: Array<any> = [{
    text: 'Withdrawal',
    click: () => this.addHandler({ action: 'new', state: 'withdrawal' })
}, {
    text: 'Deposit',
    click: () => this.addHandler({ action: 'new', state: 'deposit' })
}];

  constructor(private core: CoreService,
              private transaction: TransactionService,
              private store: Store<AppState>,
              private dialogService: DialogService) {
  }

  ngOnInit() {
    this.loading.next(true);
    const transactions$ = this.store.select(selectAllTransactionsSelector);

    this.subscription.add(
      transactions$
        .subscribe(transactions => {
          setTimeout(() => this.loading.next(false), 300);
          this.data = transactions;
          this.gridData.next(process(this.data, this.state));
        })
    );

    const dates = this.core.startEndWorkMonth(5);
    this.store.select(state => state.user.token)
      .subscribe(token => {
        this.loading.next(true);
        if (token) {
          this.store.dispatch(new Fetch(dates.start, dates.end));
        }
      })
  }

  public addHandler(e) {

    this.store.dispatch(new Load({ withdrawal: null, deposit: null, id: null, reason: '', date: null, createdAt: null, updatedAt: null, isTest: false }));

    this.openDialog(e.action, e.state);
  }

  public removeHandler(e) {
    this.loading.next(true);
    console.log(e.dataItem);
    this.transaction
      .delete(e.dataItem.costId || e.dataItem.incomeId, e.dataItem.costId ? 'withdrawal' : 'deposit')
      .subscribe(response => {
        this.store.dispatch(new DeleteOne(e.dataItem.id));
      });
  }

  public editHandler(e) {

    const { withdrawal, deposit, id, costId, incomeId, reason, date, createdAt, updatedAt, isTest } = e.dataItem;
    const dataItem = { withdrawal, deposit, reason, date, createdAt, updatedAt, isTest, id: '' };
    dataItem.id = costId || incomeId;

    this.store.dispatch(new Load(dataItem));
    this.openDialog(e.action, costId ? 'withdrawal' : 'deposit', id );
  }

  public dataStateChange(state: DataStateChangeEvent) {
    
    setTimeout(() => this.loading.next(true), 0);

    this.store.dispatch(new DeleteAll());
    const dates = this.core.startEndWorkMonth(5);
    this.store.dispatch(new Fetch(dates.start, dates.end));

    this.state = state;
    this.gridData.next(process(this.data, this.state));
    
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store.dispatch(new DeleteAll());
  }

  private openDialog(state: 'new' | 'edit', transactionState: 'deposit' | 'withdrawal', id?: string) {

    const dialog: DialogRef = this.dialogService.open({
      title: `${state[0].toUpperCase() + state.substring(1)} Transaction`,
      content: DialogTransactionComponent,
      actions: [
          { text: 'Cancel' },
          { text: 'Save', primary: true }
      ],
      width: 850,
      minWidth: 250
  });

  const dialogTransactionComponent              = dialog.content.instance;
  dialogTransactionComponent.state              = state;
  dialogTransactionComponent.transactionState   = transactionState;

  dialog.result.subscribe((result) => {
      const transactionObject: any = getState(this.store).transactionManage;

      if (!(result instanceof DialogCloseResult) && result.primary) {      

        if (dialogTransactionComponent.transactionState === 'withdrawal') {
          transactionObject.costId = transactionObject.id;
        }
        if (dialogTransactionComponent.transactionState === 'deposit') {
          transactionObject.incomeid = transactionObject.id;
        }

        if (state === 'edit') {
          this.loading.next(true);
          const transactionEntity = { ...transactionObject };
          this.transaction.update(transactionEntity, dialogTransactionComponent.transactionState)
          .subscribe(result => {
            transactionObject.id = id;            
            this.store.dispatch(new UpdateOne(id, transactionObject));  
          }, err => this.loading.next(false));
                  
        } else {
          const transactionEntity = transactionObject;
          console.log(transactionEntity);

          this.transaction.add(transactionEntity, dialogTransactionComponent.transactionState).subscribe(response => {
            this.loading.next(true);
            this.store.dispatch(new DeleteAll());
            const dates = this.core.startEndWorkMonth(5);
            this.store.dispatch(new Fetch(dates.start, dates.end));
          });
          
        }
      }
  });
  }


}
