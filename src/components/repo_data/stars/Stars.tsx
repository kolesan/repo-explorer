import './stars.css';
import React from 'react';
import Spinner from '../../Spinner';

export default function Stars(props: any) {
  return (
    <div className="stars_count">
      <div className="star_count_image" />
      { 
        props.count !== undefined ? 
          Math.floor(props.count).toLocaleString('en-US') :
          <Spinner className="contributor_count__spinner"/>
      }
    </div>
  );
}