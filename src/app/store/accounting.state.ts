import { TransactionState } from './states/transaction.state';
import { Transaction } from './../transaction/transaction.model';


export interface State {
    transactions: TransactionState;
  }