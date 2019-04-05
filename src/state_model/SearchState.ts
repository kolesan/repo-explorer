import { RepoSearchResult, RepoSearchResultItem } from "../types/RepoListTypes";

export enum SearchStatus {
  REST, LOADING, LOADED
}
export interface SearchState {
  readonly searchResults: RepoSearchResult;
  readonly loadedRepos: RepoSearchResultItem[];
  readonly itemLoadedState: boolean[];
  readonly contributorCounts: number[];
  readonly status: SearchStatus;
  readonly scrollOffset: number;
}
