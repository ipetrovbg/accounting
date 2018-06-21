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

  daysToNextSalary() {
    const day     = moment();
    const payDay  = 5;

    return (payDay > (+new Date().getDate() + 1)) ?
      Math.abs(day.diff(moment([new Date().getFullYear(), new Date().getMonth(), payDay]), 'days')) + 1 :
      (+moment().endOf('month').format('D') - (+moment(day).format('D'))) + payDay;
  }

  public UUID(): string {
    let d = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      // tslint:disable-next-line:no-bitwise
      const r = ( d + Math.random() * 16 ) % 16 | 0;
      d = Math.floor(d / 16 );
      // tslint:disable-next-line:no-bitwise
      return (c === 'x' ? r : ( r & 0x3 | 0x8 )).toString(16);
    });
    return uuid;
  }
}
