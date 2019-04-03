import './search_results_item.css';

import React from "react";
import { Repo } from "../../types/RepoListTypes";
import Spinner from "../Spinner";

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
          <a href={url} target="_blank">{owner}/{name}</a>
          <div>{description ? description : "No description provided"}</div>
          <Star filled={starred} />
        </div>
        <div className="search_results_item_panel__body">
          <div>{license ? license.toUpperCase() : "Unknown license"}</div>
          <div>{language}</div>
          <Stars count={starCount} />
          <Forks count={forkCount} />
          <div>{issueCount}</div>
          { contributorCount !== undefined ?
            <Contributors count={contributorCount} /> :
            <Spinner style={{width: "1rem"}}/> }
        </div>
      </div>
    </div>
  );
}

function Contributors(props: any) {
  return (
    <div className="contirbutor_count">
      <img className="contirbutor_count_image" src="resources/images/contributors.png" />
      {props.count}
    </div>
  );
}

function Forks(props: any) {
  return (
    <div className="fork_count">
      <img className="fork_count_image" src="resources/images/forks.png" />
      {props.count}
    </div>
  );
}

function Stars(props: any) {
  return (
    <div className="stars_count">
      <img className="star_count_image" src="resources/images/star-filled.png" />
      {props.count}
    </div>
  );
}

function Star(props: any) {
  if (props.filled) {
    return <img className="stared_status_image" src="resources/images/star-filled.png" />
  }
  return <img className="stared_status_image" src="resources/images/star.png" />
}
