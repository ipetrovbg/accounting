import { createSelector, createFeatureSelector, ActionReducerMap, } from '@ngrx/store';
import { transactionReducer } from './transaction.reducer';
import { State } from '../accounting.state';

export const reducers: ActionReducerMap<State> = {
    transactions: transactionReducer,
  };