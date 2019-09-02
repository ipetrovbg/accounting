import { Currency } from '../store/states/currency.state';

export interface Account {
  currency: Currency;
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
