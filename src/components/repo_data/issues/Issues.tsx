import './issues.css';
import React from 'react';

export default function Issues(props: any) {
  return (
    <div className="issue_count">
      <div className="issue_count_image" />
      {props.count.toLocaleString('en-US')}
    </div>
  );
}