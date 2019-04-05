import './effective_hours.css';
import React from 'react';
import Spinner from '../../Spinner';

export default function EffectiveHours(props: any) {
  return (
    <div className="effecite_hour_count">
      <img className="effecite_hour_count_image" src="/resources/images/clock.png" />
      { 
        props.count !== undefined ? 
          Math.floor(props.count).toLocaleString('en-US') :
          <Spinner className="contributor_count__spinner"/>
      }
    </div>
  );
}