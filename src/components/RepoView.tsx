import React, { Component } from 'react';
import log from '../utils/Logging';
import { getRepository, star, unstar } from '../apis/v4/GitHubApiV4';
import { Repo, StarMutationResponse } from '../types/RepoTypes';
import Spinner from './Spinner';
import { commitStats } from '../apis/v3/GitHubApiV3';

interface RepoViewState {
  readonly repo?: Repo;
  readonly commitStatistics?: number[];
}
interface RepoViewProps {
  readonly match: {
    readonly params: {
      readonly owner: string;
      readonly name: string;
    }
  }
}

class RepoView extends Component<RepoViewProps, RepoViewState> {

  constructor(props: RepoViewProps) {
    super(props);
    this.state = {};

    this.handleStarButtonClick = this.handleStarButtonClick.bind(this);
  }
  
  async componentDidMount() {
    const { owner, name } = this.props.match.params;
    this.setState({ repo: await getRepository(owner, name) });
    this.setState({ commitStatistics: await commitStats(owner, name) });
  }

  getCommitStats(owner: string, repo: string): Promise<number[]> {
    return commitStats(owner, repo);
  }

  async handleStarButtonClick() {
    const { repo } = this.state;
    if (repo) {
      const response: StarMutationResponse = await (repo.starred ? unstar(repo.id) : star(repo.id));
      this.setState({
        repo: { ...repo, starred: response.starred }
      })
    }
  }

  render() {
    const { owner, name } = this.props.match.params;
    const { repo, commitStatistics } = this.state;
    return (
      <div>
        <div className="header">
          {
            repo ? 
              <a className="header__url" href={repo.url} target="_blank">{owner}/{name}</a> :
              <span>{owner}/{name}</span>
          }
          <button className="header__star_button"
            disabled={!repo}
            onClick={this.handleStarButtonClick}>
            {repo ? repo.starred ? "Unstar" : "Star" : "Star"}
          </button>
        </div>
        <div className="description">
          { repo ? <div>{repo.description}</div> : <Spinner/> }
        </div>
        <div className="hour_graph">
          { commitStatistics ? <div>{commitStatistics}</div> : <Spinner/> }
        </div>
      </div>
    );
  }
}

export default RepoView;
