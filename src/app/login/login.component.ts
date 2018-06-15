import { CoreService } from './../core/core/core.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

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
    private core: CoreService
  ) { }

  ngOnInit() {
    this.http.get(`${this.core.api}/authenticate/${localStorage.getItem('token')}`)
    .subscribe((login: any) => {
      if (login.token) {
        this.router.navigate(['/dashboard']);
      }
    })
    this.form = this.fb.group({
      email: '',
      password: ''
    });
  }

  login() {
    this.http
    .post(`${this.core.api}/authenticate`, this.form.value)
    .subscribe((login: any) => {
      if (login.success) {
        localStorage.setItem('token', login.token);
        localStorage.setItem('email', login.user.email);
        localStorage.setItem('username', login.user.name);
        this.router.navigate(['/dashboard']);
      }      
    });
  }

}
