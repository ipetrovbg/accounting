import { SharedModule } from './../shared/shared.module';
import { TransactionService } from './transaction.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DialogTransactionComponent } from './dialog-transaction/dialog-transaction.component';
import { DialogTransferComponent } from './dialog-transfer/dialog-transfer.component';
import { DialogTransactionDatesComponent } from './dialog-transaction-dates/dialog-transaction-dates.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    DialogTransactionDatesComponent,
    DialogTransactionComponent,
    DialogTransferComponent
  ],
  providers: [
    TransactionService,
  ],
  entryComponents: [
    DialogTransactionDatesComponent,
    DialogTransactionComponent,
    DialogTransferComponent
  ]
})
export class TransactionModule { }
