import './is_starred.css';
import React from 'react';

export default function IsStarred(props: any) {
  if (props.filled) {
    return <div className="stared_status_image filled" />
  }
  return <div className="stared_status_image outline" />
}