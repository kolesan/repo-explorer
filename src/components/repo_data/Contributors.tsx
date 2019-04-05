import React from 'react';
import Spinner from '../Spinner';

export default function Contributors(props: any) {
  return (
    <div className="contirbutor_count">
      <img className="contirbutor_count_image" src="/resources/images/contributors.png" />
      { 
        props.count !== undefined ? 
          props.count :
          <Spinner className="contirbutor_count__spinner"/>
      }
    </div>
  );
}