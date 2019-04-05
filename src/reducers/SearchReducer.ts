import { SearchChangedAction, SEARCH_CHANGED } from "../actions/SearchChangedAction";
import { SearchState } from "../state_model/SearchState";

export default function searchReducer(state: SearchState = {}, action: SearchChangedAction): SearchState {
  if (action.type == SEARCH_CHANGED) {
    return action.payload;
  }
  return state;
}
