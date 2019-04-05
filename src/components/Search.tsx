import React, { Component } from "react";
import { RepoSearchResult, RepoSearchResultItem, ContributorsWithIndex } from "../types/RepoListTypes";
import { repoSearch } from "../apis/v4/GitHubApiV4";
import { contributorCount } from "../apis/v3/GitHubApiV3";
import Spinner from "./Spinner";
import SearchResults from "./SearchResults";
import _debounce from 'lodash/debounce';
import log from "../utils/Logging";
import { onlyLast, sequential, every } from "../utils/PromiseUtils";
import { SearchStatus, SearchState } from "../state_model/SearchState";

interface SearchProps {
  readonly searchQuery: string;
  readonly searchState: SearchState;
  readonly searchStateChanged: Function;
}

const LOAD_COUNT = 10;
const MINIMUM_SYMBOLS_BEFORE_SEARCHING = 2;

class Search extends Component<SearchProps> {
  onlyLastPromise: Function;
  toPromiseSequence: Function;
  constructor(props: SearchProps) {
    super(props);

    this.onSearchQueryChanged = _debounce(this.onSearchQueryChanged, 400, { trailing: true });
    this.enqueMoreResultsRequest = this.enqueMoreResultsRequest.bind(this);
    this.displayContributorCount = this.displayContributorCount.bind(this);

    this.onlyLastPromise = onlyLast(this.putToSequence.bind(this));
    this.toPromiseSequence = sequential(this.onReposReceived.bind(this));
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
      this.props.searchStateChanged({
        loadedRepos: [],
        itemLoadedState: [],
        contributorCounts: [],
        status: SearchStatus.LOADING
      });
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
    let { searchState } = this.props;
    let previouslyLoadedRepos = searchState.loadedRepos;

    let contributCountRequests = this.requestContributorCounts(previouslyLoadedRepos.length, results.repos)
    every(...contributCountRequests)
      .then(this.displayContributorCount);

    let loadedRepos = [ ...previouslyLoadedRepos, ...results.repos ];
    let itemLoadedState = [ ...new Array(loadedRepos.length)].map(it => true);

    this.props.searchStateChanged({
      searchResults: results,
      loadedRepos,
      itemLoadedState,
      status: SearchStatus.LOADED
    })
  }

  requestContributorCounts(startingIndex: any, repos: RepoSearchResultItem[]): Promise<ContributorsWithIndex>[] {
    let requests: Promise<ContributorsWithIndex>[] = [];
    repos.forEach((repo, i) => {
      requests.push(new Promise(resolve => {
        contributorCount(repo.owner, repo.name)
          .then(contributorCount => {
            resolve({
              contributorCount,
              index: startingIndex + i
            })
          })
      }));
    })
    return requests;
  }

  displayContributorCount(countResult: ContributorsWithIndex) {
    let { contributorCount, index } = countResult;

    let contributorCounts = [...this.props.searchState.contributorCounts];
    contributorCounts[index] = contributorCount;
    
    this.props.searchStateChanged({contributorCounts});
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
    switch(this.props.searchState.status) {
      case SearchStatus.REST:
        return null;
      case SearchStatus.LOADING:
        return <Spinner/>;
      case SearchStatus.LOADED:
        const { searchResults, loadedRepos, itemLoadedState, contributorCounts } = this.props.searchState;
        const { total } = searchResults;

        const resultListProps = {
          loadMoreItems: this.enqueMoreResultsRequest,
          total,
          loadedRepos,
          itemLoadedState,
          contributorCounts
        }
        return <SearchResults {...resultListProps} />;
    }
  }

}

export default Search;