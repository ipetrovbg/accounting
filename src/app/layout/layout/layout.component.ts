import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  public items: Array<any> = [];
  public user: string = ''
  public userMenu = [];
  
constructor(
  private router: Router
) {
  this.items = this.mapItems();
}

public ngOnInit() {
  this.user = localStorage.getItem('username');
  this.userMenu = [
    {
      text: this.user,
      path: null,
      items: [
        { text: 'Logout', path: '/login' }
      ]
    }
  ]
}

public onSelectUserMenu({ item }) {
  if (item.text === 'Logout') {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('username');
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
    { text: 'Login', path: '/login' },
    { text: 'Dashboard', path: null, items: [
      { text: 'Dashboard', path: '/dashboard/dashboard' },
      { text: 'Transactions Graph', path: '/dashboard/transactions-graph' }
      
    ] }
  ];
}

}
