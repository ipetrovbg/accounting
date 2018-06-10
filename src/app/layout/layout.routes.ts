import { LayoutComponent } from './layout/layout.component';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { TransactionsGraphComponent } from './transactions-graph/transactions-graph.component';


const routes: Routes = [
  { path: '', component: LayoutComponent, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'transactions-graph', component: TransactionsGraphComponent }
    ],
    // canActivate: [ LayoutGuard ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
