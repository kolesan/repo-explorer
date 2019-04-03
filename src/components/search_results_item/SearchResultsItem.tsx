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
          <div>{starCount}</div>
          <div>{forkCount}</div>
          <div>{issueCount}</div>
          { contributorCount !== undefined ?
            <div>{contributorCount}</div> :
            <Spinner style={{width: "1rem"}}/> }
        </div>
      </div>
    </div>
  );
}

interface StartProps {
  readonly filled: boolean;
}
function Star(props: StartProps) {
  if (props.filled) {
    return <img className="star_image" src="resources/images/star-filled.png" />
  }
  return <img className="star_image" src="resources/images/star.png" />
}
