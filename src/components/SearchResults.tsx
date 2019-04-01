import React, { Component } from "react";
import { RepoSearchResult, Repo } from "../types/RepoListTypes";
import log from "../utils/Logging";
import { repoSearch } from "../apis/v4/GitHubApiV4";
import InfiniteLoader, { InfiniteLoaderProps, RendererCallback } from "react-window-infinite-loader";
import { FixedSizeList, ListChildComponentProps } from "react-window";

interface SearchResultsProps {
  readonly searchQuery: string;
}
interface SearchResultsState {
  readonly searchResults: RepoSearchResult;
  loadedRepos: Repo[];
  itemLoadedState: boolean[];
}
const LOAD_COUNT = 10;

class SearchResults extends Component<SearchResultsProps, SearchResultsState> {
  constructor(props: SearchResultsProps) {
    super(props);
    this.state = {
      searchResults: {
        total: 0,
        repos: []
      },
      loadedRepos: [],
      itemLoadedState: [],
    };
  }

  async componentDidUpdate(prevProps: SearchResultsProps) {
    if (prevProps.searchQuery != this.props.searchQuery) {
      this.setState({
        loadedRepos: [],
        itemLoadedState: [],
      })
      this.search(this.props.searchQuery);
    }
  }
  
  async componentDidMount() {
    this.search(this.props.searchQuery);
  }

  async search(searchQuery: string, startCursor?: string) {
    log(`Searching: ${searchQuery}. Cursor: ${startCursor}`);
    const results = await repoSearch({ searchQuery, startCursor, count: LOAD_COUNT });
    log(`Found: ${results.total} ${JSON.stringify(results.repos.map(repo=>`${repo.owner}/${repo.name}`), null, "")} ${results.nextPageCursor}`);

    let loadedRepos = [ ...this.state.loadedRepos, ...results.repos];

    let itemLoadedState = [ ...new Array(results.total)].map(it => false);
    for(let i = 0; i < loadedRepos.length; i++) {
      itemLoadedState[i] = true;
    }

    this.setState({
      searchResults: results,
      itemLoadedState,
      loadedRepos
    });
  }

  render() {
    const { total, nextPageCursor } = this.state.searchResults;
    const { loadedRepos } = this.state;

    const loaderProps: InfiniteLoaderProps = {
      isItemLoaded: index => this.state.itemLoadedState[index],
      itemCount: total,
      minimumBatchSize: LOAD_COUNT,
      loadMoreItems: (start, stop) => this.search(this.props.searchQuery, nextPageCursor)
    };
    
    return (
      <InfiniteLoader {...loaderProps}>
        {({ onItemsRendered, ref }: RendererCallback) => renderList(onItemsRendered, ref, loadedRepos, total)}
      </InfiniteLoader>
    );
  }
}

function renderList(onItemsRendered: any, ref: any, repos: Repo[], total: number) {
  const props = {
    itemData: repos,
    height: 750,
    itemCount: total,
    itemSize: 150,
    width: 650,
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