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
    width: "75%",
  }
  
  return (
    <InfiniteLoader {...loaderProps}>
      {
        ({ onItemsRendered, ref }: RendererCallback) => (
          <FixedSizeList {...listProps} onItemsRendered={onItemsRendered} ref={ref}>
            {renderRepoListItem}
          </FixedSizeList>
        )
      }
    </InfiniteLoader>
  );
  
  function renderRepoListItem({ data, index, style }: ListChildComponentProps) {
    const repo = data[index];
    if (!repo) {
      return <div style={style}>LOADING</div>;
    }
    return <SearchResultsItem repo={repo} style={style} />
  }

}
