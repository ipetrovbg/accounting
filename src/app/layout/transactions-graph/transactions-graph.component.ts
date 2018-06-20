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

@Component({
  selector: 'app-transactions-graph',
  templateUrl: './transactions-graph.component.html',
  styleUrls: ['./transactions-graph.component.scss']
})
export class TransactionsGraphComponent implements OnInit {

  public cashFlowData: BehaviorSubject<any[]> = new BehaviorSubject([]);

  constructor(
    private store: Store<State>,
    private core: CoreService
  ) {}

  ngOnInit() {
    this.store.dispatch(new DeleteAll());
    const dates = this.core.startEndWorkMonth(5);
    this.store.select(state => state.user.token)
      .subscribe(token => {
        if (token) {
          this.store.dispatch(new Fetch(dates.start, dates.end));
        }
      });
      this.store.select(selectAllTransactionsSelector).subscribe(transactions => {
        let mapTransactionsDates = [], mapTransactions = [];


        transactions
        .forEach(t => mapTransactionsDates.push(new Date(`${new Date(t.date).getFullYear()}/${new Date(t.date).getMonth() + 1}/${new Date(t.date).getDate()}`)));

        mapTransactionsDates = this.removeDuplicates(mapTransactionsDates);

      
        transactions.forEach((transaction, index: number) => {          
          const t: any = {};
          
          if (transaction.withdrawal) {
            t.amount = +transaction.withdrawal - (+transaction.withdrawal * 2);
            t.period = moment(transaction.date).format('DD/MMM') + '&nbsp;';
          } else {
            t.amount = +transaction.deposit;
            t.period = moment(transaction.date).format('DD/MMM');
          }
          const d: any = this.getClosestDate(mapTransactionsDates, new Date(`${new Date().getFullYear()}/${new Date().getMonth() + 1}/15`));
          if (d && (moment(transaction.date).format('DD/MMM') === moment(mapTransactionsDates[d]).format('DD/MMM'))) {
              t.q1 = true;
          }
          
          mapTransactions.push(t); 
        });
        const trans = process(mapTransactions, {
          group: [
            {
              field: 'period',
              aggregates: [
                { aggregate: 'sum', field: 'amount' }
              ]
            }
          ]          
        });
        const chartData = trans.data.map(item => {
          const newItem: any = {};
          newItem.period = item.value;
          newItem.amount = item.aggregates.amount.sum;
          if (item.items.length && item.items[0].q1) {
            newItem.q1 = true;
          }
          return newItem;
        });
        chartData.forEach((item, index) => {
            if (item.q1) {
              chartData.splice(index, 0, { period: 'Report', summary: 'runningTotal' });
            }
        });
        chartData.push({ period: 'Ending\\Balance', summary: 'total' });
        this.cashFlowData.next(chartData);
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

  getClosestDate(days: Date[], testDate: Date | any = new Date()) {
    let nextDateIndexesByDiff: any = [],
        prevDateIndexesByDiff: any = [];

    days.forEach((day, i) => {
      if (new Date(day) === testDate) {
        return { prev: [[i, 5]], next: [] };
      }
    });

    for(var i = 0; i < days.length; i++) {
        var thisDateStr = [days[i].getMonth() + 1, days[i].getDate(), days[i].getFullYear()].join('/'),
            thisDate: any    = new Date(thisDateStr),
            curDiff     = testDate - thisDate;

        curDiff < 0
            ? nextDateIndexesByDiff.push([i, curDiff])
            : prevDateIndexesByDiff.push([i, curDiff]);
    }

    nextDateIndexesByDiff.sort((a, b) => a[1] < b[1]);
    prevDateIndexesByDiff.sort((a, b) => a[1] > b[1]);

    let dates = { prev: prevDateIndexesByDiff, next: nextDateIndexesByDiff };
    if (dates.prev.length && dates.next.length) {
      dates = dates.next[0][0];
    } else if (!dates.next.length && dates.prev.length) {
      dates = dates.prev[0][0];
    } else if (!dates.prev.length && dates.next.length) {
      dates = dates.next[0][0];
    }  else {
      dates = undefined;
    }
    return dates;
  }

  removeDuplicates(arr){
    let o: any = {};
    arr.forEach(function(e){
        o[e]=true
    });

    return Object.keys(o).map(date => new Date(date));
}
}
