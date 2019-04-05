import './balsamiq_panel.css';
import React from 'react';

export default function BalsamiqPanel(props: any) {
  const { className, ...otherProps } = props;
  return (
    <div className={"balsamiq_panel " + (className ? className : "")} {...otherProps}>
      {props.children}
    </div>
  );
}