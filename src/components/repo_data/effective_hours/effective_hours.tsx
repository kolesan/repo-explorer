import './effective_hours.css';
import React from 'react';

export default function EffectiveHours(props: any) {
  return (
    <div className="effecite_hour_count">
      <img className="effecite_hour_count_image" src="/resources/images/clock.png" />
      {props.count}
    </div>
  );
}