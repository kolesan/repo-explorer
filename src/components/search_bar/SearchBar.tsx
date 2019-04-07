import './search_bar.css';
import React, { ChangeEvent } from "react";

interface SearchBarProps { 
  readonly value: string;
  readonly onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBar(props: SearchBarProps) {
  const { value, onChange } = props;
  return (
    <div className="search_bar">
      <img className="search_bar__icon" src="resources/images/search.png"/>
      <input className="search_bar__input" placeholder="Search" value={value} onChange={onChange}></input>
    </div>
  )
}
