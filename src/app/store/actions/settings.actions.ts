import { Action } from '@ngrx/store';
import { Setting } from '../../settings/settings.model';

export enum SettingsActionTypes {
  GET_ONE = '[Settings] Get One',
  ADD_ONE = '[Settings] Add One',
  UPDATE_ONE = '[Settings] Update One',
  DELETE_ONE = '[Settings] Delete One',
  DELETE_ALL = '[Settings] Delete All',
  GET_ALL = '[Settings] Get All',
  ADD_MANY = '[Settings] Add Many',
  FETCH = '[Settings] Fetch'
}

export class Fetch implements Action {
  public readonly type: SettingsActionTypes.FETCH = SettingsActionTypes.FETCH;

  constructor(public userId: number) { }
}

export class AddOne implements Action {
  public readonly type: SettingsActionTypes.ADD_ONE = SettingsActionTypes.ADD_ONE;

  constructor( public setting: Setting ) { }
}

export class AddMany implements Action {
  public readonly type: SettingsActionTypes.ADD_MANY = SettingsActionTypes.ADD_MANY;

  constructor( public settings: Setting[] ) { }
}

export class UpdateOne implements Action {
  readonly type: SettingsActionTypes.UPDATE_ONE = SettingsActionTypes.UPDATE_ONE;

  constructor(
    public id: number,
    public changes: Partial<Setting>,
  ) { }
}

export class DeleteOne implements Action {
  readonly type: SettingsActionTypes.DELETE_ONE = SettingsActionTypes.DELETE_ONE;
  constructor(public id: number) { }
}

export class DeleteAll implements Action {
  readonly type: SettingsActionTypes.DELETE_ALL = SettingsActionTypes.DELETE_ALL;
}

export class GetAll implements Action {
  readonly type: SettingsActionTypes.GET_ALL = SettingsActionTypes.GET_ALL;
  constructor(public settings: Setting[]) { }
}

export class GetOne implements Action {
  readonly type: SettingsActionTypes.GET_ONE = SettingsActionTypes.GET_ONE;
  constructor(public id: number) { }
}

export type SettingsActions = AddOne | GetOne | UpdateOne | DeleteOne | GetAll | AddMany | DeleteAll | Fetch;
