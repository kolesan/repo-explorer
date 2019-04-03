import React, { Component } from "react";
import { RepoSearchResult, Repo } from "../types/RepoListTypes";
import { repoSearch } from "../apis/v4/GitHubApiV4";
import { contributorCount } from "../apis/v3/GitHubApiV3";
import Spinner from "./Spinner";
import SearchResults from "./SearchResults";
import _debounce from 'lodash/debounce';
import log from "../utils/Logging";
import { onlyLast, sequential } from "../utils/PromiseUtils";

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
enum Status {
  REST, LOADING, LOADED
}

const LOAD_COUNT = 10;
const MINIMUM_SYMBOLS_BEFORE_SEARCHING = 2;

class Search extends Component<SearchProps, SearchState> {
  onlyLastPromise: Function;
  toPromiseSequence: Function;
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
    this.onReposReceived = this.onReposReceived.bind(this);
    this.enqueMoreResultsRequest = this.enqueMoreResultsRequest.bind(this);
    this.putToSequence = this.putToSequence.bind(this);

    this.onlyLastPromise = onlyLast(this.putToSequence);
    this.toPromiseSequence = sequential(this.onReposReceived);
  }

  putToSequence(searchResult: RepoSearchResult) {
    this.toPromiseSequence(() => Promise.resolve(searchResult));
  }

  componentDidUpdate(prevProps: SearchProps) {
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
      this.onlyLastPromise(this.requestRepos(newQuery));
    }
  }

  async requestRepos(searchQuery: string, startCursor?: string): Promise<RepoSearchResult> {
    log(`Searching: ${searchQuery}. Cursor: ${startCursor}`);
    const results = await repoSearch({ searchQuery, startCursor, count: LOAD_COUNT });
    log(`Found: ${results.total} ${searchQuery} ${JSON.stringify(results.repos.map(repo=>`${repo.owner}/${repo.name}`), null, "")} ${results.nextPageCursor}`);
    return results;
  }

  onReposReceived(results: RepoSearchResult) {
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

  enqueMoreResultsRequest() {
    this.toPromiseSequence((previousSearchResult: RepoSearchResult) => {
      return this.requestRepos(
        this.props.searchQuery,
        previousSearchResult.nextPageCursor
      )
    });
  }

  render() {
    switch(this.state.status) {
      case Status.REST:
        return null;
      case Status.LOADING:
        return <Spinner/>;
      case Status.LOADED:
        const { searchResults, loadedRepos, itemLoadedState, contributorCounts } = this.state;
        const { total } = searchResults;

        const resultListProps = {
          loadMoreItems: this.enqueMoreResultsRequest,
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