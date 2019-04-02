import React from "react";
import { Repo } from "../types/RepoListTypes";

interface SearchResultsItemProps { 
  readonly repo: Repo;
  readonly style: React.CSSProperties
}

export default function SearchResultsItem(props: SearchResultsItemProps) {
  const { repo, style } = props;
  const { name, owner, description, license, url, starred, language, starCount, forkCount, issueCount }: Repo = repo;

  return (
    <div style={style}>
      <div>{owner}/{name}</div>
      <div>{description}</div>
      <div>{license}</div>
      <div>{url}</div>
      <div>{starred}</div>
      <div>{language}</div>
      <div>{starCount}</div>
      <div>{forkCount}</div>
      <div>{issueCount}</div>
    </div>
  );
}
