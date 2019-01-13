import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { AddMany, DeleteAll, Fetch, SettingsActionTypes } from '../actions/settings.actions';

import { switchMap } from 'rxjs/operators';
import { SettingsService } from '../../settings/settings.service';

@Injectable()
export class SettingsEffects {

  constructor(
    private actions: Actions,
    private settings: SettingsService
  ) {}

  @Effect() fetchSettings = this.actions.ofType(SettingsActionTypes.FETCH)
    .pipe(
      switchMap((action: Fetch) => this.settings.fetch(action.userId)),
      switchMap(data => [new DeleteAll(), new AddMany(data) ])
    );
}

