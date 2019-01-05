import { Currency } from '../store/states/currency.state';

export interface Account {
  id: number;
  name: string;
  userId?: number;
  amount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AccountModelExtended extends Account {
  currency: Currency;
}
