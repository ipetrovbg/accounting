import { Store } from '@ngrx/store';
import { TransactionManageState } from './states/transaction-manage.state';
import { Transaction } from './../transaction/transaction.model';
import { TransactionState } from './states/transaction.state';
import { UserState } from './states/user.state';
import 'rxjs-compat/add/operator/take';


export interface State {
  transactions: TransactionState;
  transactionManage: TransactionManageState;
  user: UserState;
}

export const initialState: State = {
  transactions: {
    ids: [],
    entities: null
  },
  transactionManage: {
    id: null,
    date: null,
    createdAt: null,
    updatedAt: null,
    userId: null,
    withdrawal: '',
    deposit: '',
    reason: '',
    isTest: false
  },
  user: {
    id: null,
    email: '',
    password: '',
    token: '',
    name: ''
  }
};


export function getState(store: Store<State>) {
  let o: State;
  store.select(state => state).take(1).subscribe(state => o = state);
  return o;
}