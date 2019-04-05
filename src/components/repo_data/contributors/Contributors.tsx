import './contributors.css';
import React from 'react';
import Spinner from '../../Spinner';

export default function Contributors(props: any) {
  return (
    <div className="contributor_count">
      <img className="contributor_count_image" src="/resources/images/contributors.png" />
      { 
        props.count !== undefined ? 
          props.count :
          <Spinner className="contributor_count__spinner"/>
      }
    </div>
  );
}