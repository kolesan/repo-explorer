import { SearchQueryChangedAction, SEARCH_QUERY_CHANGED } from "../actions/SearchQueryChangedAction";
import log from "../utils/Logging";

export default function searchQueryReducer(state: string = '', action: SearchQueryChangedAction): string {
  log("Reducing", action.payload);
  if (action.type == SEARCH_QUERY_CHANGED) {
    return action.payload;
  }
  return state;
}
