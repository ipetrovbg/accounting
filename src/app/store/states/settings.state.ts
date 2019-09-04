import { EntityState } from '@ngrx/entity';
import { Setting } from '../../settings/settings.model';

export interface SettingsState extends EntityState<Setting> {}
