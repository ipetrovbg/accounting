import { AccountManageActions, AccountManageActionTypes } from './../actions/account-manage.actions';
import { AccountManageState } from '../states/account-manage.state';
import { initialState } from '../accounting.state';

export function accountManageReducer(
  state: AccountManageState = initialState.accountManage,
  action: AccountManageActions
): AccountManageState {
  switch (action.type) {
    case AccountManageActionTypes.UPDATE:
      return { ...state, [action.field]: action.value };

    case AccountManageActionTypes.LOAD:
      const { id, name } = action.account;

      return { ...state, ...{ id, name } };

    default: return state;
  }
}
