
import {map, skipWhile, tap} from 'rxjs/operators';
import { TransactionManageState } from '../../store/states/transaction-manage.state';
import { DialogTransactionComponent } from '../../transaction/dialog-transaction/dialog-transaction.component';
import { State as AppState, getState } from '../../store/accounting.state';
import { Observable ,  BehaviorSubject, Subscription } from 'rxjs';
import { TransactionService } from '../../transaction/transaction.service';
import { CoreService } from '../../core/core/core.service';
import { Component, OnDestroy, OnInit, ViewChild, ElementRef, HostListener, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';



import { DataStateChangeEvent, GridComponent } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { selectAllTransactionsSelector } from '../../store/reducers/transaction.reducer';
import {Balance, selectAllAccountsSelector, labelBalanceContent, selectTotalAmount} from '../../store/reducers/account.reducer';
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
import {AccountLoad, Update} from '../../store/actions/account-manage.actions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogTransferComponent } from '../../transaction/dialog-transfer/dialog-transfer.component';
import { Transaction } from '../../transaction/transaction.model';
import { DialogTransactionDatesComponent } from '../../transaction/dialog-transaction-dates/dialog-transaction-dates.component';
import { TransactionFilterUpdate } from '../../store/actions/transation-filter.actions';
import { TransactionFilterState } from '../../store/states/transaction-filter.state';
import { DropDownListComponent } from '@progress/kendo-angular-dropdowns';
import { CommitService } from '../../core/commit/commit.service';
import {Setting} from '../../settings/settings.model';
import {
  selectAllSettingsSelector,
  selectAPayDaySettingsSelector,
  selectDefaultAccountSettingsSelector
} from '../../store/reducers/settings.reducer';
import {AccountManageState} from '../../store/states/account-manage.state';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
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
  public exportData: Array<any> = [{
    text: 'Excel',
    icon: 'file-excel',
    click: () => this.exportToExcel()
  }, {
    text: 'Pdf',
    icon: 'file-pdf',
    click: () => this.exportToPDF()
  }];
  public daysToNextSalary: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public min: Date = new Date();
  public max: Date = new Date();
  public showAccount: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public accounts$: Observable<Account[]>;
  public selectedAccount$: Observable<Account>;
  public transactionFilter$: Observable<TransactionFilterState>;
  public accountForm: FormGroup;
  public commits$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public commitsCount$: BehaviorSubject<number> = new BehaviorSubject(0);
  public commitLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public isNewTransactionAvailable$: Observable<boolean> = null;
  public settings$: Observable<Setting[]> = null;

  public sparkData: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  public balance$: Observable<Balance[]>;
  public labelBalanceContent = labelBalanceContent;


  @ViewChild('anchorCategory', { static: false }) public anchorCategory: ElementRef;
  @ViewChild(GridComponent, { static: true }) public grid: GridComponent;
  @ViewChild('popup', { read: ElementRef, static: false }) public popup: ElementRef;
  @ViewChild(DropDownListComponent, { static: false }) public dropDown: DropDownListComponent;

  @HostListener('keydown', ['$event'])
  public keydown(event: any): void {
    if (event.keyCode === 27) {
      this.toggleCat(false);
    }
  }

  // @HostListener('document:click', ['$event'])
  // public documentClick(event: any): void {
  //   if (!this.containsCat(event.target)) {
  //     this.toggleCat(false);
  //   }
  // }

  constructor(private core: CoreService,
              private commit: CommitService,
              private transaction: TransactionService,
              private store: Store<AppState>,
              private dialogService: DialogService,
              public intl: IntlService,
              private categories: CategoriesService,
              private cd: ChangeDetectorRef,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.loading.next(true);
    this.isNewTransactionAvailable$ = this.store.select(s => !!s.accountManage.currency.id);
    this.balance$ = this.store.select(selectTotalAmount);

    if (!getState(this.store).transactionFilter.from && !getState(this.store).transactionFilter.to) {
      this.subscription.add(this.store.select(selectAPayDaySettingsSelector).subscribe((setting: Setting) => {
        this.store
          .dispatch(
            new TransactionFilterUpdate('from', this.core.startEndWorkMonth(setting.settings || this.core.defaultPayDay, false).start)
          );
        this.store.dispatch(
          new TransactionFilterUpdate('to', this.core.startEndWorkMonth(setting.settings || this.core.defaultPayDay).end)
        );
      }));
    }

    this.store.dispatch(new DeleteAll());
    this.store.dispatch(new AccountsDeleteAll());

    this.accountForm = this.fb.group({
      name: ['', Validators.required]
    });



    this.subscription.add(this.store.select(selectAPayDaySettingsSelector).subscribe((setting: Setting) => {
      this.daysToNextSalary.next(this.core.daysToNextSalary(+setting.settings || this.core.defaultPayDay));
      this.max = this.core.startEndWorkMonth(+setting.settings || this.core.defaultPayDay).end;
    }));



    const transactions$ = this.store.select(selectAllTransactionsSelector);
    this.settings$ = this.store.select(selectAllSettingsSelector);
    this.transactionFilter$ = this.store.select(filterState => filterState.transactionFilter);
    this.selectedAccount$ = this.store.select(state2 => state2.accountManage).pipe(tap(accountManage => {
      if (accountManage.id) {
        this.store.dispatch(new TransactionFilterUpdate('account', accountManage.id));
      }
    }));

    this.accounts$ = this.store.select(selectAllAccountsSelector)
      .pipe(tap(accounts => {

      accounts.forEach(account => {
        if (account.id === getState(this.store).transactionFilter.account) {
          if (!account.currency) {
            account.currency = {
              currency: '',
              id: null,
              sign: '',
              country: ''
            };
          }
          this.store.dispatch(new Update('amount', account.amount));
        }
      });
    }));

    this.subscription.add(
    combineLatest(
      this.accounts$,
      this.store.select(selectDefaultAccountSettingsSelector)
    ).pipe(
      map(([accounts, defaultAccount]) => ({accounts, defaultAccount})),
      skipWhile(all => !all.accounts.length || !!getState(this.store).transactionFilter.account
      )).subscribe(({accounts, defaultAccount}) => {
      if (accounts.length && !getState(this.store).transactionFilter.account) {
        const account = accounts.find(a => a.id === +defaultAccount.settings);
        if (account) {
          this.store.dispatch(new AccountLoad(account));
        } else {
          const mainAccount = accounts.find(a => a.name === 'Main');

          if (!mainAccount || !mainAccount.currency) {
            return;
          }
          this.store.dispatch(new AccountLoad(mainAccount));
        }
      }
    }));

    this.store.select(s => s.user.token)
      .subscribe(token => {
        if (token) {
          this.commitLoading.next(true);
          this.commit.all().pipe(map((c: any) => {
            if (c.response && c.response.length > 0) {
              this.commitsCount$.next(c.response[0].Transactions.length);
            }
            return !!c.response.length;
          })).subscribe(commiting => {
            this.commits$.next(commiting);
            this.commitLoading.next(false);
          });
          this.store.dispatch(new AccountsFetch());
        }
      });

    this.subscription.add(
      transactions$.pipe(
        tap(() => setTimeout(() => this.loading.next(false), 300)))
        .subscribe(transactions => {

          // this.store.dispatch(new AccountsDeleteAll());
          // this.store.dispatch(new AccountLoad());

          this.data = [...transactions];
          const sortedTransactions = [...transactions.sort((a: any, b: any) => a.date - b.date)];

          this.sparkData
            .next(
              sortedTransactions
                .map(transaction => transaction.type === 'withdrawal' ? transaction.amount - (transaction.amount * 2) : transaction.amount)
            );

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

          // this.accounts$.subscribe(accounts => {
          //   accounts.forEach(account => {
          //     if (account.id === getState(this.store).transactionFilter.account) {
          //       if (!account.currency) {
          //         account.currency = {
          //           currency: '',
          //           id: null,
          //           sign: '',
          //           country: ''
          //         };
          //       }
          //       this.store.dispatch(new AccountLoad(account));
          //     }
          //   });
          // });
          this.gridData.next(process(this.data, this.state));
        }, err => this.loading.next(false)));

    this.subscription.add(this.gridData.subscribe(data => {
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
    }));

    this.subscription.add(this.transactionFilter$.pipe(map(filter => {
      this.loading.next(true);
      this.store.dispatch(new DeleteAll());
      return filter;
    })).subscribe(filter => {
      if (filter.account && filter.from && filter.to) {
        this.loading.next(true);
        this.store.dispatch(new Fetch(filter.from, filter.to, filter.account));
      }
    }));
  }

  accountDisabled(itemArgs: { dataItem: any, index: number }) {
    return itemArgs.dataItem && itemArgs.dataItem.currency && !itemArgs.dataItem.currency.id;
  }

  startCommit() {
    this.commitLoading.next(true);
    this.commit.createCommit().subscribe(commit => {
      setTimeout(() => this.commitLoading.next(false), 300);
      this.commit.all().pipe(map((c: any) => !!c.response.length)).subscribe(commiting => this.commits$.next(commiting));
    }, () => this.commitLoading.next(false));
  }

  cancelCommit() {
    this.commitLoading.next(true);
    this.commit.remove().subscribe(done => {
      setTimeout(() => this.commitLoading.next(false), 300);
      this.commit.all().pipe(map((c: any) => !!c.response.length)).subscribe(commiting => this.commits$.next(commiting));
    });
  }

  finishCommit() {
    this.commitLoading.next(false);
    this.commit.commit().subscribe(done => {
      this.commit.all().pipe(map((c: any) => !!c.response.length)).subscribe(commiting => {
        this.commits$.next(commiting);
        this.refreshData();
      });
    });
  }

  ngAfterViewInit() {
    this.dropDown.open.subscribe(() => {
      this.showAccount.next(false);
    });
  }

  exportToPDF(): void {
    this.grid.saveAsPDF();
  }
  exportToExcel(): void {
    this.grid.saveAsExcel();
  }

  createAccount() {
    if (this.accountForm.get('name').valid) {
      this.store.dispatch(new AccountsCreate(this.accountForm.get('name').value));
      setTimeout(() => this.toggleCat(false), 300);
    }
  }

  openCategoryDialog() {
    this.dropDown.toggle(this.showAccount.getValue());
    setTimeout(() =>  {
      this.cd.detectChanges();
      this.showAccount.next(!this.showAccount.getValue());
    });
  }

  public accountSelect(e) {
    this.store.dispatch(new AccountsDeleteAll());
    this.store.dispatch(new AccountsFetch());
    if (!e.currency) {
      e.currency = {
        id: null,
        sign: '',
        currency: '',
        country: ''
      };
    }
    this.store.dispatch(new AccountLoad(e));
  }

  public toggleCat(show?: boolean): void {
    this.showAccount.next(show !== undefined ? show : !this.showAccount.getValue());
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
      width: 420
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
      width: 850,
      minWidth: 250
    });
    dialog.result.subscribe(actions => {
      if (!(actions instanceof DialogCloseResult) && actions.primary) {
        dialog.content.instance.form.get('withdrawalAccount').enable();
        const { amount, depositAccount, withdrawalAccount } = dialog.content.instance.form.value;

        if (dialog.content.instance.form.valid &&
          (amount > 0) &&
          (depositAccount.id && withdrawalAccount.id) &&
          (depositAccount.id !== withdrawalAccount.id)) {
          this.loading.next(true);
          const withdrawalAccountValue = dialog.content.instance.form.get('withdrawalAccount').value;
          const depositAccountValue = dialog.content.instance.form.get('depositAccount').value;
          const rate = dialog.content.instance.form.get('rate').value;
          const amountValue = dialog.content.instance.form.get('amount').value;

          this.transaction.transfer(withdrawalAccountValue, depositAccountValue, amountValue, rate)
            .subscribe((data: { success: boolean, response: Transaction }) => {
              /*data.response.date = new Date(data.response.date);
              data.response.createdAt = new Date(data.response.createdAt);
              data.response.updatedAt = new Date(data.response.updatedAt);
              this.store.dispatch(new AddOne(data.response));*/
              this.refreshData();
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
      currencyId: null,
      comment: '',
      type: e.state,
      date: null,
      createdAt: null,
      updatedAt: null,
      deletedAt: null,
      simulation: false,
      accountId: null,
      transactionId: null,
      originalAmount: null,
      category: {id: null, category: ''},
      account: {id: null, name: '', currency: { id: null, sign: '', country: '', currency: '' }},
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
        this.transaction.delete(e.dataItem.id).subscribe(() => this.refreshData());
      }
    });


  }

  public editHandler(e) {
    const {
      amount, id, comment, date, createdAt, updatedAt, simulation, category, user,
      type, userId, categoryId, account, accountId, currencyId, transactionId, originalAmount
    } = e.dataItem;

    const dataItem = {
      type, amount, id, userId, categoryId, comment, date, createdAt, updatedAt, simulation, category, user,
      account, accountId, currencyId, transactionId, originalAmount
    };
    this.store.dispatch(new Load(dataItem));
    this.openDialog(e.action, id);
  }

  public dataStateChange(s: DataStateChangeEvent) {
    this.state = s;
    this.refreshData();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store.dispatch(new DeleteAll());
  }

  private openDialog(s: 'new' | 'edit', id?: number) {

    if (!getState(this.store).accountManage.currency) {
      return;
    }

    const dialog: DialogRef = this.dialogService.open({
      title: `${s[0].toUpperCase() + s.substring(1)} Transaction`,
      content: DialogTransactionComponent,
      actions: [
        {text: 'Cancel'},
        {text: 'Save', primary: true}
      ],
      width: 1000,
      minWidth: 250
    });

    const dialogTransactionComponent = dialog.content.instance;
    dialogTransactionComponent.state = s;


    dialog.result.subscribe((result) => {
      const transaction: TransactionManageState = getState(this.store).transactionManage;

      if (!(result instanceof DialogCloseResult) &&
        result.primary && ( dialogTransactionComponent.form.valid ) &&
        (dialogTransactionComponent.currencyForm.valid || dialogTransactionComponent.currencyForm.disabled)) {

        if (dialogTransactionComponent.state === 'new') {
          transaction.amount = transaction.amount * dialogTransactionComponent.currencyForm.value.rate;
          transaction.originalAmount = transaction.amount;
          transaction.currencyId = dialogTransactionComponent.currencyForm.value.from.id;
        }

        dialogTransactionComponent.state === 'new' ?
          this.transaction.add(transaction).subscribe(r => this.refreshData()) :
          this.transaction.update(transaction).subscribe(r => this.refreshData());
      }
    });
  }

  private refreshData() {
    const filter = getState(this.store).transactionFilter;
    this.loading.next(true);
    this.store.dispatch(new AccountsFetch());
    this.store.dispatch(new DeleteAll());
    this.store.dispatch(new Fetch(filter.from, filter.to, filter.account));
    this.commitLoading.next(true);
    this.commit.all().pipe(map((c: any) => {
      if (c.response && c.response.length > 0) {
        this.commitsCount$.next(c.response[0].Transactions.length);
      }
      return !!c.response.length;
    })).subscribe(commiting => {
      this.commits$.next(commiting);
      this.commitLoading.next(false);
    });
  }


}
