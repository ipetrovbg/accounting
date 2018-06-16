import { SharedModule } from './../shared/shared.module';
import { TransactionService } from './transaction.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DialogTransactionComponent } from './dialog-transaction/dialog-transaction.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    DialogTransactionComponent
  ],
  providers: [
    TransactionService,
  ],
  entryComponents: [
    DialogTransactionComponent
  ]
})
export class TransactionModule { }
