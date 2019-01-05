import { AccountModelExtended } from '../../transaction/account.model';
import { Currency } from './currency.state';

export interface AccountManageState {
  id: number;
  name: string;
  currency: Currency;
  amount: number;
  edit?: AccountModelExtended;
}
