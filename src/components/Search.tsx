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
  readonly status: Status;
}
const LOAD_COUNT = 10;
const MINIMUM_SYMBOLS_BEFORE_SEARCHING = 2;

enum Status {
  REST, LOADING, LOADED
}

class Search extends Component<SearchProps, SearchState> {
  constructor(props: SearchProps) {
    super(props);
    this.state = {
      status: Status.REST,
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
        status: Status.LOADING
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
      status: Status.LOADED
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
    switch(this.state.status) {
      case Status.REST:
        return null;
      case Status.LOADING:
        return <Spinner/>;
      case Status.LOADED:
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
        return <SearchResults {...resultListProps}></SearchResults>;
    }
  }

}

export default Search;