import React from "react";
import log from "../utils/Logging";
import InfiniteLoader, { InfiniteLoaderProps, RendererCallback, LoadMoreItemsFunction } from "react-window-infinite-loader";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import SearchResultsItem from "./search_results_item/SearchResultsItem";
import AutoSizer from "react-virtualized-auto-sizer";
import { RepoSearchResultItem } from "../types/RepoListTypes";

interface SearchProps {
  readonly loadMoreItems: LoadMoreItemsFunction;
  readonly total: number;
  readonly loadedRepos: RepoSearchResultItem[];
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
    itemCount: total,
    itemSize: 110
  }
  
  return (
    <div className="search_results__container">
      <InfiniteLoader {...loaderProps}>
        {renderList}
      </InfiniteLoader>
    </div>
  );
  
  function renderList({ onItemsRendered, ref }: RendererCallback) {
    return (
      <AutoSizer>
        {({ height, width }) => (
          <FixedSizeList {...listProps} height={height} width={width} onItemsRendered={onItemsRendered} ref={ref}>
            {renderListItem}
          </FixedSizeList>
        )}
      </AutoSizer>
    );
  }
  
  function renderListItem({ data, index, style }: ListChildComponentProps) {
    const repo = data[index];
    const contributorCount = props.contributorCounts[index];
    return <SearchResultsItem repo={repo} style={style} contributorCount={contributorCount}/>
  }

}
