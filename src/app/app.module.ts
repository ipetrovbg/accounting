import { AccountingStoreModule } from './store/accounting-store.module';
import { TransactionModule } from './transaction/transaction.module';
import { SharedModule } from './shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';

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
import { environment } from '../environments/environment';



export const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', loadChildren: './layout/layout.module#LayoutModule' },
  { path: '',   redirectTo: 'home', pathMatch: 'full' },
];
const config: SocketIoConfig = { url: environment.host, options: {} };

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
    SocketIoModule.forRoot(config)
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
