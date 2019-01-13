import {Component, OnInit, ViewEncapsulation} from '@angular/core';

import * as Handsontable from 'handsontable-pro';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {Settings} from '../settings.model';
import {Store} from '@ngrx/store';
import {getState, State as AppState} from '../../store/accounting.state';
import {selectAllSettingsSelector} from '../../store/reducers/settings.reducer';
import {HotTableRegisterer} from '@handsontable-pro/angular';
import {SettingsService} from '../settings.service';
import {Fetch} from '../../store/actions/settings.actions';

interface HandsontableSelection {
  row: number;
  row2: number;
  column: number;
  column2: number;
}

@Component({
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public id = 'hotInstance';
  public data$: Observable<Settings[]>;
  private subscription: Subscription = new Subscription();
  private selection$: BehaviorSubject<HandsontableSelection> = new BehaviorSubject<HandsontableSelection>({row: -1, column: -1, row2: -1, column2: -1});
  private hotRegisterer = new HotTableRegisterer();

  constructor(
    private store: Store<AppState>,
    private settings: SettingsService
  ) { }

  hotSettings: Handsontable.GridSettings = {
    data: Handsontable.helper.createSpreadsheetData(5, 5),
    colHeaders: [
      '#ID', 'Key', 'Settings', 'Created At', 'Updated At'
    ],
    rowHeaders: true,
    stretchH: 'all',
    licenseKey: '3a14c-c5a87-af203-5422c-b2846',
    columns: [
      {
        type: 'text',
        data: 'id',
        renderer: (instance, td, row, col, prop, value, cellProperties) => {
          const element = document.createElement('SPAN');
          element.innerText = `#${value}`;
          element.style.color = '#747474';
          Handsontable.dom.empty(td);
          cellProperties.readOnly = true;
          td.appendChild(element);
        }
      },
      {
        type: 'text',
        data: 'key'
      },
      {
        type: 'text',
        data: 'settings'
      },
      {
        type: 'text',
        data: 'createdAt',
        readOnly: true
      },
      {
        type: 'text',
        data: 'updatedAt',
        readOnly: true
      }
    ],
    afterSelectionEnd: this.afterSelectionEnd.bind(this),
    afterDeselect: this.afterDeselect.bind(this)
  };

  ngOnInit() {
    this.data$ = this.store.select(selectAllSettingsSelector);
  }

  private afterSelectionEnd(instance, row, column, row2, column2, selectionLayerLevel) {
    this.selection$.next({ row, column, row2, column2 });
  }

  private afterDeselect() {

    const selection = this.selection$.getValue();
    const instance: Handsontable = this.hotRegisterer.getInstance(this.id);
    const rowData: Settings = instance.getSourceDataAtRow(selection.row);
    this.saveData(rowData);
  }

  private saveData(setting: Settings) {
    this.settings.update(setting).subscribe((response: {success: boolean, response: any}) => {
      if (response.success) {
        this.store.dispatch(new Fetch(getState(this.store).user.id));
      }
    });
  }

}
