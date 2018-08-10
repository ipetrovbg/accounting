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
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      withdrawalAccount: [getState(this.store).accountManage, Validators.required],
      depositAccount: [{id: null, name: ''}, Validators.required],
      amount: 0
    });
    // this.store.dispatch(new AccountsDeleteAll());
    this.accounts$ = this.store.select(selectAllAccountsSelector);

    this.store.select(state => state.user.token)
      .subscribe(token => {
        if (token) {
          this.store.dispatch(new AccountsFetch());
        }
      });

      // .subscribe(accounts => {
      // this.transaction.transfer(accounts[0].id, 1).subscribe(data => console.log(data), err => {
      //   console.log(err.error.error);
      // });
    // });
  }

}
