declare module 'react-window-infinite-loader' {

  import { Component, Ref, ReactNode } from "react";

  export interface InfiniteLoaderProps {
    readonly isItemLoaded: (index: number) => boolean;
    readonly itemCount: number;
    readonly loadMoreItems: LoadMoreItemsFunction;
    readonly minimumBatchSize?: number;
    readonly threshold?: number;
  }

  export type LoadMoreItemsFunction = (startIndex: number, stopIndex: number) => Promise<void>;
  export type OnItemsRenderedFunction = (props: ListOnItemsRenderedProps) => any;

  export interface RendererCallback {
    readonly onItemsRendered: OnItemsRenderedFunction;
    readonly ref: Ref;
  }
  
  export default class InfiniteLoader extends Component<InfiniteLoaderProps> {
    
  }

}