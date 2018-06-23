import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { State } from '../store/accounting.state';
import { Store } from '@ngrx/store';
import { AuthService } from '../authentication/auth/auth.service';
import { CoreService } from '../core/core/core.service';
import { Observable } from 'rxjs';
import { AuthState } from '../store/states/requests.state';
import { Loading, SetError, SetErrorMessages } from '../store/actions/requests.actions';
import { Update } from '../store/actions/user.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public form: FormGroup;
  public authRequest: Observable<AuthState>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private core: CoreService,
    private store: Store<State>,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.resetErrorsAndLoading();

    this.authRequest = this.store.select(state => state.requests.auth);

    this.form = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      name: ['', Validators.required],
      password: ['', Validators.required],
      copassword: ['', Validators.required]
    });
  }

  register() {
    this.store.dispatch(new Loading('auth', true));

    if (this.form.invalid) {

      if (this.form.get('copassword').errors && this.form.get('copassword').errors.required)
        this.setErrorsAndLoading(['Confirm Password is required']);

      if (this.form.get('password').errors && this.form.get('password').errors.required)
        this.setErrorsAndLoading(['Password is required']);

      if (this.form.get('email').errors) {
        if (this.form.get('email').errors && this.form.get('email').errors.required)
          this.setErrorsAndLoading(['Email is required']);
        if (this.form.get('email').errors.email)
          this.setErrorsAndLoading(['Email is not valid']);
      }

      if (this.form.get('name').errors && this.form.get('name').errors.required)
        this.setErrorsAndLoading(['Name is required']);

      return false;
    }

    if (this.form.get('copassword').value !== this.form.get('password').value) {
      this.setErrorsAndLoading([`Passwords doesn't match`]);
      return false;
    }

    this.auth.register(this.form.value).subscribe((user: any) => {

      if (user.success) {
        this.resetErrorsAndLoading();
        this.store.dispatch(new Update({
          token: user.token,
          email: user.user.email,
          name: user.user.name,
          password: '',
          id: user.user.id
        }));

        localStorage.setItem('token', user.token);
        this.router.navigate(['/dashboard']);
      } else {
        console.log(user);
      }
    }, error => {
      this.setErrorsAndLoading([error.error.response]);
    });
  }

  private setErrorsAndLoading(errors: string[]) {
    this.store.dispatch(new Loading('auth', false));
    this.store.dispatch(new SetError('auth', false));
    this.store.dispatch(new SetErrorMessages('auth', errors));
  }

  private resetErrorsAndLoading() {
    this.store.dispatch(new Loading('auth', false));
    this.store.dispatch(new SetError('auth', false));
    this.store.dispatch(new SetErrorMessages('auth', []));
  }

}
