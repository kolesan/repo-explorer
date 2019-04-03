import React, { Component } from 'react';
import './App.css';
import log from './utils/Logging';
import Search from './components/Search';
import SearchBar from './components/search_bar/SearchBar';

interface AppState {
  readonly searchQuery: string;
}
interface AppProps {}

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
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

export default App;
