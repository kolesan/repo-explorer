declare module 'react-window-infinite-loader' {

  import { Component, Ref, ReactNode } from "react";

  export interface InfiniteLoaderProps {
    readonly isItemLoaded: (index: number) => boolean;
    readonly itemCount: number;
    readonly loadMoreItems: (startIndex: number, stopIndex: number) => Promise<void>;
    readonly minimumBatchSize: number;
    readonly threshold?: number;
  }
  
  export interface RendererCallback {
    readonly onItemsRendered: Function;
    readonly ref: Ref;
  }
  
  export default class InfiniteLoader extends Component<InfiniteLoaderProps> {
    
  }

}