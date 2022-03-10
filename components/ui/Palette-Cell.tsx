import React from "react";
import * as Tone from "tone";
import { Target } from '@geist-ui/icons';

interface PaletteCellProps {
  instrumentName: string,
  updateLayerStagingSound: any,
  isSelected: boolean,
};

interface PaletteCellState {
  isPlaying: boolean,
  isSelected: boolean,
  tonePlayer: any,
};

class PaletteCell extends React.Component<PaletteCellProps, PaletteCellState> {

  static selectedBorder: string = "solid #FFBF00 3px";

  constructor(props:PaletteCellProps) {
    super(props);
    this.state = {
      isPlaying: false,
      isSelected: this.props.isSelected,
      tonePlayer: new Tone.Player("../../" + this.props.instrumentName + ".mp3").toDestination(),
    };
    this.onSoundClick = this.onSoundClick.bind(this);
    this.state.tonePlayer.onstart = () => {
      this.setState({
        isPlaying: true,
      });
    };
    this.state.tonePlayer.onstop = () => {
      this.setState({
        isPlaying: false,
      });
    };
  };

  onSoundClick = () => {
    this.state.tonePlayer.start(0);
    /*
    console.log(this.state.isSelected);
    if (!this.state.isSelected) { // select the player
      this.setState({
        isSelected: true,
      });
    } else { // unselect the player
      this.setState({
        isPlaying: false,
      });
    }
    */
  };

  render() {
    return <td key={this.props.instrumentName}>
      <div className="table-palette-buttonframe" style={{border: this.state.isSelected ? PaletteCell.selectedBorder : ""}}>
        <button
          className="button-palette"
          role="button"
          onClick={() => {
            this.onSoundClick();
            // send the sound path to the staging layer
            this.props.updateLayerStagingSound(this.state.isSelected ? this.props.instrumentName : null);
          }}
        >
          {this.props.instrumentName}
          {this.state.isPlaying && <Target/>}
        </button>
      </div>
    </td>
  };
};

export default PaletteCell;