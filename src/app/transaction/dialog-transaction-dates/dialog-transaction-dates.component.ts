import { Component, OnInit } from '@angular/core';
import { CoreService } from '../../core/core/core.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { getState, State } from '../../store/accounting.state';
import { BehaviorSubject, Subscription } from 'rxjs';
import * as moment from 'moment';
import { selectAPayDaySettingsSelector } from '../../store/reducers/settings.reducer';
import { Settings } from '../../settings/settings.model';

@Component({
  selector: 'app-dialog-transaction-dates',
  templateUrl: './dialog-transaction-dates.component.html',
  styleUrls: ['./dialog-transaction-dates.component.scss']
})
export class DialogTransactionDatesComponent implements OnInit {
  public min: BehaviorSubject<Date> = new BehaviorSubject<Date>(this.core.startEndWorkMonth(this.core.defaultPayDay, false).start);
  public max: BehaviorSubject<Date> = new BehaviorSubject<Date>(new Date());
  public form: FormGroup;
  private subscription: Subscription = new Subscription();

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

    this.subscription.add(this.store.select(selectAPayDaySettingsSelector).subscribe((setting: Settings) => {
      this.min.next(this.core.startEndWorkMonth(setting.settings || this.core.defaultPayDay, false).start);
      this.max.next(this.core.startEndWorkMonth(setting.settings || this.core.defaultPayDay).end);
    }));

  }

}
