import './repo_view.css';
import React, { Component } from 'react';
import log from '../../utils/Logging';
import { getRepository, star, unstar } from '../../apis/v4/GitHubApiV4';
import { Repo, StarMutationResponse } from '../../types/RepoTypes';
import Spinner from '../Spinner';
import { commitStats, contributorCount } from '../../apis/v3/GitHubApiV3';
import IsStarred from '../repo_data/is_starred/IsStarred';
import Stars from '../repo_data/stars/Stars';
import Forks from '../repo_data/forks/Forks';
import Contributors from '../repo_data/contributors/Contributors';
import Issues from '../repo_data/issues/Issues';

interface RepoViewState {
  readonly repo?: Repo;
  readonly contributorCount?: number;
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

    this.onStarButtonClick = this.onStarButtonClick.bind(this);
  }
  
  async componentDidMount() {
    const { owner, name } = this.props.match.params;
    this.setState({ repo: await getRepository(owner, name) });
    contributorCount(owner, name)
      .then(contributorCount => this.setState({ contributorCount }));
    commitStats(owner, name)
      .then(commitStatistics => this.setState({ commitStatistics }))
  }

  async onStarButtonClick() {
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
    const { repo, contributorCount, commitStatistics } = this.state;
    return (
      <div className="repo_view">
        <Header owner={owner} name={name} repo={repo} onStarButtonClick={this.onStarButtonClick} />
        <Description repo={repo} contributorCount={contributorCount} />
        <HourGraph commitStatistics={commitStatistics} />
      </div>
    );
  }
}

function Header(props: any) {
  const { owner, name, repo, onStarButtonClick } = props;
  return (
    <div className="repo_view__header">
      {
        repo ? 
          <a className="repo_view__header__url" href={repo.url} target="_blank">{owner}/{name}</a> :
          <span>{owner}/{name}</span>
      }
      <button className="repo_view__header__star_button"
        disabled={!repo}
        onClick={onStarButtonClick}>
        {repo ? repo.starred ? "Unstar" : "Star" : "Star"}
      </button>
    </div>
  );
}

function Description(props: any) {
  const { repo, contributorCount } = props;

  if (!repo) {
    return <Spinner/>;
  }
  
  const { description, license, starred, language, starCount, forkCount, issueCount }: Repo = repo;
  return (
    <div className="repo_view__description">
      <div className="repo_view__description__top">
        <div className="repo_view__description__top__description">{description ? description : "No description provided"}</div>
        <IsStarred filled={starred} />
      </div>
      <div className="repo_view__description__bottom">
        <div>{license ? license.toUpperCase() : "Unknown"}</div>
        <div>{language}</div>
        <Stars count={starCount} />
        <Forks count={forkCount} />
        <Contributors count={contributorCount} />
        <Issues count={issueCount} />
      </div>
    </div>
  );
}

function HourGraph(props: any) {
  const { commitStatistics } = props;
  return (
    <div className="repo_view__hour_graph">
      { commitStatistics ? <div>{commitStatistics}</div> : <Spinner/> }
    </div>
  );
}

export default RepoView;
