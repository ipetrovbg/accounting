import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transactions-graph',
  templateUrl: './transactions-graph.component.html',
  styleUrls: ['./transactions-graph.component.scss']
})
export class TransactionsGraphComponent implements OnInit {

  public cashFlowData = [{
    period: 'Beginning\\nBalance',
    amount: 50000
  }, {
    period: 'Jan',
    amount: 17000
  }, {
    period: 'Feb',
    amount: 14000
  }, {
    period: 'Mar',
    amount: -12000
  }, {
    period: 'Q1',
    summary: 'runningTotal'
  }, {
    period: 'Apr',
    amount: -22000
  }, {
    period: 'May',
    amount: -18000
  }, {
    period: 'Jun',
    amount: 10000
  }, {
    period: 'Q2',
    summary: 'runningTotal'
  }, {
    period: 'Ending\\nBalance',
    summary: 'total'
  }];

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

  ngOnInit() {

  }

}
