import { ActionReducerMap, } from '@ngrx/store';
import { transactionReducer } from './transaction.reducer';
import { State } from '../accounting.state';
import { userReducer } from './user.reducer';
import { transactionManageReducer } from './transaction-manage.reducer';
import { requestsReducer } from './requests.reducer';
import { accountReducer } from './account.reducer';
import { accountManageReducer } from './account-manage.reducer';
import { transactionFilterReducer } from './transaction-filter.reducer';
import { currencyReducer } from './currency.reducer';
import { settingsReducer } from './settings.reducer';

export const reducers: ActionReducerMap<State> = {
  transactions: transactionReducer,
  accounts: accountReducer,
  accountManage: accountManageReducer,
  transactionManage: transactionManageReducer,
  user: userReducer,
  requests: requestsReducer,
  transactionFilter: transactionFilterReducer,
  currencies: currencyReducer,
  settings: settingsReducer
};
