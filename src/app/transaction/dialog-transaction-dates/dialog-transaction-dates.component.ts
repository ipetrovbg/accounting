import { Component, OnInit } from '@angular/core';
import { CoreService } from '../../core/core/core.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { getState, State } from '../../store/accounting.state';

@Component({
  selector: 'app-dialog-transaction-dates',
  templateUrl: './dialog-transaction-dates.component.html',
  styleUrls: ['./dialog-transaction-dates.component.scss']
})
export class DialogTransactionDatesComponent implements OnInit {
  public min: Date = new Date();
  public max: Date = new Date();
  public form: FormGroup;

  constructor(
    private core: CoreService,
    private fb: FormBuilder,
    private store: Store<State>
  ) { }

  ngOnInit() {
    const dates = getState(this.store).transactionFilter;
    this.form = this.fb.group({
      start: dates.from,
      end: dates.to
    });
    this.max = this.core.startEndWorkMonth(5).end;
  }

}
