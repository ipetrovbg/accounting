import { AccountingStoreModule } from './store/accounting-store.module';
import { TransactionModule } from './transaction/transaction.module';
import { SharedModule } from './shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';

import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'hammerjs';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { AuthenticationModule } from './authentication/authentication.module';
import { RegisterComponent } from './register/register.component';
import { CategoriesModule } from './categories/categories.module';
import { HttpClientModule } from '@angular/common/http';
// import { environment } from '../environments/environment';
import { RippleModule } from '@progress/kendo-angular-ripple';
import { PopupModule } from '@progress/kendo-angular-popup';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { LabelModule } from '@progress/kendo-angular-label';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';





export const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule) },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
// const config: SocketIoConfig = { url: environment.host, options: {} };


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent
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
    CategoriesModule,
    HttpClientModule,
    // SocketIoModule.forRoot(config),
    RippleModule,
    PopupModule,
    ChartsModule,
    LabelModule,
    PDFExportModule,
  ],
  bootstrap: [AppComponent]
})
// @ts-ignore
export class AppModule { }
