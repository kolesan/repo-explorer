import { SearchStateChangedAction, SEARCH_STATE_CHANGED } from "../actions/SearchStateChangedAction";
import { SearchState, SearchStatus } from "../state_model/SearchState";
import _merge from "lodash/merge";

const defaultSearchState = {
  status: SearchStatus.REST,
  searchResults: {
    total: 0,
    repos: []
  },
  loadedRepos: [],
  itemLoadedState: [],
  contributorCounts: [],
  scrollOffset: 0
}

export default function searchStateReducer(state: SearchState = defaultSearchState, action: SearchStateChangedAction): SearchState {
  if (action.type == SEARCH_STATE_CHANGED) {
    return _merge({}, state, action.payload);
  }
  return state;
}
