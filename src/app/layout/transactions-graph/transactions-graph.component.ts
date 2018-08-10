import { DeleteAll } from './../../store/actions/transaction.actions';
import { BehaviorSubject } from 'rxjs';
import { selectAllTransactionsSelector } from './../../store/reducers/transaction.reducer';
import { State, getState } from './../../store/accounting.state';
import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { CoreService } from '../../core/core/core.service';
import { Fetch } from '../../store/actions/transaction.actions';

import * as moment from 'moment';
import { process } from '@progress/kendo-data-query';
import { TransactionService } from '../../transaction/transaction.service';
import { TransactionFilterUpdate } from '../../store/actions/transation-filter.actions';

@Component({
  selector: 'app-transactions-graph',
  templateUrl: './transactions-graph.component.html',
  styleUrls: ['./transactions-graph.component.scss']
})
export class TransactionsGraphComponent implements OnInit {

  public cashFlowData: BehaviorSubject<any[]> = new BehaviorSubject([]);

  constructor(
    private store: Store<State>,
    private core: CoreService,
    private transaction: TransactionService
  ) {}

  ngOnInit() {
    if (!getState(this.store).transactionFilter.from && !getState(this.store).transactionFilter.to) {
      this.store.dispatch(new TransactionFilterUpdate('from', this.core.startEndWorkMonth(5).start));
      this.store.dispatch(new TransactionFilterUpdate('to', this.core.startEndWorkMonth(5).end));
    }

    this.store.select(state => state.user.token)
      .subscribe(token => {
        if (token) {
          const { from, to } = getState(this.store).transactionFilter;
          this.transaction.fetchGroup(from, to).subscribe((response: any) => {
            const data = response.response.map((item: any) => {

              item.amount = item.type === 'withdrawal' ?
                (+item.amount - (+item.amount * 2)) :
                +item.amount;

              item.period =  item.type === 'withdrawal' ?
                moment(item.date).format('DD/MMM') :
                moment(item.date).format('DD/MMM') + '&nbsp;';

              return item;
            });
            data.push({ period: 'Ending\\Balance', summary: 'total' });
            this.cashFlowData.next(data);
          });
        }
      });
  }

  public pointColor(point: any): string {
    const summary = point.dataItem.summary;
    if (summary) {
      return summary === 'total' ? '#555' : 'gray';
    }

    if (point.value > 0) {
      return 'green';
    } else {
      return 'red';
    }
  }
}
