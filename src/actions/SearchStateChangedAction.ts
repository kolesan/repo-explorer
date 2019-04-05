import { SearchState } from "../state_model/SearchState";

export const SEARCH_STATE_CHANGED = "search state changed";

export interface SearchStateChangedAction {
  readonly type: string;
  readonly payload: SearchState;
}

export default function searchStateChanged(searchState: SearchState): SearchStateChangedAction {
  return {
    type: SEARCH_STATE_CHANGED,
    payload: searchState
  }
}