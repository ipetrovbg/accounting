import { AccountingStoreModule } from './store/accounting-store.module';
import { TransactionModule } from './transaction/transaction.module';
import { SharedModule } from './shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { Router, RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { AuthenticationModule } from './authentication/authentication.module';
import { ChartsModule } from '@progress/kendo-angular-charts';



export const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', loadChildren: './layout/layout.module#LayoutModule' },
  { path: '',   redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    TransactionModule,
    RouterModule.forRoot(appRoutes),
    AccountingStoreModule,
    DateInputsModule,
    AuthenticationModule,
    ChartsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
