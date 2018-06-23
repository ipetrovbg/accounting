export interface AuthState {
  loading: boolean;
  error: boolean;
  errors: string[];
}

export interface RequestsState {
  auth: AuthState;
}
