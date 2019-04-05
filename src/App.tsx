import React, { Component } from 'react';
import './App.css';
import log from './utils/Logging';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ListView from './components/ListView';
import RepoView from './components/repo_view/RepoView';

interface AppState {
  // readonly searchQuery: string;
}
interface AppProps {}

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/repos" component={ListView} />
          <Route path="/repos/:owner/:name" component={RepoView} />
          <Route component={NoMatch} />
        </Switch>
      </Router>
    );
  }
}

function NoMatch({ location }: any) {
  return (
    <div>
      <h3 style={{textAlign: "center"}}>
        No {location.pathname} page found <br/> sorry ¯\_(ツ)_/¯
      </h3>
    </div>
  );
}

export default App;
