import { initialState } from '../accounting.state';
import { RequestsState } from '../states/requests.state';
import { RequestsActions, RequestsActionTypes } from '../actions/requests.actions';

export function requestsReducer(state: RequestsState = initialState.requests, action: RequestsActions): RequestsState {
  switch (action.type) {
    case RequestsActionTypes.LOADING:
      return { ...state, [action.entity]: { ...state[action.entity], loading: action.loading } };
    case RequestsActionTypes.SET_ERROR_MESSAGES:
      return { ...state, [action.entity]: { ...state[action.entity], errors: action.messages } };
    case RequestsActionTypes.SET_ERROR:
      return { ...state, [action.entity]: { ...state[action.entity], error: action.error } };
    default:
      return state;
  }
}
