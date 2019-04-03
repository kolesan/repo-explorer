import React from "react";
import { Repo } from "../types/RepoListTypes";
import log from "../utils/Logging";
import InfiniteLoader, { InfiniteLoaderProps, RendererCallback, LoadMoreItemsFunction } from "react-window-infinite-loader";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import SearchResultsItem from "./SearchResultsItem";

interface SearchProps {
  readonly loadMoreItems: LoadMoreItemsFunction;
  readonly total: number;
  readonly loadedRepos: Repo[];
  readonly itemLoadedState: boolean[];
  readonly contributorCounts: number[];
}

export default function SearchResults(props: SearchProps) {

  const { total, loadedRepos, itemLoadedState, loadMoreItems } = props;

  const loaderProps: InfiniteLoaderProps = {
    isItemLoaded: index => itemLoadedState[index],
    itemCount: total,
    loadMoreItems
  };

  const listProps = {
    itemData: loadedRepos,
    height: 750,
    itemCount: total,
    itemSize: 250,
    width: "100%"
  }
  
  return (
    <InfiniteLoader {...loaderProps}>
      {renderList}
    </InfiniteLoader>
  );
  
  function renderList({ onItemsRendered, ref }: RendererCallback) {
    return (
      <FixedSizeList {...listProps} onItemsRendered={onItemsRendered} ref={ref}>
        {renderListItem}
      </FixedSizeList>
    );
  }
  
  function renderListItem({ data, index, style }: ListChildComponentProps) {
    const repo = data[index];
    const contributorCount = props.contributorCounts[index];
    if (!repo) {
      return <div style={style}>LOADING</div>;
    }
    return <SearchResultsItem repo={repo} style={style} contributorCount={contributorCount}/>
  }

}
