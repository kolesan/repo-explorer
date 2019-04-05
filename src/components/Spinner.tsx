import React, { Component } from 'react';
import log from '../utils/Logging';

interface SpinnerProps {
  readonly style?: React.CSSProperties;
  readonly className?: string;
}
interface SpinnerState {}

const styles = {
  display: "block"
}

class Spinner extends Component<SpinnerProps, SpinnerState> {

  ref: any;

  constructor(props: SpinnerProps) {
    super(props);

    this.ref = React.createRef();
  }

  componentDidMount() {
    this.ref.current.animate(
      { 
        transform: ["rotateZ(0deg)", "rotateZ(360deg)" ]
      },
      {
        duration: 2000,
        iterations: Infinity
      }
    );
  }

  render() { 
    return <img className={this.props.className} ref={this.ref} style={{...styles, ...this.props.style}} src="/resources/images/spinner.png" />;
  }
  
}

export default Spinner;