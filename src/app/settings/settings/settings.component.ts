import {Component, OnInit, ChangeDetectionStrategy, OnDestroy} from '@angular/core';

import { Observable, Subscription} from 'rxjs';
import {Setting} from '../settings.model';
import {Store} from '@ngrx/store';
import {getState, State as AppState} from '../../store/accounting.state';
import {selectAllSettingsSelector, selectAPayDaySettingsSelector} from '../../store/reducers/settings.reducer';
import {SettingsService} from '../settings.service';
import {Fetch} from '../../store/actions/settings.actions';
import {Balance, labelBalanceContent, selectTotalAmount} from '../../store/reducers/account.reducer';
import {AccountsFetch} from '../../store/actions/account.actions';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UserState} from '../../store/states/user.state';
import {tap} from 'rxjs/operators';
import {ServerUserUpdate as UserUpdate} from '../../store/actions/user.actions';
import {TransactionFilterUpdate} from '../../store/actions/transation-filter.actions';

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

  public listDates: string[] = ['Select date', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
                               '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
                               '21', '22', '23', '24', '25', '26', '27', '28'];

  constructor(
    private store: Store<AppState>,
    private settings: SettingsService,
    private fb: FormBuilder
  ) { }


  ngOnInit() {

    this.form = this.fb.group({
      payDay: this.listDates[0],
      name: '',
      payDayID: 0
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
      this.store.select(selectAPayDaySettingsSelector)
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


  public onSaveHandler() {
    if (!this.form.dirty) {
      return;
    }

    if (this.form.value.payDay === this.listDates[0] && !this.form.get('name').dirty ) {
      this.form.get('payDay').markAsPristine({onlySelf: false});
      return;
    }

    this.store.dispatch(new UserUpdate(<UserState>{ name: this.form.value.name, id: getState(this.store).user.id }));

    this.saveSetting(<Setting>{
      id: this.form.value.payDayID,
      settings: this.form.value.payDay || this.listDates[1]
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private saveSetting(setting: Setting) {
    if (setting.id) {
      if (!setting.userId) {
        setting.userId = getState(this.store).user.id;
      }

      this.settings.update(setting).subscribe((response: {success: boolean, response: any}) => {
        if (response.success) {
          this.form.get('payDay').markAsPristine({onlySelf: false});
          this.store.dispatch(new Fetch(getState(this.store).user.id));
          this.store.dispatch(new TransactionFilterUpdate('from', null));
          this.store.dispatch(new TransactionFilterUpdate('to', null));
        }
      });
    } else {
      const date = new Date();

      this.settings.create(<Setting>{
        key: 'payDay',
        settings: setting.settings,
        userId: getState(this.store).user.id,
        createdAt: date,
        updatedAt: date
      }).subscribe(response => {
        this.form.get('payDay').markAsPristine({onlySelf: false});
        this.store.dispatch(new Fetch(getState(this.store).user.id));
        this.store.dispatch(new TransactionFilterUpdate('from', null));
        this.store.dispatch(new TransactionFilterUpdate('to', null));
      });
    }
  }

  private refreshData() {
    this.store.dispatch(new AccountsFetch());
  }

}
