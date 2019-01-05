import { AccountManageActions, AccountManageActionTypes } from './../actions/account-manage.actions';
import { AccountManageState } from '../states/account-manage.state';
import { initialState } from '../accounting.state';

export function accountManageReducer(
  state: AccountManageState = initialState.accountManage,
  action: AccountManageActions
): AccountManageState {
  switch (action.type) {
    case AccountManageActionTypes.UPDATE:
      return {...state, [action.field]: action.value, edit: state.edit};

    case AccountManageActionTypes.DELETE:
      return {...state, ...initialState.accountManage};

    case AccountManageActionTypes.LOAD:
      const {id, name, currency, amount} = action.account;
      return {
        ...state, ...{
          id, name, amount, edit: state.edit, currency:
            {
              id: currency.id, currency: currency.currency, sign: currency.sign, country: currency.country
            }
        }
      };

    case AccountManageActionTypes.UPDATE_EDIT:
      if (action.account.currency) {
        const {id, sign, currency, country} = action.account.currency;

        return {
          ...state,
          edit: {
            ...state.edit, ...{
              id: action.account.id,
              name: action.account.name,
              currency: {...state.edit.currency, ...{id, sign, currency, country}}
            }
          }
        };
      } else {
        return {
          ...state,
          edit: {
            ...state.edit, ...{
              id: action.account.id,
              name: action.account.name,
              currency: {...state.edit.currency, ...{id: null, sign: '', currency: ''}}
            }
          }
        };
      }
    default:
      return state;
  }
}
