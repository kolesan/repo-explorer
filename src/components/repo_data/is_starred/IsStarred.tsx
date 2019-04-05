import './is_starred.css';
import React from 'react';

export default function IsStarred(props: any) {
  if (props.filled) {
    return <img className="stared_status_image" src="/resources/images/star-filled.png" />
  }
  return <img className="stared_status_image" src="/resources/images/star.png" />
}