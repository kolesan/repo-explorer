import React, { Component } from "react";
import { RepoSearchResult, Repo } from "../types/RepoListTypes";
import log from "../utils/Logging";
import { repoSearch } from "../apis/v4/GitHubApiV4";
import InfiniteLoader, { InfiniteLoaderProps, RendererCallback } from "react-window-infinite-loader";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import AnimatedLoadingIndicator from "./AnimatedLoadingIndicator";
import _debounce from 'lodash/debounce'

interface SearchResultsProps {
  readonly searchQuery: string;
}
interface SearchResultsState {
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

class SearchResults extends Component<SearchResultsProps, SearchResultsState> {
  constructor(props: SearchResultsProps) {
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

  async componentDidUpdate(prevProps: SearchResultsProps) {
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
        return <AnimatedLoadingIndicator duration={2000}/>;
      case State.LOADED:
        const { total, nextPageCursor } = this.state.searchResults;
        const { loadedRepos, itemLoadedState } = this.state;
        const { searchQuery } = this.props;
    
        const loaderProps: InfiniteLoaderProps = {
          isItemLoaded: index => itemLoadedState[index],
          itemCount: total,
          minimumBatchSize: LOAD_COUNT,
          loadMoreItems: (start, stop) => this.search(searchQuery, nextPageCursor)
        };
        
        return (
          <InfiniteLoader {...loaderProps}>
            {({ onItemsRendered, ref }: RendererCallback) => renderList(onItemsRendered, ref, loadedRepos, total)}
          </InfiniteLoader>
        );
    }
  }

}

function renderList(onItemsRendered: any, ref: any, repos: Repo[], total: number) {
  const props = {
    itemData: repos,
    height: 750,
    itemCount: total,
    itemSize: 150,
    width: "75%",
    onItemsRendered,
    ref: ref
  }
  return (
    <FixedSizeList {...props}>
      {renderRepo}
    </FixedSizeList>
  )
}

function renderRepo({ data, index, style }: ListChildComponentProps) {
  const repo = data[index];
  if (!repo) {
    return <div style={style}>LOADING</div>;
  }

  const { name, owner, description, commitCount, forkCount, issueCount }: Repo = repo;
  return (
    <div style={style}>
      <div>{owner}/{name}</div>
      <div>{description}</div>
      <div>{commitCount}</div>
      <div>{forkCount}</div>
      <div>{issueCount}</div>
    </div>
  );
}

export default SearchResults;