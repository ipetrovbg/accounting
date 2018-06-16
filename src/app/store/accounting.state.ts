import { TransactionManageState } from './states/transaction-manage.state';
import { Transaction } from './../transaction/transaction.model';
import { TransactionState } from './states/transaction.state';
import { UserState } from './states/user.state';


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
    email: '',
    password: '',
    token: '',
    name: ''
  }
};
