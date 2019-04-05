import './search_results_item.css';

import React from "react";
import Spinner from "../Spinner";
import { Repo } from '../../types/RepoTypes';
import IsStarred from '../repo_data/is_starred/IsStarred';
import Stars from '../repo_data/stars/Stars';
import Forks from '../repo_data/forks/Forks';
import Contributors from '../repo_data/contributors/Contributors';
import Issues from '../repo_data/issues/Issues';

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

  const { name, owner, description, license, url, starred, language, starCount, forkCount, issueCount }: Repo = repo;
  return (
    <div className="search_results_item" style={style}>
      <div className="search_results_item_panel">
        <img className="search_results_item_panel__background" src="resources/images/rectangle.svg"/>
        <div className="search_results_item_panel__header">
          <a className="search_results_item_panel__header__url" href={url} target="_blank">{owner}/{name}</a>
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
      </div>
    </div>
  );
}
