import React from "react";
import * as Tone from "tone";

interface PaletteCellProps {
  instrumentName: string,
  updateLayerStagingSound: any,
};

interface PaletteCellState {
  border: string,
  isSelected: boolean,
  tonePlayer: any,
};

class PaletteCell extends React.Component<PaletteCellProps, PaletteCellState> {

  static selectedBorder: string = "solid #FFBF00 3px";

  constructor(props:any) {
    super(props);
    this.state = {
      border: "",
      isSelected: false,
      tonePlayer: new Tone.Player("../../" + this.props.instrumentName + ".mp3").toDestination(),
    };
    this.onSoundClick = this.onSoundClick.bind(this);
  };

  onSoundClick = () => {
    if (!this.state.isSelected) { // start the player
      this.setState({
        border: PaletteCell.selectedBorder,
        isSelected: true,
      });
      this.state.tonePlayer.start(0);
    } else { // stop the player
      this.setState({
        border: "",
        isSelected: false,
      });
      this.state.tonePlayer.stop();
    }

    // send the sound path to the staging layer
    this.props.updateLayerStagingSound("../../" + this.props.instrumentName + ".mp3");
  };

  render() {
    return <td key={this.props.instrumentName}>
      <div className="table-palette-buttonframe" style={{border: this.state.border}}>
        <button
          className="button-palette"
          role="button"
          onClick={this.onSoundClick}
        >
          {this.props.instrumentName}
        </button>
      </div>
    </td>
  };
};

export default PaletteCell;