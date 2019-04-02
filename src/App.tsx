import React, { Component } from 'react';
import './App.css';
import log from './utils/Logging';
import Search from './components/Search';

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
      <div>
        <input className="searchInput" placeholder="&#x1f50e; Search" value={searchQuery} onChange={this.queryChange}></input>
        <Search searchQuery={searchQuery}/>
      </div>
    );
  }
}

export default App;
