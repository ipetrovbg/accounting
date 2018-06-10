import { SharedModule } from './../shared/shared.module';
import { TransactionService } from './transaction.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [],
  providers: [
    TransactionService
  ]
})
export class TransactionModule { }
