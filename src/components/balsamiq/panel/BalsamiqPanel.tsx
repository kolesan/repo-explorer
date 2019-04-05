import './balsamiq_panel.css';
import React from 'react';

interface BalsamiqPanelProps {
  readonly className?: string;
  readonly children?: any;
}

export default function BalsamiqPanel(props: BalsamiqPanelProps) {
  const { className } = props;
  return (
    <div className={"balsamiq_panel " + (className ? className : "")}>
      {props.children}
    </div>
  );
}