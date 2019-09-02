import {Component, OnInit, ViewEncapsulation} from '@angular/core';

import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {Settings} from '../settings.model';
import {Store} from '@ngrx/store';
import {getState, State as AppState} from '../../store/accounting.state';
import {selectAllSettingsSelector} from '../../store/reducers/settings.reducer';
import {SettingsService} from '../settings.service';
import {Fetch} from '../../store/actions/settings.actions';

@Component({
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public id = 'hotInstance';
  public data$: Observable<Settings[]>;
  private subscription: Subscription = new Subscription();

  constructor(
    private store: Store<AppState>,
    private settings: SettingsService
  ) { }


  ngOnInit() {
    this.data$ = this.store.select(selectAllSettingsSelector);
  }

  private saveData(setting: Settings) {
    this.settings.update(setting).subscribe((response: {success: boolean, response: any}) => {
      if (response.success) {
        this.store.dispatch(new Fetch(getState(this.store).user.id));
      }
    });
  }

}
