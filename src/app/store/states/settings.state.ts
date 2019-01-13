import { EntityState } from '@ngrx/entity';
import { Settings } from '../../settings/settings.model';

export interface SettingsState extends EntityState<Settings> {}
