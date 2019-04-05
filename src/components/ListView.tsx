import React, { Component } from 'react';
import log from '../utils/Logging';
import Search from './Search';
import SearchBar from './search_bar/SearchBar';

interface ListViewState {
  readonly searchQuery: string;
}
interface ListViewProps {}

class ListView extends Component<ListViewProps, ListViewState> {
  constructor(props: ListViewProps) {
    super(props);
    this.state = {
      searchQuery: ''
    };
    this.queryChange = this.queryChange.bind(this);
  }

  queryChange(event: any) {
    this.setState({
      searchQuery: event.target.value
    });
  }

  render() {
    const { searchQuery } = this.state;
    return (
      <React.Fragment>
        <SearchBar value={searchQuery} onChange={this.queryChange} />
        <Search searchQuery={searchQuery}/>
      </React.Fragment>
    );
  }
}

export default ListView;
