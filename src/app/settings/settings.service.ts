import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CoreService} from '../core/core/core.service';
import {Observable} from 'rxjs';
import {Settings} from './settings.model';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(
    private http: HttpClient,
    private core: CoreService
  ) { }

  fetch(userId): Observable<Settings[]> {
    return this.http.get<Settings[]>(`${this.core.api}/users/${userId}/settings`);
  }

  update(setting: Settings) {
    return this.http.put(`${this.core.api}/users/${setting.userId}/settings`, {setting});
  }
}
