import { Component, OnInit } from '@angular/core';
import { AuthService } from './authentication/auth/auth.service';
import { State } from './store/accounting.state';
import { Store } from '@ngrx/store';
import { TokenAuthentication } from './store/actions/user.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private store: Store<State>
  ) {}

  ngOnInit() {
    this.store.dispatch(new TokenAuthentication(localStorage.getItem('token')));
  }
}
