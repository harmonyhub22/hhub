import React from 'react';

interface BoxDragPreviewProps {
  boxWidth: number,
}

interface BoxDragPreviewState {
  tickTock: boolean,
  interval: any,
}

class BoxDragPreview extends React.Component<BoxDragPreviewProps, BoxDragPreviewState> {

  constructor(props:BoxDragPreviewProps) {
    super(props);
    this.state = {
      tickTock: false,
      interval: null,
    }
  }

  componentDidMount() {
    if (this.state.interval === null) {
      const interval = setInterval(() => {
        this.setState({
          tickTock: !this.state.tickTock,
        });
      }, 500)
    }
  };

  componentWillUnmount() {
    clearInterval(this.state.interval);
  };

  render() {
    return (
      <div style={{display: 'inline-block'}}>
        {/*<Box
          yellow={this.state.tickTock}
          boxWidth={this.props.boxWidth}
          preview
    />*/}
      </div>
    );
  }
};

export default BoxDragPreview;