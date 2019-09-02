
import {debounceTime} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../transaction.service';
import { Store } from '@ngrx/store';
import { getState, State } from '../../store/accounting.state';
import { selectAllAccountsSelector } from '../../store/reducers/account.reducer';
import { Account } from '../account.model';
import { Observable } from 'rxjs';
import { Fetch } from '../../store/actions/transaction.actions';
import { AccountsDeleteAll, AccountsFetch } from '../../store/actions/account.actions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CurrencyService } from '../../core/currency.service';

@Component({
  selector: 'app-dialog-transfer',
  templateUrl: './dialog-transfer.component.html',
  styleUrls: ['./dialog-transfer.component.scss']
})
export class DialogTransferComponent implements OnInit {

  public accounts$: Observable<Account[]>;
  public form: FormGroup;

  constructor(
    private transaction: TransactionService,
    private store: Store<State>,
    private fb: FormBuilder,
    private currency: CurrencyService
  ) { }

  ngOnInit() {
    this.accounts$ = this.store.select(selectAllAccountsSelector);

    this.form = this.fb.group({
      withdrawalAccount: [getState(this.store).accountManage, Validators.required],
      depositAccount: [{id: null, name: ''}, Validators.required],
      amount: 0,
      rate: [null, Validators.required]
    });
    this.form.get('withdrawalAccount').disable();
    this.form.get('depositAccount').valueChanges.pipe(debounceTime(100)).subscribe(() => this.accountChanged());


    this.store.select(state => state.user.token)
      .subscribe(token => {
        if (token) {
          this.store.dispatch(new AccountsFetch());
        }
      });
  }

  accountChanged() {
    this.form.get('withdrawalAccount').enable();
    const {withdrawalAccount, depositAccount} = this.form.value;
    this.currency.getCurrencyPairRate(withdrawalAccount.currency.id, depositAccount.currency.id).subscribe(rate => {
      this.form.get('rate').patchValue(rate.rate || null);
      this.form.get('withdrawalAccount').disable();
    });
  }

}
