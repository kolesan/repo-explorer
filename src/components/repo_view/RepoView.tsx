import './repo_view.css';
import React, { Component } from 'react';
import log from '../../utils/Logging';
import { getRepository, star, unstar, getRepositoryStars } from '../../apis/v4/GitHubApiV4';
import { Repo, StarMutationResponse } from '../../types/RepoTypes';
import Spinner from '../Spinner';
import { commitStats, contributorCount } from '../../apis/v3/GitHubApiV3';
import IsStarred from '../repo_data/is_starred/IsStarred';
import Stars from '../repo_data/stars/Stars';
import Forks from '../repo_data/forks/Forks';
import Contributors from '../repo_data/contributors/Contributors';
import Issues from '../repo_data/issues/Issues';
import { CartesianGrid, XAxis, YAxis, ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';
import _get from 'lodash/get';
import EffectiveHours from '../repo_data/effective_hours/EffectiveHours';
import BalsamiqPanel from '../balsamiq/panel/BalsamiqPanel';
import BalsamiqButton from '../balsamiq/button/BalsamiqButton';

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
  readonly repoStarStateChanged: Function;
}

class RepoView extends Component<RepoViewProps, RepoViewState> {

  constructor(props: RepoViewProps) {
    super(props);
    this.state = {};

    this.onStarButtonClick = this.onStarButtonClick.bind(this);
  }
  
  async componentDidMount() {
    const { owner, name } = this.props.match.params;
    this.setState({
      repo: await getRepository(owner, name),
      contributorCount: await contributorCount(owner, name),
      commitStatistics: await commitStats(owner, name)
    });
  }

  async onStarButtonClick() {
    const { repo } = this.state;
    if (repo) {
      const { owner, name } = repo;
      
      const starred = await (repo.starred ? unstar(repo.id) : star(repo.id));
      let updatedRepo: Repo = { ...repo, starred, starCount: undefined };
      this.setState({
        repo: updatedRepo
      });

      const stars = await getRepositoryStars(owner, name);
      updatedRepo = { ...updatedRepo, starCount: stars };
      this.setState({
        repo: updatedRepo
      });

      this.props.repoStarStateChanged({
        owner,
        name,
        starred: updatedRepo.starred,
        starCount: updatedRepo.starCount
      })
    }
  }

  render() {
    const { owner, name } = this.props.match.params;
    const { repo, contributorCount, commitStatistics } = this.state;
    const issueCount = _get(repo, 'issueCount', null);
    return (
      <div className="repo_view">
        <Header owner={owner} name={name} repo={repo} onStarButtonClick={this.onStarButtonClick} />
        <Description repo={repo} contributorCount={contributorCount} />
        <HourGraph commitStatistics={commitStatistics} contributorCount={contributorCount} issueCount={issueCount}/>
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
          <a className="repo_view__header__url text-url" href={repo.url} target="_blank">{owner}/{name}</a> :
          <span>{owner}/{name}</span>
      }
      <BalsamiqButton className="repo_view__header__star_button"
        disabled={!repo}
        onClick={onStarButtonClick}>
        {repo ? repo.starred ? "Unstar" : "Star" : ""}
      </BalsamiqButton>
    </div>
  );
}

function Description(props: any) {
  const { repo, contributorCount } = props;

  if (!repo) {
    return (
      <BalsamiqPanel className="repo_view__description">
        <Spinner style={{margin: "auto"}}/>
      </BalsamiqPanel>
    );
  }
  
  const { description, license, starred, language, starCount, forkCount, issueCount, commitCount }: Repo = repo;
  const effectiveHours = contributorCount ? calculateEffectiveHours(commitCount, contributorCount, issueCount) : undefined;
  return (
    <BalsamiqPanel className="repo_view__description">
      <div className="repo_view__description__top">
        <div className="repo_view__description__top__description">{description ? description : "No description provided"}</div>
        <IsStarred filled={starred} />
      </div>
      <div className="repo_view__description__bottom">
        <div>{license ? license.toUpperCase() : "Unknown"}</div>
        <div>{language}</div>
        <EffectiveHours count={effectiveHours} />
        <Stars count={starCount} />
        <Forks count={forkCount} />
        <Contributors count={contributorCount} />
        <Issues count={issueCount} />
      </div>
    </BalsamiqPanel>
  );
}

function HourGraph(props: any) {
  const { commitStatistics, contributorCount, issueCount } = props;
  const canCalculateGraph = commitStatistics && contributorCount !== undefined && issueCount != undefined;
  return (
    <BalsamiqPanel className="repo_view__hours">
      <div>Effective hours spent per year</div>
      <div className="repo_view__hours_graph">
        { canCalculateGraph ? 
          <ResponsiveContainer width="95%" height={250}>
            <AreaChart data={commitStatisticToLineChartFormat(commitStatistics, contributorCount, issueCount)}>
              <CartesianGrid stroke="#ccc" />
              <Area type="monotone" dataKey="commits" stroke="red" />
              <Area type="monotone" dataKey="hours" stroke="gray" fill="lightgray" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
            </AreaChart>
          </ResponsiveContainer>
          : <Spinner style={{margin: "auto"}} /> }
      </div>
    </BalsamiqPanel>
  );
}

function commitStatisticToLineChartFormat(commitStatistics: number[], contributorCount: number, issueCount: number): object[] {
  let lineChartData = commitStatistics.map(commitCount =>
    ({ 
      week: "", 
      commits: commitCount,
      hours: calculateEffectiveHours(commitCount, contributorCount, issueCount).toFixed(2)
    })
  );
  lineChartData.forEach((obj, i) => obj.week = String(i + 1));
  return lineChartData;
}

function calculateEffectiveHours(commits: number, contributors: number, issues: number): number {
  return commits * contributors / (issues ? issues : 1);
}

export default RepoView;
