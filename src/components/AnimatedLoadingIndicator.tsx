import React, { Component } from 'react';
import log from '../utils/Logging';

interface AnimatedLoadingIndicatorProps {
  readonly duration: number;
}
interface AnimatedLoadingIndicatorState {}

const constantStyles = {
  background: "linear-gradient(to right, #CCCCCC, #CCCCCC) white",
  backgroundRepeat: "no-repeat",
  backgroundSize: "0"
}

class AnimatedLoadingIndicator extends Component<AnimatedLoadingIndicatorProps, AnimatedLoadingIndicatorState> {

  ref: any;

  constructor(props: AnimatedLoadingIndicatorProps) {
    super(props);

    this.ref = React.createRef();
  }

  onAnimationFinish() {
    let bar = this.ref.current;
    if (bar) {
      bar.style.backgroundSize = "100%";
    }
  }

  componentDidMount() {
    let animation = this.ref.current.animate(
      [
        { backgroundSize: "0" },
        { backgroundSize: "13%", offset: 0.3 },
        { backgroundSize: "34%" },
        { backgroundSize: "51%" },
        { backgroundSize: "75%" },
        { backgroundSize: "100%" }
      ],
      {
        delay: 150,
        easing: "ease-in",
        duration: this.props.duration
      }
    );
    animation.onfinish = this.onAnimationFinish.bind(this);
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