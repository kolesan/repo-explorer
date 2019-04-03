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
      <img className="search_bar__background" src="resources/images/oval-input.png"/>
      <span className="search_bar__icon">&#x1f50d;</span>
      <input className="search_bar__input" placeholder="Search" value={value} onChange={onChange}></input>
    </div>
  )
}
