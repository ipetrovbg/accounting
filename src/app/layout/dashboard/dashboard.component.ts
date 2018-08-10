import { AddOne, DeleteOne } from '../../store/actions/transaction.actions';
import { TransactionManageState } from '../../store/states/transaction-manage.state';
import { DialogTransactionComponent } from '../../transaction/dialog-transaction/dialog-transaction.component';
import { State as AppState, getState } from '../../store/accounting.state';
import { Observable } from 'rxjs/Observable';
import { TransactionService } from '../../transaction/transaction.service';
import { CoreService } from '../../core/core/core.service';
import { Component, OnDestroy, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';

import 'rxjs/add/operator/map';

import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { BehaviorSubject, Subscription } from 'rxjs';
import { selectAllTransactionsSelector } from '../../store/reducers/transaction.reducer';
import { selectAllAccountsSelector } from '../../store/reducers/account.reducer';
import { Store } from '@ngrx/store';
import { DeleteAll, Fetch } from '../../store/actions/transaction.actions';
import { AccountsFetch, AccountsDeleteAll, AccountsCreate } from '../../store/actions/account.actions';
import { DialogService, DialogRef, DialogCloseResult } from '@progress/kendo-angular-dialog';
import { Load } from '../../store/actions/transaction-manage.action';
import 'rxjs-compat/add/operator/do';
import { IntlService } from '@progress/kendo-angular-intl';
import { CategoriesService } from '../../categories/categories.service';
import { Account } from '../../transaction/account.model';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import * as moment from 'moment';
import { AccountLoad } from '../../store/actions/account-manage.actions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogTransferComponent } from '../../transaction/dialog-transfer/dialog-transfer.component';
import { Transaction } from '../../transaction/transaction.model';
import { DialogTransactionDatesComponent } from '../../transaction/dialog-transaction-dates/dialog-transaction-dates.component';
import { TransactionFilterUpdate } from '../../store/actions/transation-filter.actions';
import { TransactionFilterState } from '../../store/states/transaction-filter.state';
import { state } from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  public gridData: BehaviorSubject<any> = new BehaviorSubject([]);
  public data: any[] = [];
  public state: State = {skip: 0, take: 1000};
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
  },
    {
      text: 'Transfer',
      click: () => this.transferHandler({ action: 'transfer' })
  }];
  public daysToNextSalary: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public min: Date = new Date();
  public max: Date = new Date();
  public showAccount: boolean = false;
  public accounts$: Observable<Account[]>;
  public selectedAccount$: Observable<Account>;
  public transactionFilter$: Observable<TransactionFilterState>;
  public accountForm: FormGroup;

  public sparkData: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);


  @ViewChild('anchorCategory') public anchorCategory: ElementRef;
  @ViewChild('popup', {read: ElementRef}) public popup: ElementRef;

  @HostListener('keydown', ['$event'])
  public keydown(event: any): void {
    if (event.keyCode === 27) {
      this.toggleCat(false);
    }
  }

  @HostListener('document:click', ['$event'])
  public documentClick(event: any): void {
    if (!this.containsCat(event.target)) {
      this.toggleCat(false);
    }
  }

  constructor(private core: CoreService,
              private transaction: TransactionService,
              private store: Store<AppState>,
              private dialogService: DialogService,
              public intl: IntlService,
              private categories: CategoriesService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    if (!getState(this.store).transactionFilter.from && !getState(this.store).transactionFilter.to) {
      this.store.dispatch(new TransactionFilterUpdate('from', this.core.startEndWorkMonth(5).start));
      this.store.dispatch(new TransactionFilterUpdate('to', this.core.startEndWorkMonth(5).end));
    }

    this.store.dispatch(new DeleteAll());
    this.store.dispatch(new AccountsDeleteAll());
    this.accountForm = this.fb.group({
      name: ['', Validators.required]
    });


    this.daysToNextSalary.next(this.core.daysToNextSalary());
    this.max = this.core.startEndWorkMonth(5).end;

    this.loading.next(true);
    const transactions$ = this.store.select(selectAllTransactionsSelector);
    this.transactionFilter$ = this.store.select(filterState => filterState.transactionFilter);
    this.selectedAccount$ = this.store.select(state2 => state2.accountManage).do(accountManage => {
      if (accountManage.id)
        this.store.dispatch(new TransactionFilterUpdate('account', accountManage.id));
    });

    this.accounts$ = this.store.select(selectAllAccountsSelector).do(accounts => {
      accounts.forEach(account => {
        if (account.name === 'Main' && !getState(this.store).transactionFilter.account) {
          this.store.dispatch(new AccountLoad(account));
        }
      });
    });
    this.store.select(state => state.user.token)
      .subscribe(token => {
        if (token)
          this.store.dispatch(new AccountsFetch());
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
            item.account = {
              name: item['account.name'],
              id: item['account.id'],
            };
            item.user = {
              id: item['user.id'],
              name: item['user.name'],
              email: item['user.email']
            };
            return item;
          });
          this.gridData.next(process(this.data, this.state));
        }, err => this.loading.next(false)));

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

    this.transactionFilter$.map(filter => {
      this.loading.next(true);
      this.store.dispatch(new DeleteAll());
      return filter;
    }).subscribe(filter => {
      if (filter.account && filter.from && filter.to) {
        this.loading.next(true);
        this.store.dispatch(new Fetch(filter.from, filter.to, filter.account));
      }
    });
  }

  createAccount() {
    if (this.accountForm.get('name').valid) {
      this.store.dispatch(new AccountsCreate(this.accountForm.get('name').value));
      setTimeout(() => this.toggleCat(false), 300);
    }
  }

  openCategoryDialog() {
    this.accountForm.reset();
    this.showAccount = !this.showAccount;
  }

  public accountSelect(e) {
    this.store.dispatch(new AccountLoad(e));
  }

  public toggleCat(show?: boolean): void {
    this.showAccount = show !== undefined ? show : !this.showAccount;
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

  private containsCat(target: any): boolean {
    return this.anchorCategory.nativeElement.contains(target) ||
      (this.popup ? this.popup.nativeElement.contains(target) : false);
  }

  public onShowRemainingDays() {
    const dialog: DialogRef = this.dialogService.open({
      title: `Select dates`,
      content: DialogTransactionDatesComponent,
      actions: [
        {text: 'Cancel'},
        {text: 'Apply', primary: true}
      ],
      width: 360
    });

    const form = dialog.content.instance;

    dialog.result.subscribe(actions => {
      if (!(actions instanceof DialogCloseResult) && actions.primary) {
        this.loading.next(true);
        this.store.dispatch(new TransactionFilterUpdate('from', form.form.value.start));
        this.store.dispatch(new TransactionFilterUpdate('to', form.form.value.end));
      }
    });
  }

  public transferHandler(e) {
    const dialog: DialogRef = this.dialogService.open({
      title: `Transfer`,
      content: DialogTransferComponent,
      actions: [
        {text: 'Cancel'},
        {text: 'Save', primary: true}
      ],
      width: 650,
      minWidth: 250
    });
    dialog.result.subscribe(actions => {
      if (!(actions instanceof DialogCloseResult) && actions.primary) {
        if (dialog.content.instance.form.valid) {
          this.loading.next(true);
          const withdrawalAccount = dialog.content.instance.form.get('withdrawalAccount').value;
          const depositAccount = dialog.content.instance.form.get('depositAccount').value;
          const amount = dialog.content.instance.form.get('amount').value;

          this.transaction.transfer(withdrawalAccount, depositAccount, amount)
            .subscribe((data: { success: boolean, response: Transaction }) => {
              data.response.date = new Date(data.response.date);
              data.response.createdAt = new Date(data.response.createdAt);
              data.response.updatedAt = new Date(data.response.updatedAt);
              this.store.dispatch(new AddOne(data.response));
              }, err => {
              this.loading.next(false);
                console.log(err.error.error);
              });
        }
      }
    });
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
      accountId: null,
      category: {id: null, category: ''},
      account: {id: null, name: ''},
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
    const {
      amount, id, comment, date, createdAt, updatedAt, simulation, category, user,
      type, userId, categoryId, account, accountId
    } = e.dataItem;

    const dataItem = {
      type, amount, id, userId, categoryId, comment, date, createdAt, updatedAt, simulation, category, user,
      account, accountId
    };
    this.store.dispatch(new Load(dataItem));
    this.openDialog(e.action, id);
  }

  public dataStateChange(state: DataStateChangeEvent) {
    this.state = state;
    this.refreshData();
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
        dialogTransactionComponent.state === 'new' ?
          this.transaction.add(transaction).subscribe(r => this.refreshData()) :
          this.transaction.update(transaction).subscribe(r => this.refreshData());
      }
    });
  }

  private refreshData() {
    const filter = getState(this.store).transactionFilter;
    this.loading.next(true);
    this.store.dispatch(new DeleteAll());
    this.store.dispatch(new Fetch(filter.from, filter.to, filter.account));
  }


}
