import './contributors.css';
import React from 'react';
import Spinner from '../../Spinner';

export default function Contributors(props: any) {
  return (
    <div className="contributor_count">
      <div className="contributor_count_image" />
      { 
        props.count !== undefined ? 
          props.count.toLocaleString('en-US') :
          <Spinner className="contributor_count__spinner"/>
      }
    </div>
  );
}