import {Component, OnInit, ChangeDetectionStrategy, OnDestroy} from '@angular/core';

import { Observable, Subscription} from 'rxjs';
import {Setting} from '../settings.model';
import {Store} from '@ngrx/store';
import {getState, State as AppState} from '../../store/accounting.state';
import {
  selectAllSettingsSelector,
  selectAPayDaySettingsSelector,
  selectDefaultAccountSettingsSelector
} from '../../store/reducers/settings.reducer';
import {SettingsService} from '../settings.service';
import {Fetch} from '../../store/actions/settings.actions';
import {Balance, labelBalanceContent, selectAllAccountsSelector, selectTotalAmount} from '../../store/reducers/account.reducer';
import {AccountsFetch} from '../../store/actions/account.actions';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UserState} from '../../store/states/user.state';
import {skipWhile, tap} from 'rxjs/operators';
import {ServerUserUpdate as UserUpdate} from '../../store/actions/user.actions';
import {TransactionFilterUpdate} from '../../store/actions/transation-filter.actions';
import {Account} from '../../transaction/account.model';

@Component({
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit, OnDestroy {

  public id = 'hotInstance';
  public data$: Observable<Setting[]>;
  private subscription: Subscription = new Subscription();
  public balance$: Observable<Balance[]>;
  public user$: Observable<UserState>;
  public labelBalanceContent = labelBalanceContent;
  public form: FormGroup;

  public listDates: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
                               '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
                               '21', '22', '23', '24', '25', '26', '27', '28'];
  public accounts$: Observable<Account[]>;
  public defaultItemAccount = {
    name: 'Select Account',
    id: null
  };
  public defaultItemPayDay = 'Select date of payment';
  constructor(
    private store: Store<AppState>,
    private settings: SettingsService,
    private fb: FormBuilder
  ) { }


  ngOnInit() {
    this.accounts$ = this.store.select(selectAllAccountsSelector);

    this.form = this.fb.group({
      payDay: null,
      name: '',
      payDayID: 0,
      defaultAccount: null,
      defaultAccountID: null
    });

    this.user$ = this.store.select(state => state.user).pipe(tap(user => {
      if (user) {
        this.form.patchValue({
          name: user.name
        });
        this.form.get('name').markAsPristine({onlySelf: false});
      }
      if (user && user.token) {
        this.refreshData();
      }
    }));

    this.subscription.add(
      this.store.select(selectDefaultAccountSettingsSelector)
        .pipe(skipWhile(setting => !setting.id))
        .subscribe(setting => {
          this.form.patchValue({
            defaultAccount: {id: setting.settings},
            defaultAccountID: setting.id
          });
        })
    );

    this.subscription.add(
      this.store.select(selectAPayDaySettingsSelector)
        .pipe(skipWhile(setting => !setting.id))
        .subscribe(setting => {
          if (setting.id) {
            this.form.patchValue({
              payDay: setting.settings,
              payDayID: setting.id
            });
          }
        })
    );

    this.data$ = this.store.select(selectAllSettingsSelector);
    this.balance$ = this.store.select(selectTotalAmount);
  }

  public accountDisabled(itemArgs: { dataItem: any, index: number }) {
    return itemArgs.dataItem && itemArgs.dataItem.currency && !itemArgs.dataItem.currency.id;
  }

  public onSaveHandler() {
    if (!this.form.dirty) {
      return;
    }

    this.store.dispatch(new UserUpdate(<UserState>{ name: this.form.value.name, id: getState(this.store).user.id }));

    this.saveSetting(<Setting>{
      key: 'payDay',
      id: this.form.value.payDayID,
      settings: this.form.value.payDay || this.listDates[1]
    });

    if (this.form.value.defaultAccount.id) {
      this.saveSetting(<Setting>{
        key: 'defaultAccount',
        id: this.form.value.defaultAccountID,
        settings: this.form.value.defaultAccount.id
      });
    } else {
      this.saveSetting(<Setting>{
        key: 'defaultAccount',
        id: this.form.value.defaultAccountID,
        settings: null
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private saveSetting(setting: Setting) {
    const userId = getState(this.store).user.id;
    if (setting.id) {
      if (!setting.userId) {
        setting.userId = userId;
      }

      this.settings.update(setting).subscribe((response: {success: boolean, response: any}) => {
        if (response.success) {
          this.form.get(setting.key).markAsPristine({onlySelf: false});
          this.store.dispatch(new Fetch(userId));
          this.store.dispatch(new TransactionFilterUpdate('from', null));
          this.store.dispatch(new TransactionFilterUpdate('to', null));
        }
      });
    } else {
      const date = new Date();

      this.settings.create(<Setting>{
        key: setting.key,
        settings: setting.settings,
        userId: userId,
        createdAt: date,
        updatedAt: date
      }).subscribe(response => {
        this.form.get(setting.key).markAsPristine({onlySelf: false});
        this.store.dispatch(new Fetch(userId));
        this.store.dispatch(new TransactionFilterUpdate('from', null));
        this.store.dispatch(new TransactionFilterUpdate('to', null));
      });
    }
  }

  private refreshData() {
    this.store.dispatch(new AccountsFetch());
  }

}
