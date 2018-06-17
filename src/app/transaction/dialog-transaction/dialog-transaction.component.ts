import { Update } from './../../store/actions/transaction-manage.action';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { State, getState } from './../../store/accounting.state';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { TransactionManageState } from '../../store/states/transaction-manage.state';

@Component({
  selector: 'app-dialog-transaction',
  templateUrl: './dialog-transaction.component.html',
  styleUrls: ['./dialog-transaction.component.scss']
})
export class DialogTransactionComponent implements OnInit, OnDestroy {

  @Input() state: 'new' | 'edit';
  @Input() transactionState: 'deposit' | 'withdrawal';

  public form: FormGroup;
  public transactionStateList: string[] = ['Deposit', 'Withdrawal'];

  private subscription: Subscription = new Subscription();

  constructor(
    private store: Store<State>,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    const transaction: any = getState(this.store).transactionManage;
    if (this.state === 'new') {
      if (this.transactionState === 'deposit') {
        transaction.deposit = 0;
      } else {
        transaction.withdrawal = 0;
      }
    }
    this.form = this.fb.group(transaction);

    this.form.get('date').valueChanges.subscribe(value => this.store.dispatch(new Update('date', value)));
    this.form.get('withdrawal').valueChanges.subscribe(value => this.store.dispatch(new Update('withdrawal', value)));
    this.form.get('deposit').valueChanges.subscribe(value => this.store.dispatch(new Update('deposit', value)));
    this.form.get('reason').valueChanges.subscribe(value => this.store.dispatch(new Update('reason', value)));
    this.form.get('isTest').valueChanges.subscribe(value => this.store.dispatch(new Update('isTest', value)));
    
    this.subscription.add(this.store.select(s => s.transactionManage)
    .subscribe(transaction => this.form.patchValue(transaction, { emitEvent: false, onlySelf: true })));
  }

  handleStateChange(e) {
    if (e === 'Deposit') {
      this.form.get('deposit').patchValue(this.form.get('withdrawal').value);
      this.form.get('withdrawal').patchValue(null);
    } else {
      this.form.get('withdrawal').patchValue(this.form.get('deposit').value);
      this.form.get('deposit').patchValue(null);
    }
    this.transactionState = e.toLowerCase();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
