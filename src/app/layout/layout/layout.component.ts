import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { State } from '../../store/accounting.state';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import {Logout, TokenAuthentication} from '../../store/actions/user.actions';
import { DeleteAll } from '../../store/actions/transaction.actions';
import { AccountsDeleteAll } from '../../store/actions/account.actions';
import { Delete } from '../../store/actions/account-manage.actions';
import { TransactionFilterUpdate } from '../../store/actions/transation-filter.actions';
import { CurrencyService } from '../../core/currency.service';
import { AddMany } from '../../store/actions/currency.actions';
import { Currency } from '../../store/states/currency.state';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {
  public items: Array<any> = [];
  public user: Observable<string>;
  public userMenu = [];
  private subscription: Subscription = new Subscription();

constructor(
  private router: Router,
  private store: Store<State>,
  private currency: CurrencyService
) {
  this.items = this.mapItems();
}

public ngOnInit() {
  this.store.dispatch(new TokenAuthentication(localStorage.getItem('token')));
  this.user = this.store.select(state => state.user.name);

  this.subscription.add(this.user.subscribe(name => {
    if (name) {
      this.subscription
        .add(this.currency.getCurrencies()
          .subscribe((currencies: {succsess: boolean, response: Currency[]}) =>
            this.store.dispatch(new AddMany(currencies.response))));
    }

    this.userMenu = [
      {
        text: name,
        path: null,
        items: [
          { text: 'Setting', path: '/dashboard/settings' },
          { text: 'Logout', path: '/login' }
        ]
      }
    ];
  }));

}

ngOnDestroy() {
  this.subscription.unsubscribe();
}

public onSelectUserMenu({ item }) {
  if (!item.path) {
    return;
  }
  if (item.text === 'Logout') {
    localStorage.removeItem('token');
    this.store.dispatch(new Logout());
    this.store.dispatch(new DeleteAll());
    this.store.dispatch(new AccountsDeleteAll());
    this.store.dispatch(new AccountsDeleteAll());
    this.store.dispatch(new Delete());
    this.store.dispatch(new TransactionFilterUpdate('account', null));
    this.router.navigate([ item.path ]);
    return;
  }


  this.router.navigate([ item.path ]);
}

public onSelect({ item }): void {
  if (item.path) {

    this.router.navigate([ item.path ]);
  }
}

private mapItems(): any[] {
  return [
    { text: 'Home', path: '/home' },
    { text: 'Dashboard', path: null,
      items: [
        { text: 'Dashboard', path: '/dashboard/dashboard' },
        { text: 'Transactions Graph', path: '/dashboard/transactions-graph' }
      ]
    },
    { text: 'Accounts', path: '/dashboard/accounts' }
  ];
}

}
