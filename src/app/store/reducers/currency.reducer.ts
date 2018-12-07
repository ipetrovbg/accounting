import { createEntityAdapter } from '@ngrx/entity';
import { CurrenciesState, Currency, CurrencyManageState } from '../states/currency.state';
import { CurrencyActions, CurrencyActionTypes } from '../actions/currency.actions';
import { State } from '../accounting.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Dictionary } from '@ngrx/entity/src/models';


const currencyAdapter = createEntityAdapter<Currency>();

const initialState: CurrencyManageState = {
  lastUsed: {
    currency: '',
    sign: '',
    id: null,
    country: '',
    created_at: null,
    updated_at: null
  },
  currencies: currencyAdapter.getInitialState()
};

export function currencyReducer(state: CurrencyManageState = initialState, action: CurrencyActions): CurrencyManageState {
  switch (action.type) {
    case CurrencyActionTypes.LOAD:
      return { ...state, lastUsed: action.currency };
    case CurrencyActionTypes.ADD_MANY:
      return { ...state, currencies: currencyAdapter.addMany(action.currencies, state.currencies) };
    default:
      return state;

  }
}

export const selectCurrenciesState = createFeatureSelector<CurrencyManageState>('currencies');

export const selectCurrenciesEntitiesSelector = createSelector(
  selectCurrenciesState,
  (state: CurrencyManageState) => state.currencies
);

export const selectAllCurrenciesSelector = createSelector(
  selectCurrenciesEntitiesSelector,
  (state: CurrenciesState) => Object.keys(state.entities).map(key => state.entities[key])
);
