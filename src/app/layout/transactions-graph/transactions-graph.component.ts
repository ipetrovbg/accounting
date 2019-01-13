import { DeleteAll } from './../../store/actions/transaction.actions';
import {BehaviorSubject, Subscription} from 'rxjs';
import { selectAllTransactionsSelector } from './../../store/reducers/transaction.reducer';
import { State, getState } from './../../store/accounting.state';
import { Store } from '@ngrx/store';
import {Component, OnDestroy, OnInit} from '@angular/core';
import { CoreService } from '../../core/core/core.service';
import { Fetch } from '../../store/actions/transaction.actions';

import * as moment from 'moment';
import { process } from '@progress/kendo-data-query';
import { TransactionService } from '../../transaction/transaction.service';
import { TransactionFilterUpdate } from '../../store/actions/transation-filter.actions';
import { DialogCloseResult, DialogRef, DialogService } from '@progress/kendo-angular-dialog';
import { DialogTransactionDatesComponent } from '../../transaction/dialog-transaction-dates/dialog-transaction-dates.component';
import { AccountsFetch } from '../../store/actions/account.actions';
import { selectAllAccountsSelector } from '../../store/reducers/account.reducer';
import { AccountLoad } from '../../store/actions/account-manage.actions';
import {selectAPayDaySettingsSelector} from '../../store/reducers/settings.reducer';
import {Settings} from '../../settings/settings.model';

@Component({
  selector: 'app-transactions-graph',
  templateUrl: './transactions-graph.component.html',
  styleUrls: ['./transactions-graph.component.scss']
})
export class TransactionsGraphComponent implements OnInit, OnDestroy {

  public cashFlowData: BehaviorSubject<any[]> = new BehaviorSubject([]);
  public banksData: BehaviorSubject<any[]> = new BehaviorSubject([]);
  public daysToNextSalary: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public min: Date = new Date();
  public max: Date = new Date();
  private subscription: Subscription = new Subscription();

  constructor(
    private store: Store<State>,
    private core: CoreService,
    private transaction: TransactionService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.subscription.add(this.store.select(selectAPayDaySettingsSelector).subscribe((setting: Settings) => {
      this.daysToNextSalary.next(this.core.daysToNextSalary(setting.settings || this.core.defaultPayDay));
      this.max = this.core.startEndWorkMonth(setting.settings || this.core.defaultPayDay).end;

      if (!getState(this.store).transactionFilter.from && !getState(this.store).transactionFilter.to) {
        this.store.dispatch(new TransactionFilterUpdate('from', this.core.startEndWorkMonth(setting.settings || this.core.defaultPayDay).start));
        this.store.dispatch(new TransactionFilterUpdate('to', this.core.startEndWorkMonth(setting.settings || this.core.defaultPayDay).end));
      }
    }));

    this.store.select(state => state.user.token)
      .subscribe(token => {
        if (token) {
          this.store.dispatch(new AccountsFetch());
        }
      });

    this.store.select(selectAllAccountsSelector).subscribe(accounts => {
      accounts.forEach(account => {
        if (account.name === 'Main' && !getState(this.store).transactionFilter.account) {
          this.store.dispatch(new AccountLoad(account));
          this.store.dispatch(new TransactionFilterUpdate('account', account.id));
        }
      });
    });

    this.subscription.add(this.store.select(state => state.transactionFilter).subscribe(filter => {
      if (getState(this.store).user.token) {
        const {from, to, account} = filter;
        this.subscription.add(this.transaction.fetchGroupByCategory(from, to, account)
          .subscribe((data: any) => this.banksData.next(data.response)));
        this.subscription.add(this.transaction.fetchGroup(from, to, account).subscribe((response: any) => {
          const data = response.response.map((item: any) => {

            item.amount = item.type === 'withdrawal' ?
              (+item.amount - (+item.amount * 2)) :
              +item.amount;

            item.period =  item.type === 'withdrawal' ?
              moment(item.date).format('DD/MMM') :
              moment(item.date).format('DD/MMM') + '&nbsp;';

            return item;
          });
          data.push({ period: 'Ending\\Balance', summary: 'total' });
          this.cashFlowData.next(data);
        }));
      }
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onShowRemainingDays() {
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
        this.store.dispatch(new TransactionFilterUpdate('from', form.form.value.start));
        this.store.dispatch(new TransactionFilterUpdate('to', form.form.value.end));
        this.store.dispatch(new TransactionFilterUpdate('account', getState(this.store).transactionFilter.account));
      }
    });
  }

  public pointColor(point: any): string {
    const summary = point.dataItem.summary;
    if (summary) {
      return summary === 'total' ? '#555' : 'gray';
    }

    if (point.value > 0) {
      return 'green';
    } else {
      return 'red';
    }
  }
}
