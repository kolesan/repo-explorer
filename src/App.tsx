import React, { Component } from 'react';
import './App.css';
import log from './utils/Logging';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ListViewContainer from './containers/ListViewContainer';
import RepoViewContainer from './containers/RepoViewContainer';

interface AppState {}
interface AppProps {}

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={ListViewContainer} />
          <Route path="/repos/:owner/:name" component={RepoViewContainer} />
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
