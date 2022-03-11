import { Button, Text } from "@geist-ui/core";
import { PlayFill, PauseFill, Moon } from '@geist-ui/icons'
import React from "react";
import * as Tone from "tone";

interface PaletteLayerProps {
  stagingSoundName: string|null,
  stagingSoundBuffer: AudioBuffer|null,
};

interface PaletteLayerState {
  stagingSoundName: string|null,
  isPlaying: boolean,
  playerDuration: number,
  tonePlayer: any,
};

class PaletteLayer extends React.Component<PaletteLayerProps, PaletteLayerState> {

  static hasPlayerColor: string = "#320f48";
  static hasPlayerFontColor: string = "#DDDDDD";

  constructor(props:PaletteLayerProps) {
    super(props);
    this.state = {
      stagingSoundName: null,
      isPlaying: false,
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
    const tonePlayer = buffer !== null ? new Tone.Player(buffer) : new Tone.Player('../../' + name + '.mp3');
    tonePlayer.onstop = () => {
      this.setState({
        isPlaying: false,
      });
    };
    console.log(tonePlayer.sampleTime);
    console.log(tonePlayer.blockTime);
    console.log(tonePlayer.toSeconds());
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
      console.log(this.state.tonePlayer.now());
      this.state.tonePlayer.stop();
    } else {
      console.log(this.state.tonePlayer.now());
      console.log('starting');
      this.state.tonePlayer.start();
    }
    this.setState({
      isPlaying: !this.state.isPlaying,
    });
  };

  render() {
    return (
      <>
        <div className="palette-layer" style={{backgroundColor: this.state.tonePlayer === null ? "" : PaletteLayer.hasPlayerColor}}>
          <div>
            <Button iconRight={this.state.tonePlayer === null ? <Moon/> : this.state.isPlaying ? <PauseFill /> : <PlayFill/>} auto scale={2/3} px={0.6}
              onClick={this.handlePlayer} className={"play-btn"} />
          </div>
          <div>
            <span>something</span>
          </div>
          <div>
            {this.state.tonePlayer !== null && <Text my={0} style={{color: PaletteLayer.hasPlayerFontColor}}>
              {this.state.playerDuration !== null ?
                `${Math.floor(this.state.tonePlayer.sampleTime % 60)}.${Math.floor(this.state.tonePlayer.sampleTime / 60)}` : ""}
            </Text>}
          </div>
        </div>
      </>
    )
  };
}

export default PaletteLayer;