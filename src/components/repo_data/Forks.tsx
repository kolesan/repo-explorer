import React from 'react';

export default function Forks(props: any) {
  return (
    <div className="fork_count">
      <img className="fork_count_image" src="/resources/images/forks.png" />
      {props.count}
    </div>
  );
}