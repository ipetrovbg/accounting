import { UserState } from '../states/user.state';
import { initialState } from '../accounting.state';
import { UserActions, UserActionTypes } from '../actions/user.actions';

export function userReducer(state: UserState = initialState.user, action: UserActions): UserState {
  switch (action.type) {
    case UserActionTypes.UPDATE:
      return { ...state, ...action.user };
    case UserActionTypes.LOGOUT:
      return { ...state,  email: '', token: '', name: '', password: '', id: null };
    default:
      return state;
  }
}
