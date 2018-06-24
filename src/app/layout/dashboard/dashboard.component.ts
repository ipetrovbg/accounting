import { UpdateOne, AddOne, DeleteOne } from './../../store/actions/transaction.actions';
import { TransactionManageState } from './../../store/states/transaction-manage.state';
import { DialogTransactionComponent } from './../../transaction/dialog-transaction/dialog-transaction.component';
import { TransactionState } from './../../store/states/transaction.state';
import { State as AppState, getState } from './../../store/accounting.state';
import { Observable } from 'rxjs/Observable';
import { TransactionService } from '../../transaction/transaction.service';
import { CoreService } from '../../core/core/core.service';
import { Component, OnDestroy, OnInit, Inject, ViewChild, ElementRef, HostListener } from '@angular/core';

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
import 'rxjs-compat/add/operator/do';
import { IntlService } from '@progress/kendo-angular-intl';
import { CategoriesService } from '../../categories/categories.service';
import { Transaction } from '../../transaction/transaction.model';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  public gridData: BehaviorSubject<any> = new BehaviorSubject([]);
  public data: any[] = [];
  public state: State = {skip: 0, take: 100};
  public loading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public withdrawal: BehaviorSubject<number> = new BehaviorSubject(0);
  public deposit: BehaviorSubject<number> = new BehaviorSubject(0);
  public subscription: Subscription = new Subscription();
  public menuData: Array<any> = [{
    text: 'Withdrawal',
    click: () => this.addHandler({action: 'new', state: 'withdrawal'})
  }, {
    text: 'Deposit',
    click: () => this.addHandler({action: 'new', state: 'deposit'})
  }];
  public daysToNextSalary: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public min: Date = new Date();
  public max: Date = new Date();
  public show: boolean = false;

  public sparkData: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);


  @ViewChild('anchor') public anchor: ElementRef;
  @ViewChild('popup', {read: ElementRef}) public popup: ElementRef;

  @HostListener('keydown', ['$event'])
  public keydown(event: any): void {
    if (event.keyCode === 27) {
      this.toggle(false);
    }
  }

  @HostListener('document:click', ['$event'])
  public documentClick(event: any): void {
    if (!this.contains(event.target)) {
      this.toggle(false);
    }
  }

  constructor(private core: CoreService,
              private transaction: TransactionService,
              private store: Store<AppState>,
              private dialogService: DialogService,
              public intl: IntlService,
              private categories: CategoriesService) {
  }

  ngOnInit() {
    this.store.dispatch(new DeleteAll());

    this.daysToNextSalary.next(this.core.daysToNextSalary());
    this.max = this.core.startEndWorkMonth(5).end;

    this.loading.next(true);
    const transactions$ = this.store.select(selectAllTransactionsSelector);

    const dates = this.core.startEndWorkMonth(5);
    this.store.select(state => state.user.token)
      .subscribe(token => {
        if (token) {
          this.store.dispatch(new Fetch(dates.start, dates.end));
        }
      });

    this.subscription.add(
      transactions$
        .do(() => setTimeout(() => this.loading.next(false), 300))
        .subscribe(transactions => {
          this.data = [...transactions];
          const sortedTransactions = [...transactions.sort((a: any, b: any) => a.date - b.date)];

          this.sparkData.next(sortedTransactions
            .map(transaction => {
              return transaction.type === 'withdrawal' ? transaction.amount - (transaction.amount * 2) : transaction.amount;
            }));
          this.data.map((item: any) => {
            item.category = {
              category: item['category.category'],
              id: item['category.id'],
            };
            item.user = {
              id: item['user.id'],
              name: item['user.name'],
              email: item['user.email']
            };
            return item;
          });
          this.gridData.next(process(this.data, this.state));
          setTimeout(() => this.loading.next(false), 300);
        })
    );
    this.gridData.subscribe(data => {
      const aggregate = process(data.data, {
        group: [
          {
            field: 'type',
            aggregates: [
              {aggregate: 'sum', field: 'amount'}
            ]
          }
        ]
      });

      this.withdrawal.next(this.extract('withdrawal', aggregate));
      this.deposit.next(this.extract('deposit', aggregate));
    });
  }

  public toggle(show?: boolean): void {
    this.show = show !== undefined ? show : !this.show;
  }

  private extract(type, aggregate): number {
    let sum = 0;
    aggregate.data.forEach(item => {
      if (item.value === type) {
        sum = item.aggregates.amount.sum;
      }
    });
    return sum;
  }

  private contains(target: any): boolean {
    return this.anchor.nativeElement.contains(target) ||
      (this.popup ? this.popup.nativeElement.contains(target) : false);
  }

  public onShowRemainingDays() {
    this.show = !this.show;
  }

  public addHandler(e) {

    this.store.dispatch(new Load({
      amount: null,
      id: null,
      userId: null,
      categoryId: null,
      comment: '',
      type: e.state,
      date: null,
      createdAt: null,
      updatedAt: null,
      deletedAt: null,
      simulation: false,
      category: {id: null, category: ''},
      user: {email: '', name: '', id: null}
    }));

    this.openDialog(e.action, e.state);
  }

  public removeHandler(e) {
    const dialog: DialogRef = this.dialogService.open({
      title: `Please Confirm`,
      content: ConfirmDialogComponent,
      actions: [
        {text: 'No'},
        {text: 'Yes', primary: true}
      ],
      width: 420,
      minWidth: 250
    });

    dialog.content.instance.message = `Are you sure you want to remove this Transaction.`;
    dialog.content.instance.subMessage = `
    It is about ${this.intl.formatNumber(e.dataItem.amount, 'c')}
    ${e.dataItem.type[0].toUpperCase() + e.dataItem.type.substr(1)} on ${ moment(e.dataItem.date).format('DD/MMM YYYY') }`;

    dialog.result.subscribe(actions => {
      if (!(actions instanceof DialogCloseResult) && actions.primary) {
        this.loading.next(true);
        this.transaction.delete(e.dataItem.id).subscribe(() => this.store.dispatch(new DeleteOne(e.dataItem.id)));
      }
    });


  }

  public editHandler(e) {
    const {amount, id, comment, date, createdAt, updatedAt, simulation, category, user, type, userId, categoryId } = e.dataItem;
    const dataItem = {type, amount, id, userId, categoryId, comment, date, createdAt, updatedAt, simulation, category, user};
    this.store.dispatch(new Load(dataItem));
    this.openDialog(e.action, id);
  }

  public dataStateChange(state: DataStateChangeEvent) {
    this.state = state;
    const dates = this.core.startEndWorkMonth(5);
    this.refreshData(dates);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store.dispatch(new DeleteAll());
  }

  private openDialog(state: 'new' | 'edit', id?: number) {

    const dialog: DialogRef = this.dialogService.open({
      title: `${state[0].toUpperCase() + state.substring(1)} Transaction`,
      content: DialogTransactionComponent,
      actions: [
        {text: 'Cancel'},
        {text: 'Save', primary: true}
      ],
      width: 850,
      minWidth: 250
    });

    const dialogTransactionComponent = dialog.content.instance;
    dialogTransactionComponent.state = state;


    dialog.result.subscribe((result) => {
      const transaction: TransactionManageState = getState(this.store).transactionManage;

      if (!(result instanceof DialogCloseResult) && result.primary) {
        const dates = this.core.startEndWorkMonth(5);

        dialogTransactionComponent.state === 'new' ?
          this.transaction.add(transaction).subscribe(r => this.refreshData(dates)) :
          this.transaction.update(transaction).subscribe(r => this.refreshData(dates));
      }
    });
  }

  private refreshData(dates) {
    this.loading.next(true);
    this.store.dispatch(new DeleteAll());
    this.store.dispatch(new Fetch(dates.start, dates.end));
  }


}
