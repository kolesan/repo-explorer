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
  readonly contributorCounts: number[];
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
      contributorCounts: []
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
        contributorCounts: [],
        state: State.LOADING
      })
      this.search(newQuery);
    }
  }

  async search(searchQuery: string, startCursor?: string) {
    log(`Searching: ${searchQuery}. Cursor: ${startCursor}`);
    const results = await repoSearch({ searchQuery, startCursor, count: LOAD_COUNT });
    log(`Found: ${results.total} ${searchQuery} ${JSON.stringify(results.repos.map(repo=>`${repo.owner}/${repo.name}`), null, "")} ${results.nextPageCursor}`);

    this.requestContributorCounts(this.state.loadedRepos.length, results.repos);

    let loadedRepos = [ ...this.state.loadedRepos, ...results.repos ];
    let itemLoadedState = [ ...new Array(loadedRepos.length)].map(it => true);

    this.setState({
      searchResults: results,
      loadedRepos,
      itemLoadedState,
      state: State.LOADED
    });
  }

  requestContributorCounts(startingIndex: number, repos: Repo[]) {
    repos.forEach(async (repo, i) => {
      let count = await contributorCount(repo.owner, repo.name);
      let contributorCounts = [...this.state.contributorCounts];
      contributorCounts[startingIndex + i] = count;
      this.setState({
        contributorCounts
      })
    })
  }

  render() {
    switch(this.state.state) {
      case State.REST:
        return null;
      case State.LOADING:
        return <Spinner/>;
      case State.LOADED:
        const { searchResults, loadedRepos, itemLoadedState, contributorCounts } = this.state;
        const { total, nextPageCursor } = searchResults;
        const { searchQuery } = this.props;

        const resultListProps = {
          loadMoreItems: () => this.search(searchQuery, nextPageCursor),
          total,
          loadedRepos,
          itemLoadedState,
          contributorCounts
        }
        log("State changed to loaded - showing results");
        return <SearchResults {...resultListProps}></SearchResults>;
    }
  }

}

export default Search;