import { SEARCH_STATE_CHANGED } from "../actions/SearchStateChangedAction";
import { SearchState, SearchStatus } from "../state_model/SearchState";
import { REPO_STAR_STATE_CHANGED, RepoStarStateActionPayload } from "../actions/RepoStarStateAction";
import _remove from 'lodash/remove';
import log from "../utils/Logging";

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

export default function searchStateReducer(state: SearchState = defaultSearchState, action: any): SearchState {
  if (action.type == SEARCH_STATE_CHANGED) {
    return Object.assign({}, state, action.payload);
  }
  if (action.type == REPO_STAR_STATE_CHANGED) {
    const { owner, name, starred, starCount }: RepoStarStateActionPayload = action.payload;

    let loadedReposShallowCopy = [...state.loadedRepos];
    const repoToUpdateIndex = loadedReposShallowCopy.findIndex(repo => repo.owner === owner && repo.name === name);
    const repoToUpdate = loadedReposShallowCopy[repoToUpdateIndex];
    const updatedRepoCopy = { ...repoToUpdate, starred, starCount };
    loadedReposShallowCopy.splice(repoToUpdateIndex, 1, updatedRepoCopy);

    return Object.assign({}, state, { loadedRepos: loadedReposShallowCopy });
  }
  return state;
}
