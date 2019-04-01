import React, { Component } from 'react';

interface AnimatedLoadingIndicatorProps {
  readonly duration: number;
}
interface AnimatedLoadingIndicatorState {}

const constantStyles = {
  background: "linear-gradient(to right, #CCCCCC, #CCCCCC) white",
  backgroundRepeat: "no-repeat"
}

class AnimatedLoadingIndicator extends Component<AnimatedLoadingIndicatorProps, AnimatedLoadingIndicatorState> {

  ref: any;

  constructor(props: AnimatedLoadingIndicatorProps) {
    super(props);

    this.ref = React.createRef();
  }

  componentDidMount() {
    this.ref.current.animate(
      [
        { backgroundSize: "0" },
        { backgroundSize: "100%" }
      ],
      { duration: this.props.duration }
    );
  }

  render() { 
    return (
      <div>
        <img ref={this.ref} style={constantStyles} src="resources/LoadingIndicator.png" />
      </div>
    );
  }
  
}

export default AnimatedLoadingIndicator;