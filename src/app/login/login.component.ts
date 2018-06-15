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

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private core: CoreService,
    private store: Store<State>,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.checkAuth().subscribe();

    this.form = this.fb.group({
      email: '',
      password: ''
    });
  }

  login() {
    this.auth.login(this.form.value).subscribe();
  }

}
