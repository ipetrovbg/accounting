import { createFeatureSelector, createSelector } from '@ngrx/store';
import { createEntityAdapter } from '@ngrx/entity';
import { State } from '../accounting.state';
import { SettingsState } from '../states/settings.state';
import { SettingsActions, SettingsActionTypes } from '../actions/settings.actions';
import { Settings } from '../../settings/settings.model';



const settingsAdapter = createEntityAdapter<Settings>();

const initialState: SettingsState = settingsAdapter.getInitialState();

export function settingsReducer(state: SettingsState = initialState, action: SettingsActions ): SettingsState {
  switch (action.type) {

    case SettingsActionTypes.ADD_ONE:
      return settingsAdapter.addOne(action.setting, state);

    case SettingsActionTypes.ADD_MANY:
      return settingsAdapter.upsertMany(action.settings, state);

    case SettingsActionTypes.UPDATE_ONE:
      return settingsAdapter.updateOne({ id: action.id, changes: action.changes, }, state);

    case SettingsActionTypes.DELETE_ONE:
      return settingsAdapter.removeOne(action.id, state);

    case SettingsActionTypes.DELETE_ALL:
      return settingsAdapter.removeAll(state);

    case SettingsActionTypes.GET_ALL:
      return settingsAdapter.addAll(action.settings, state);

    default:
      return state;

  }
}


export const getSelectedSettingsId = (state: State) => state.transactions.ids;

export const {
  // select the array of settings
  selectAll: selectAllTransactions
} = settingsAdapter.getSelectors();

export const selectSettingsState = createFeatureSelector<SettingsState>('settings');

export const selectAllSettingsSelector = createSelector(
  selectSettingsState,
  selectAllTransactions
);

export const selectAPayDaySettingsSelector = createSelector(
  selectAllSettingsSelector,
  (settings: Settings[]) => {
    const payDay: Settings[] = settings.filter(setting => setting.key === 'payDay');
    if (payDay.length) {
      return payDay[0];
    }
    return {
      id: null,
      key: null,
      userId: null,
      settings: 1,
      createdAt: null,
      updatedAt: null
    };
  });