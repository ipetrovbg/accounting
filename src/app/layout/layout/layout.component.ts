import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { State } from '../../store/accounting.state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Logout } from '../../store/actions/user.actions';
import { DeleteAll } from '../../store/actions/transaction.actions';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  public items: Array<any> = [];
  public user: Observable<string>;
  public userMenu = [];

constructor(
  private router: Router,
  private store: Store<State>
) {
  this.items = this.mapItems();
}

public ngOnInit() {
  this.user = this.store.select(state => state.user.name);

  this.user.subscribe(name => {
    this.userMenu = [
      {
        text: name,
        path: null,
        items: [
          { text: 'Logout', path: '/login' }
        ]
      }
    ];
  });

}

public onSelectUserMenu({ item }) {
  if (item.text === 'Logout') {
    localStorage.removeItem('token');
    this.store.dispatch(new Logout());
    this.store.dispatch(new DeleteAll());
    this.router.navigate([ item.path ]);
  }
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
        // { text: 'Transactions', path: '/dashboard/transactions' },
        { text: 'Transactions Graph', path: '/dashboard/transactions-graph' }
      ]
    }
  ];
}

}
