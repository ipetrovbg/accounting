import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';
import { routing } from './layout.routes';
import { TransactionsGraphComponent } from './transactions-graph/transactions-graph.component';
import { AuthenticationModule } from '../authentication/authentication.module';

@NgModule({
  imports: [
    CommonModule,
    routing,
    SharedModule,
    AuthenticationModule
  ],
  declarations: [DashboardComponent, LayoutComponent, TransactionsGraphComponent]
})
export class LayoutModule { }
