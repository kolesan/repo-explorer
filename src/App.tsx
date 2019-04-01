import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { repoSearch } from './apis/v4/GitHubApiV4';
import { RepoSearchResult } from './types/RepoListTypes';
import { FixedSizeList, ListChildComponentProps } from 'react-window';

interface AppState {
  readonly searchResults: RepoSearchResult;
}
interface AppProps {}

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      searchResults: {
        total: 0,
        repos: []
      }
    };
  }

  async componentDidMount() {
    // const results = await repoSearch({ searchQuery: 'react-ts-table', count: 10 });
    const results = await repoSearch({ searchQuery: 'react sort:stars', count: 10 });
    this.setState({
      searchResults: results
    });
  }

  render() {
    return (
      <FixedSizeList
        itemData={this.state.searchResults.repos}
        height={750}
        itemCount={this.state.searchResults.repos.length}
        itemSize={150}
        width={650}
      >
        {rowRenderer}
      </FixedSizeList>
    );
  }
}

function rowRenderer({ data, index, style }: ListChildComponentProps) {
  const rowItem = data[index];
  const { name, owner } = rowItem;
  return <div style={style}>{owner}/{name}</div>
}

export default App;
