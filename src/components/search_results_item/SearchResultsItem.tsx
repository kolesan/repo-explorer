import './search_results_item.css';

import React from "react";
import Spinner from "../Spinner";
import { Repo } from '../../types/RepoTypes';
import IsStarred from '../repo_data/is_starred/IsStarred';
import Stars from '../repo_data/stars/Stars';
import Forks from '../repo_data/forks/Forks';
import Contributors from '../repo_data/contributors/Contributors';
import Issues from '../repo_data/issues/Issues';
import BalsamiqPanel from '../balsamiq/panel/BalsamiqPanel';
import { Link } from 'react-router-dom';

interface SearchResultsItemProps { 
  readonly repo: Repo;
  readonly style: React.CSSProperties
  readonly contributorCount?: number;
}

export default function SearchResultsItem(props: SearchResultsItemProps) {
  const { repo, style, contributorCount } = props;
  
  if (!repo) {
    return (
      <div className="search_results_item" style={style}>
        <Spinner/>
      </div>
    );
  }

  const { name, owner, description, license, starred, language, starCount, forkCount, issueCount }: Repo = repo;
  return (
    <div className="search_results_item" style={style}>
      <Link to={`repos/${owner}/${name}`}>
        <BalsamiqPanel className="search_results_item_panel">
          <div className="search_results_item_panel__header">
            <span className="search_results_item_panel__header__name">{owner}/{name}</span>
            <div className="search_results_item_panel__header__description">{description ? description : "No description provided"}</div>
            <IsStarred filled={starred} />
          </div>
          <div className="search_results_item_panel__body">
            <div>{license ? license.toUpperCase() : "Unknown"}</div>
            <div>{language}</div>
            <Stars count={starCount} />
            <Forks count={forkCount} />
            <Contributors count={contributorCount} />
            <Issues count={issueCount} />
          </div>
        </BalsamiqPanel>
      </Link>
    </div>
  );
}
