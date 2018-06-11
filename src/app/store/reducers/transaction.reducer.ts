import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TransactionState } from './../states/transaction.state';
import { Transaction } from './../../transaction/transaction.model';
import { TransactionsActions, TransactionActionTypes } from './../actions/transaction.actions';
import { createEntityAdapter } from '@ngrx/entity';
import { State } from '../accounting.state';



const transactionAdapter = createEntityAdapter<Transaction>();

const initialState: TransactionState = transactionAdapter.getInitialState();

export function transactionReducer(state: TransactionState = initialState, action: TransactionsActions ): TransactionState {
    switch (action.type) {

        case TransactionActionTypes.ADD_ONE:
          return transactionAdapter.addOne(action.book, state);

        case TransactionActionTypes.ADD_MANY:
          return transactionAdapter.addMany(action.transactions, state);

        case TransactionActionTypes.UPDATE_ONE:
          return transactionAdapter.updateOne({ id: action.id, changes: action.changes, }, state);

        case TransactionActionTypes.DELETE_ONE:
          return transactionAdapter.removeOne(action.id, state);

        case TransactionActionTypes.GET_ALL:
          return transactionAdapter.addAll(action.books, state);

        default:
          return state;

      }
}


export const getSelectedTransactionsId = (state: State) => state.transactions.ids;

export const {
  // select the array of user ids
  selectIds: selectTransactionsIds,

  // select the dictionary of user entities
  selectEntities: selectTransactionsEntities,

  // select the array of users
  selectAll: selectAllTransactions,

  // select the total user count
  selectTotal: selectTransactionsTotal,
} = transactionAdapter.getSelectors();

export const selectTransactionState = createFeatureSelector<TransactionState>('transactions');

export const selectAllTransactionsSelector = createSelector(
    selectTransactionState,
    selectAllTransactions
);

export const selectTotalTransactionsSelector = createSelector(
    selectTransactionState,
    selectTransactionsTotal
);