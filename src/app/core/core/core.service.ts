import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  api: string = environment.api;

  constructor() {
  }

  startEndWorkMonth(payDay, beginingOfTime: boolean = true): { start: Date, end: Date } {

    const lastDayofSalary = payDay - 1;
    let start: Date = new Date();
    if (beginingOfTime) {
      start = new Date('01-01-1970');
    } else {
      start = payDay < (+new Date().getDate()) ?
        moment([new Date().getFullYear(), new Date().getMonth(), payDay]).toDate() :
        moment([new Date().getFullYear(), new Date().getMonth(), payDay]).toDate();
    }

    const end = payDay < (+new Date().getDate() + 1) ?
      moment([new Date().getFullYear(), new Date().getMonth() + 1, lastDayofSalary]).toDate() :
      moment([new Date().getFullYear(), new Date().getMonth(), lastDayofSalary]).toDate();

    return {start, end};
  }

  daysToNextSalary() {
    const day = moment();
    const payDay = 5;

    return (payDay > (+new Date().getDate() + 1)) ?
      Math.abs(day.diff(moment([new Date().getFullYear(), new Date().getMonth(), payDay]), 'days')) + 1 :
      (+moment().endOf('month').format('D') - (+moment(day).format('D'))) + payDay;
  }

  public UUID(): string {
    let d = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      // tslint:disable-next-line:no-bitwise
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      // tslint:disable-next-line:no-bitwise
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  getClosestDate(days: Date[], testDate: Date | any = new Date()) {
    const nextDateIndexesByDiff: any = [],
      prevDateIndexesByDiff: any = [];

    days.forEach((day, i) => {
      if (new Date(day) === testDate) {
        return {prev: [[i, 5]], next: []};
      }
    });

    for (let i = 0; i < days.length; i++) {
      const thisDateStr = [days[i].getMonth() + 1, days[i].getDate(), days[i].getFullYear()].join('/'),
        thisDate: any = new Date(thisDateStr),
        curDiff = testDate - thisDate;

      curDiff < 0
        ? nextDateIndexesByDiff.push([i, curDiff])
        : prevDateIndexesByDiff.push([i, curDiff]);
    }

    nextDateIndexesByDiff.sort((a, b) => a[1] < b[1]);
    prevDateIndexesByDiff.sort((a, b) => a[1] > b[1]);

    let dates = {prev: prevDateIndexesByDiff, next: nextDateIndexesByDiff};
    if (dates.prev.length && dates.next.length) {
      dates = dates.next[0][0];
    } else if (!dates.next.length && dates.prev.length) {
      dates = dates.prev[0][0];
    } else if (!dates.prev.length && dates.next.length) {
      dates = dates.next[0][0];
    } else {
      dates = undefined;
    }
    return dates;
  }

  removeDuplicates(arr) {
    const o: any = {};
    arr.forEach(function (e) {
      o[e] = true;
    });

    return Object.keys(o).map(date => new Date(date));
  }
}
