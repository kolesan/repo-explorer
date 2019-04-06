import './forks.css';
import React from 'react';

export default function Forks(props: any) {
  return (
    <div className="fork_count">
      <div className="fork_count_image" />
      {props.count.toLocaleString('en-US')}
    </div>
  );
}