import { SearchState } from "../state_model/SearchState";

export const SEARCH_CHANGED = "search changed";

export interface SearchChangedAction {
  readonly type: string;
  readonly payload: SearchState;
}

export default function searchChanged(searchState: SearchState): SearchChangedAction {
  return {
    type: SEARCH_CHANGED,
    payload: searchState
  }
}