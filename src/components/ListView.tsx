import React from 'react';
import log from '../utils/Logging';
import Search from './Search';
import SearchBar from './search_bar/SearchBar';

interface ListViewProps {
  readonly searchQuery: string;
  readonly searchQueryChanged: Function;
}

export default function ListView(props: ListViewProps) {
  const { searchQuery, searchQueryChanged } = props;

  return (
    <React.Fragment>
      <SearchBar value={searchQuery} onChange={queryChange} />
      <Search searchQuery={searchQuery}/>
    </React.Fragment>
  );

  function queryChange(event: any) {
    searchQueryChanged(event.target.value);
  }

}
