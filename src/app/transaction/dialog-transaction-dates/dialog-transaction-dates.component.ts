import { Component, OnInit } from '@angular/core';
import { CoreService } from '../../core/core/core.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { getState, State } from '../../store/accounting.state';
import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-dialog-transaction-dates',
  templateUrl: './dialog-transaction-dates.component.html',
  styleUrls: ['./dialog-transaction-dates.component.scss']
})
export class DialogTransactionDatesComponent implements OnInit {
  public min: BehaviorSubject<Date> = new BehaviorSubject<Date>(this.core.startEndWorkMonth(5, false).start);
  public max: BehaviorSubject<Date> = new BehaviorSubject<Date>(new Date());
  public form: FormGroup;

  constructor(
    private core: CoreService,
    private fb: FormBuilder,
    private store: Store<State>
  ) { }

  ngOnInit() {
    const dates = getState(this.store).transactionFilter;
    this.form = this.fb.group({
      start: dates.from || new Date(),
      end: dates.to || new Date()
    });
    this.max.next(this.core.startEndWorkMonth(5).end);
  }

}
