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

  private subscription: Subscription = new Subscription();

  constructor(
    private store: Store<State>,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    console.log(this.transactionState);
    const transaction = getState(this.store).transactionManage;
    // this.transactionState = transaction.incomeId 

    this.form = this.fb.group(transaction);

    this.form.valueChanges.subscribe(form => {
      console.log(form);
    })
    
    this.subscription.add(this.store.select(s => s.transactionManage)
    .subscribe(transaction => this.form.patchValue(transaction, { emitEvent: false, onlySelf: true })));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
