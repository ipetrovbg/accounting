import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CoreService} from '../core/core/core.service';
import {Observable} from 'rxjs';
import {Setting} from './settings.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(
    private http: HttpClient,
    private core: CoreService
  ) { }

  fetch(userId): Observable<Setting[]> {
    return this.http.get<Setting[]>(`${this.core.api}/users/${userId}/settings`);
  }

  update(setting: Setting) {
    return this.http.put(`${this.core.api}/users/${setting.userId}/setting`, {setting});
  }

  create(setting: Setting) {
    return this.http.post(`${this.core.api}/users/${setting.userId}/setting`, {setting});
  }
}
