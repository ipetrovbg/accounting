import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AccountState } from '../states/accounts.state';
import { Account } from '../../transaction/account.model';
import { AccountActions, AccountActionTypes } from '../actions/account.actions';
import { createEntityAdapter } from '@ngrx/entity';
import { State } from '../accounting.state';


const accountAdapter = createEntityAdapter<Account>();

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

export const selectTotalAccountSelector = createSelector(
  selectAccountState,
  selectAccountsTotal
);
