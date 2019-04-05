import './issues.css';
import React from 'react';

export default function Issues(props: any) {
  return (
    <div className="issue_count">
      <img className="issue_count_image" src="/resources/images/issues.png" />
      {props.count}
    </div>
  );
}