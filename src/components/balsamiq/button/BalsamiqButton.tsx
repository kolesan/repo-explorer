import './balsamiq_button.css';
import React from 'react';

export default function BalsamiqButton(props: any) {
  const { className, ...otherProps } = props;
  return (
    <button className={"balsamiq_button " + (className ? className : "")} {...otherProps}>
      {props.children}
    </button>
  );
}