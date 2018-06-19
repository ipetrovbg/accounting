import { TransactionsComponent } from './transactions/transactions.component';
import { LayoutComponent } from './layout/layout.component';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { TransactionsGraphComponent } from './transactions-graph/transactions-graph.component';


const routes: Routes = [
  { path: '', component: LayoutComponent, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'transactions', component: TransactionsComponent },
      { path: 'transactions-graph', component: TransactionsGraphComponent },
      { path: 'dashboard', component: DashboardComponent },
    ],
    // canActivate: [ LayoutGuard ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
