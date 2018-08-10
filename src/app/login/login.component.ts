import { CoreService } from './../core/core/core.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { State } from '../store/accounting.state';
import { Store } from '@ngrx/store';
import { Update } from '../store/actions/user.actions';
import { AuthService } from '../authentication/auth/auth.service';
import { catchError } from 'rxjs/internal/operators';
import { Loading, SetError, SetErrorMessages } from '../store/actions/requests.actions';
import { Observable } from 'rxjs';
import { AuthState } from '../store/states/requests.state';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public form: FormGroup;
  public authRequest: Observable<AuthState>;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private core: CoreService,
    private store: Store<State>,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.resetErrorsAndLoading();

    this.auth.checkAuth().subscribe();

    this.authRequest = this.store.select(state => state.requests.auth);

    this.form = this.fb.group({
      email: '',
      password: ''
    });
  }

  login() {
    this.store.dispatch(new Loading('auth', true));

    this.auth.login(this.form.value).subscribe((auth: any) => {
      if (!auth.success) {
        this.store.dispatch(new Loading('auth', false));
        this.store.dispatch(new SetError('auth', true));
        this.store.dispatch(new SetErrorMessages('auth', [auth.message]));
      } else {
        setTimeout(() => {
          this.store.dispatch(new Loading('auth', false));
          this.store.dispatch(new SetError('auth', false));
          this.store.dispatch(new SetErrorMessages('auth', []));
        }, 2000);
      }
    }, error => {
      this.resetErrorsAndLoading();
      console.log(error);
      this.store.dispatch(new SetError('auth', false));
      this.store.dispatch(new SetErrorMessages('auth', ['Authentication error']));
    });
  }

  private resetErrorsAndLoading() {
    this.store.dispatch(new Loading('auth', false));
    this.store.dispatch(new SetError('auth', false));
    this.store.dispatch(new SetErrorMessages('auth', []));
  }

}
