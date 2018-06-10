import { Observable } from 'rxjs/Observable';
import { TransactionService } from '../../transaction/transaction.service';
import { CoreService } from '../../core/core/core.service';
import { Component, OnInit } from '@angular/core';

import 'rxjs/add/operator/map';
import { tap } from 'rxjs/operators/tap';

import { DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public gridData: BehaviorSubject<any> = new BehaviorSubject([]);
  public data: any[] = [];
  public state: State = {
    skip: 0,
    take: 100
  };
  public loading: boolean;

  constructor(
    private core: CoreService,
    private transaction: TransactionService
  ) {}

  ngOnInit() {
    this.loading = true;
    const dates = this.core.startEndWorkMonth(5);
    this.transaction.fetch(dates.start, dates.end).subscribe(data => {
      this.data = data;
      this.loading = false
      this.gridData.next(process(this.data, this.state));
    }); 
  }

  public dataStateChange(state: DataStateChangeEvent) {
    this.state    = state;
    this.gridData.next(process(this.data, this.state));
  }

  
}
