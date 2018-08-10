import { TransactionFilterState } from '../states/transaction-filter.state';
import { initialState } from '../accounting.state';
import { AccountActionTypes, TransactionFilterActions } from '../actions/transation-filter.actions';

export function transactionFilterReducer(
  state: TransactionFilterState = initialState.transactionFilter,
  action: TransactionFilterActions
): TransactionFilterState {
  switch (action.type) {
    case AccountActionTypes.UPDATE:
      return { ...state, [action.key]: action.value };
    default: return state;
  }
}
