import React, { Component } from "react";
import { RepoSearchResult, Repo } from "../types/RepoListTypes";
import { repoSearch } from "../apis/v4/GitHubApiV4";
import { contributorCount } from "../apis/v3/GitHubApiV3";
import Spinner from "./Spinner";
import SearchResults from "./SearchResults";
import _debounce from 'lodash/debounce'
import log from "../utils/Logging";

interface SearchProps {
  readonly searchQuery: string;
}
interface SearchState {
  readonly searchResults: RepoSearchResult;
  readonly loadedRepos: Repo[];
  readonly itemLoadedState: boolean[];
  readonly state: State;
}
const LOAD_COUNT = 10;
const MINIMUM_SYMBOLS_BEFORE_SEARCHING = 2;

enum State {
  REST, LOADING, LOADED
}

class Search extends Component<SearchProps, SearchState> {
  constructor(props: SearchProps) {
    super(props);
    this.state = {
      state: State.REST,
      searchResults: {
        total: 0,
        repos: []
      },
      loadedRepos: [],
      itemLoadedState: [],
    };
    this.onSearchQueryChanged = _debounce(this.onSearchQueryChanged, 400, { trailing: true });
  }

  async componentDidUpdate(prevProps: SearchProps) {
    const newQuery = this.props.searchQuery;
    if (newQuery != prevProps.searchQuery) {
      this.onSearchQueryChanged(newQuery);
    }
  }

  onSearchQueryChanged(newQuery: string) {
    log("Search query changed:", newQuery);
    if (newQuery.length > MINIMUM_SYMBOLS_BEFORE_SEARCHING) {
      this.setState({
        loadedRepos: [],
        itemLoadedState: [],
        state: State.LOADING
      })
      this.search(newQuery);
    }
  }

  async search(searchQuery: string, startCursor?: string) {
    log(`Searching: ${searchQuery}. Cursor: ${startCursor}`);
    const results = await repoSearch({ searchQuery, startCursor, count: LOAD_COUNT });
    log(`Found: ${results.total} ${searchQuery} ${JSON.stringify(results.repos.map(repo=>`${repo.owner}/${repo.name} c:${repo.contributorCount}`), null, "")} ${results.nextPageCursor}`);

    let newRepos = await this.withContributorCounts(results.repos);

    log(`With contributors: ${JSON.stringify(newRepos.map(repo=>`${repo.owner}/${repo.name} c:${repo.contributorCount}`), null, "")}`);

    let loadedRepos = [ ...this.state.loadedRepos, ...newRepos];

    let itemLoadedState = [ ...new Array(results.total)].map(it => false);
    for(let i = 0; i < loadedRepos.length; i++) {
      itemLoadedState[i] = true;
    }

    this.setState({
      searchResults: results,
      loadedRepos,
      itemLoadedState,
      state: State.LOADED
    });
  }

  withContributorCounts(repos: Repo[]): Promise<Repo[]> {
    return Promise.all(
      repos.map(async repo => 
        ( { ...repo, contributorCount: await contributorCount(repo.owner, repo.name)} )
      )
    );
  }

  render() {
    switch(this.state.state) {
      case State.REST:
        return null;
      case State.LOADING:
        return <Spinner/>;
      case State.LOADED:
        const { searchResults, loadedRepos, itemLoadedState } = this.state;
        const { total, nextPageCursor } = searchResults;
        const { searchQuery } = this.props;

        const resultListProps = {
          loadMoreItems: () => this.search(searchQuery, nextPageCursor),
          total,
          loadedRepos,
          itemLoadedState
        }
        log("State changed to loaded - showing results");
        return <SearchResults {...resultListProps}></SearchResults>;
    }
  }

}

export default Search;