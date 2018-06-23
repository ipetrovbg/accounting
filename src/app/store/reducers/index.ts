import { ActionReducerMap, } from '@ngrx/store';
import { transactionReducer } from './transaction.reducer';
import { State } from '../accounting.state';
import { userReducer } from './user.reducer';
import { transactionManageReducer } from './transaction-manage.reducer';
import { requestsReducer } from './requests.reducer';

export const reducers: ActionReducerMap<State> = {
    transactions: transactionReducer,
    transactionManage: transactionManageReducer,
    user: userReducer,
    requests: requestsReducer
};
