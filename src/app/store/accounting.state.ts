import { Store } from '@ngrx/store';
import { TransactionManageState } from './states/transaction-manage.state';
import { TransactionState } from './states/transaction.state';
import { UserState } from './states/user.state';
import 'rxjs-compat/add/operator/take';
import { RequestsState } from './states/requests.state';
import { AccountState } from './states/accounts.state';
import { AccountManageState } from './states/account-manage.state';
import { TransactionFilterState } from './states/transaction-filter.state';
import { CurrencyManageState } from './states/currency.state';


export interface State {
  transactions: TransactionState;
  accounts: AccountState;
  accountManage: AccountManageState;
  transactionManage: TransactionManageState;
  transactionFilter: TransactionFilterState;
  user: UserState;
  requests: RequestsState;
  currencies: CurrencyManageState;
}

export const initialState: State = {
  transactions: {
    ids: [],
    entities: null
  },
  accounts: {
    ids: [],
    entities: null
  },
  accountManage: {
    id: null,
    name: '',
    edit: {
      id: null,
      name: '',
      currency: {
        id: null,
        sign: '',
        country: '',
        currency: ''
      }
    },
    currency: {
      id: null,
      sign: '',
      country: '',
      currency: ''
    }
  },
  transactionManage: {
    id: null,
    date: null,
    createdAt: null,
    updatedAt: null,
    userId: null,
    categoryId: null,
    amount: null,
    originalAmount: null,
    transactionId: null,
    currencyId: null,
    comment: '',
    type: 'withdrawal',
    simulation: false,
    accountId: null,
    account: {
      id: null,
      name: '',
      currency: {
        currency: '',
        sign: '',
        id: null,
        country: ''
      }
    },
    category: {
      id: null,
      category: '',
    },
    user: {
      id: null,
      name: '',
      email: ''
    }
  },
  transactionFilter: {
    from: null,
    to: null,
    account: null
  },
  user: {
    id: null,
    email: '',
    password: '',
    token: '',
    name: ''
  },
  requests: {
    auth: {
      loading: false,
      error: false,
      errors: []
    }
  },
  currencies: {
    lastUsed: {
      id: null,
      sign: '',
      country: '',
      currency: ''
    },
    currencies: {
      ids: [],
      entities: null
    }
  }
};


export function getState(store: Store<State>) {
  let o: State;
  store.select(state => state).take(1).subscribe(state => o = state);
  return o;
}
