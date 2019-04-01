import React, { Component } from 'react';
import './App.css';
import log from './utils/Logging';
import SearchResults from './components/SearchResults';

interface AppState {
  readonly searchQuery: string;
}
interface AppProps {}

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      searchQuery: 'react sort:stars'
    };
  }
  render() {
    return <SearchResults searchQuery={this.state.searchQuery}/>;
  }
}

export default App;
