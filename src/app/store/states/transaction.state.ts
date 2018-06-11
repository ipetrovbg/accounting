import { Transaction } from './../../transaction/transaction.model';
import { EntityState } from '@ngrx/entity';

export interface TransactionState extends EntityState<Transaction> {}