import { AccountModelExtended } from './../../transaction/account.model';
import { EntityState } from '@ngrx/entity';

export interface AccountState extends EntityState<AccountModelExtended> {}
