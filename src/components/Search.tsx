import React, { Component } from "react";
import { RepoSearchResult, Repo } from "../types/RepoListTypes";
import log from "../utils/Logging";
import { repoSearch } from "../apis/v4/GitHubApiV4";
import Spinner from "./Spinner";
import _debounce from 'lodash/debounce'
import SearchResults from "./SearchResults";

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
    log(`Found: ${results.total} ${searchQuery} ${JSON.stringify(results.repos.map(repo=>`${repo.owner}/${repo.name}`), null, "")} ${results.nextPageCursor}`);

    let loadedRepos = [ ...this.state.loadedRepos, ...results.repos];

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
        
        return <SearchResults {...resultListProps}></SearchResults>;
    }
  }

}

export default Search;