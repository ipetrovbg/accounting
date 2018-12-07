import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { getState, State } from '../../../store/accounting.state';
import { Store } from '@ngrx/store';
import { CurrencyService } from '../../../core/currency.service';
import { selectAllCurrenciesSelector } from '../../../store/reducers/currency.reducer';
import { Observable } from 'rxjs';
import { Currency } from '../../../store/states/currency.state';
import { UpdateEdit } from '../../../store/actions/account-manage.actions';

@Component({
  selector: 'app-account-dialog',
  templateUrl: './account-dialog.component.html',
  styleUrls: ['./account-dialog.component.scss']
})
export class AccountDialogComponent implements OnInit {

  public form: FormGroup;
  public currencies$: Observable<Currency[]> = null;

  constructor(
    private fb: FormBuilder,
    private store: Store<State>
  ) { }

  ngOnInit() {
    this.currencies$ = this.store.select(selectAllCurrenciesSelector);

    this.form = this.fb.group(getState(this.store).accountManage.edit);
    this.form.get('name').valueChanges.subscribe(name => {
      const account = { ...getState(this.store).accountManage.edit};
      account.name = name;
      this.store.dispatch(new UpdateEdit(account));
    });
    this.form.get('currency').valueChanges.subscribe(currency => {
      const account = { ...getState(this.store).accountManage.edit};
      account.currency = currency;
      this.store.dispatch(new UpdateEdit(account));
    });
  }

}
