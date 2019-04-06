import { SearchStateChangedAction, SEARCH_STATE_CHANGED } from "../actions/SearchStateChangedAction";
import { SearchState, SearchStatus } from "../state_model/SearchState";

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
    return Object.assign({}, state, action.payload);
  }
  return state;
}
