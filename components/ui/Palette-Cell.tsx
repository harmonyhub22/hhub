import React from "react";
import * as Tone from "tone";
import { Volume2 } from '@geist-ui/icons';

interface PaletteCellProps {
  instrumentName: string,
  updateLayerStagingSound: any,
  isSelected: boolean,
  duration: number,
};

interface PaletteCellState {
  isSelected: boolean,
  tonePlayer: any,
  isPlaying: boolean,
};

class PaletteCell extends React.Component<PaletteCellProps, PaletteCellState> {

  static selectedBorder: string = "solid #FFBF00 3px";

  constructor(props:PaletteCellProps) {
    super(props);
    this.state = {
      isSelected: this.props.isSelected,
      tonePlayer: new Tone.Player("../../" + this.props.instrumentName + ".mp3").toDestination(),
      isPlaying: false,
    };
    this.onSoundClick = this.onSoundClick.bind(this);
    this.state.tonePlayer.onstop = () => {
      this.setState({
        isPlaying: false,
      });
    };
  };

  onSoundClick = () => {
    if (this.state.tonePlayer.state === "started") {
      this.state.tonePlayer.stop();
      if (this.state.isSelected)
        this.props.updateLayerStagingSound(this.props.instrumentName); // unselect
      return;
    }
    if (this.state.isSelected) {
      this.props.updateLayerStagingSound(this.props.instrumentName); // unselect
      return;
    }
    
    if (!this.state.isPlaying) {
      this.state.tonePlayer.start(0);
      this.setState({
        isPlaying: true,
      });
      this.props.updateLayerStagingSound(this.props.instrumentName); // send the sound path to the staging layer
    }
  };

  componentDidUpdate(prevProps:PaletteCellProps) {
    if (prevProps.isSelected !== this.props.isSelected) {
      this.setState({
        isSelected: this.props.isSelected,
      });
    };
  };

  render() {
    return (
      <>
        <button
          className="button-palette"
          role="button"
          style={{border: this.state.isSelected ? PaletteCell.selectedBorder : ""}}
          onClick={() => {
            this.onSoundClick();
          }}
        >
          {this.props.instrumentName}
          <br></br>
          {this.state.isPlaying && <Volume2/>}
        </button>
      </>
    )
  };
};

export default PaletteCell;