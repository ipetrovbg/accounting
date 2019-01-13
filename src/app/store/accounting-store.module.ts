import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';

import { reducers } from './reducers';
import { TransactionEffects } from './effects/transaction.effects';
import { UserEffects } from './effects/user.effects';
import { AccountEffects } from './effects/account.effects';
import { SettingsEffects } from './effects/settings.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({ maxAge: 100 }),
    EffectsModule.forRoot([
      TransactionEffects,
      AccountEffects,
      UserEffects,
      SettingsEffects
    ])
  ],
  declarations: [],
  exports: [
    StoreModule
  ]
})
export class AccountingStoreModule { }
