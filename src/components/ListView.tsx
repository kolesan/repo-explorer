import React from 'react';
import log from '../utils/Logging';
import SearchBar from './search_bar/SearchBar';
import SearchContainer from '../containers/SearchContainer';

interface ListViewProps {
  readonly searchQuery: string;
  readonly searchQueryChanged: Function;
}

export default function ListView(props: ListViewProps) {
  const { searchQuery, searchQueryChanged } = props;

  return (
    <React.Fragment>
      <SearchBar value={searchQuery} onChange={queryChange} />
      <SearchContainer />
    </React.Fragment>
  );

  function queryChange(event: any) {
    searchQueryChanged(event.target.value);
  }

}
