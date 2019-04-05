import React from 'react';

export default function Stars(props: any) {
  return (
    <div className="stars_count">
      <img className="star_count_image" src="/resources/images/star-filled.png" />
      {props.count}
    </div>
  );
}