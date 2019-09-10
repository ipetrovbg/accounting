import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AccountState } from '../states/accounts.state';
import { Account, AccountModelExtended } from '../../transaction/account.model';
import { AccountActions, AccountActionTypes } from '../actions/account.actions';
import { createEntityAdapter } from '@ngrx/entity';
import { State } from '../accounting.state';

export interface Balance {
  amount: number;
  name: string;
  color: string;
}

export function labelBalanceContent(e) {
  return `${e.category} \n ${Math.floor(e.value * 100) / 100}`;
}
const accountAdapter = createEntityAdapter<AccountModelExtended>();

const initialState: AccountState = accountAdapter.getInitialState();

export function accountReducer(state: AccountState = initialState, action: AccountActions): AccountState {
  switch (action.type) {

    case AccountActionTypes.ADD_ONE:
      return accountAdapter.addOne(action.account, state);

    case AccountActionTypes.ADD_MANY:
      return accountAdapter.addMany(action.accounts, state);

    case AccountActionTypes.UPDATE_ONE:
      return accountAdapter.updateOne({id: action.id, changes: action.changes}, state);

    case AccountActionTypes.DELETE_ONE:
      return accountAdapter.removeOne(action.id, state);

    case AccountActionTypes.DELETE_ALL:
      return accountAdapter.removeAll(state);

    case AccountActionTypes.GET_ALL:
      return accountAdapter.addAll(action.accounts, state);

    default:
      return state;

  }
}


export const getSelectedAccountsId = (state: State) => state.transactions.ids;

export const {
  // select the array of user ids
  selectIds: selectAccountsIds,

  // select the dictionary of user entities
  selectEntities: selectAccountsEntities,

  // select the array of users
  selectAll: selectAllAccounts,

  // select the total user count
  selectTotal: selectAccountsTotal,
} = accountAdapter.getSelectors();

export const selectAccountState = createFeatureSelector<AccountState>('accounts');

export const selectAllAccountsSelector = createSelector(
  selectAccountState,
  selectAllAccounts
);

export const selectAllPositiveAccountsSelector = createSelector(
  selectAllAccountsSelector,
  (accounts) => accounts.filter(account => account.amount > 0)
);
const successColors = ['#17a2b8', '#007bff', '#17a2b8', '#28a745', '#20c997', '#28a745'];
const dangerColors = ['#e83e8c', '#dc3545', '#fd7e14', '#dc3545'];
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

export const selectTotalAmount = createSelector(
  selectAllAccountsSelector,
  accounts => {
    const totals = {};
    const totalAccontsAmount = [];
    accounts.map(account => {

      if (!account.currency.sign) {
        return;
      }

      if (!totals[account.currency.sign]) {
        totals[account.currency.sign] = 0;
      }
      totals[account.currency.sign] += account.amount;
    });
    Object.keys(totals).forEach(key => {
      totalAccontsAmount.push({ name: key, amount: totals[key], color: totals[key] > 0 ?
          successColors[getRandomInt(6)] :
          dangerColors[getRandomInt(4)] });
    });
    return totalAccontsAmount;
  }
);

export const selectTotalAccountSelector = createSelector(
  selectAccountState,
  selectAccountsTotal
);
