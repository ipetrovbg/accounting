export class UserState {
  email: string;
  password: string;
  token: string;
  name: string;
  id: number;
  constructor({ email, password, token, name, id } = { email: '', password: '', token: '', name: '', id: null }) {
    this.email    = email || '';
    this.password = password || '';
    this.token    = token || '';
    this.name     = name || '';
    this.id       = id || null;
  }
}
