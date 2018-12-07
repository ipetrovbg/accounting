import { EntityState } from '@ngrx/entity';

export interface Currency {
  id: number;
  sign: string;
  currency: string;
  country: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CurrenciesState extends EntityState<Currency> {}

export interface CurrencyManageState {
  lastUsed: Currency;
  currencies: CurrenciesState;
}
