import { ActionReducerMap, } from '@ngrx/store';
import { transactionReducer } from './transaction.reducer';
import { State } from '../accounting.state';
import { userReducer } from './user.reducer';

export const reducers: ActionReducerMap<State> = {
    transactions: transactionReducer,
    user: userReducer
};
