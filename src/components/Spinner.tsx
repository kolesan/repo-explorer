import React, { Component } from 'react';
import log from '../utils/Logging';

interface SpinnerProps {}
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
    return <img ref={this.ref} style={styles} src="resources/spinner.png" />;
  }
  
}

export default Spinner;