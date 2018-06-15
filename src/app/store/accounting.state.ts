import { TransactionState } from './states/transaction.state';
import { UserState } from './states/user.state';


export interface State {
  transactions: TransactionState;
  user: UserState;
}

export const initialState: State = {
  transactions: {
    ids: [],
    entities: null
  },
  user: {
    email: '',
    password: '',
    token: '',
    name: ''
  }
};
