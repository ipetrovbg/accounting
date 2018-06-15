import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  apiEndpoint: string = 'https://ancient-fjord-87958.herokuapp.com/api';
  vertion: string     = '/v1';
  api: string         = `${this.apiEndpoint}${this.vertion}`;

  constructor() { }

  startEndWorkMonth( payDay ):{ start: Date, end: Date } {

    const lastDayofSalary   = payDay - 1;

    let start = payDay < (+new Date().getDate() + 1) ?
                    moment([new Date().getFullYear(), new Date().getMonth(), payDay]).toDate():
                    moment([new Date().getFullYear(), new Date().getMonth() - 1, payDay]).toDate();
    let end = payDay < (+new Date().getDate() + 1) ?
                  moment([new Date().getFullYear(), new Date().getMonth() + 1, payDay - 1]).toDate():
                  moment([new Date().getFullYear(), new Date().getMonth(), payDay - 1]).toDate();

    return { start, end };
  }
}
