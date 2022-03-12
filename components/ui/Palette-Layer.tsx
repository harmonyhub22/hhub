import { Button, Text } from "@geist-ui/core";
import { PlayFill, PauseFill, Moon } from '@geist-ui/icons'
import React from "react";
import * as Tone from "tone";
import { Draggable } from "../Draggable";

interface PaletteLayerProps {
  stagingSoundName: string|null,
  stagingSoundBuffer: AudioBuffer|null,
  isDragging: boolean,
  dragRef: any
};

interface PaletteLayerState {
  stagingSoundName: string|null,
  isPlaying: boolean,
  playerDuration: number,
  pauseTime: number,
  tonePlayer: any,
};

class PaletteLayer extends React.Component<PaletteLayerProps, PaletteLayerState> {

  static hasPlayerColor: string = "#320f48";
  static hasPlayerFontColor: string = "#DDDDDD";
  static hasPlayerIconColor: string = "#c563c5";

  constructor(props:PaletteLayerProps) {
    super(props);
    this.state = {
      stagingSoundName: null,
      isPlaying: false,
      pauseTime: 0,
      playerDuration: 0,
      tonePlayer: null,
    };
    this.handlePlayer = this.handlePlayer.bind(this);
    this.createTonePlayer = this.createTonePlayer.bind(this);
  }

  componentDidMount() {
    if (this.props.stagingSoundName !== null && this.state.tonePlayer === null) {
      this.createTonePlayer(this.props.stagingSoundName, null);
    } else if (this.props.stagingSoundBuffer !== null && this.state.tonePlayer === null) {
      this.createTonePlayer(null, this.props.stagingSoundBuffer);
    }
  }

  createTonePlayer(name: string|null, buffer: AudioBuffer|null) {
    if (this.state.tonePlayer !== null) this.state.tonePlayer.dispose();
    const tonePlayer = buffer !== null ? new Tone.Player(buffer).toDestination() : new Tone.Player('../../' + name + '.mp3').toDestination();
    tonePlayer.onstop = () => {
      let pt = this.state.tonePlayer.now();
      if (pt === this.state.tonePlayer.toSeconds()) pt = 0;
      this.setState({
        isPlaying: false,
        pauseTime: pt,
      });
    };
    this.setState({
      tonePlayer: tonePlayer,
      playerDuration: tonePlayer.toSeconds(),
    });
  }

  componentDidUpdate(prevProps:PaletteLayerProps) {
    if (this.props.stagingSoundName !== null && 
      this.props.stagingSoundName !== prevProps.stagingSoundName) {
      this.createTonePlayer(this.props.stagingSoundName, null);
    } else if (this.props.stagingSoundBuffer !== null) {
      this.createTonePlayer(null, this.props.stagingSoundBuffer)
    } else if (this.props.stagingSoundBuffer === null && this.props.stagingSoundName === null
        && (prevProps.stagingSoundBuffer !== null || prevProps.stagingSoundName !== null)) {
      if (this.state.tonePlayer !== null) this.state.tonePlayer.dispose();
      this.setState({
        tonePlayer: null,
        playerDuration: 0,
      });
    }
  };

  handlePlayer() {
    if (this.state.tonePlayer === null) return;
    if (this.state.tonePlayer.state === "started") {
      this.state.tonePlayer.stop();
    } else {
      this.state.tonePlayer.start(0,1);
    }
    this.setState({
      isPlaying: !this.state.isPlaying,
    });
  };

  render() {
    return (
      <>
        {this.props.isDragging ? 
        <p>Drag your layer onto the highlighted portion of the timeline!</p>
        : 
        <div className="palette-layer" ref={this.props.dragRef} style={{backgroundColor: this.state.tonePlayer === null ? "" : PaletteLayer.hasPlayerColor}}>
          <div>
            <Button iconRight={this.state.tonePlayer === null ? <Moon/> : this.state.isPlaying ? 
              <PauseFill color={PaletteLayer.hasPlayerIconColor} /> : <PlayFill color={PaletteLayer.hasPlayerIconColor}/>} auto scale={2/3} px={0.6}
              onClick={this.handlePlayer} className={"play-btn"} />
          </div>
          <div className="palette-layer-wav">
          </div>
          <div>
            {this.state.tonePlayer !== null && <Text my={0} style={{color: PaletteLayer.hasPlayerFontColor}}>
              {this.state.playerDuration !== null ?
                `${Math.floor(this.state.tonePlayer.sampleTime % 60)}.${Math.floor(this.state.tonePlayer.sampleTime / 60)}` : ""}
            </Text>}
          </div>
        </div>
        }
      </>
    )
  };
}

export default Draggable(PaletteLayer);