import log from "../utils/Logging";

export const SEARCH_QUERY_CHANGED = "search query changed";

export interface SearchQueryChangedAction {
  readonly type: string;
  readonly payload: string;
}

export default function searchQueryChanged(query: string): SearchQueryChangedAction {
  return {
    type: SEARCH_QUERY_CHANGED,
    payload: query
  }
}