import { Button, Text } from "@geist-ui/core";
import { PlayFill, PauseFill } from '@geist-ui/icons'
import React from "react";
import * as Tone from "tone";

interface PaletteLayerProps {
  initials: string,
};

interface PaletteLayerState {
  stagingSoundName: string|null,
  stagingSoundBuffer: AudioBuffer|null,
  isPlaying: boolean,
  pausedTime: number,
  playerDuration: number,
  tonePlayer: any,
};

class PaletteLayer extends React.Component<PaletteLayerProps, PaletteLayerState> {

  constructor(props:PaletteLayerProps) {
    super(props);
    this.state = {
      stagingSoundName: null,
      stagingSoundBuffer: null,
      isPlaying: false,
      pausedTime: 0,
      playerDuration: 0,
      tonePlayer: null,
    };
    this.updateStagingSoundPath = this.updateStagingSoundPath.bind(this);
    this.updateStagingSoundBuffer = this.updateStagingSoundBuffer.bind(this);
    this.handlePlayer = this.handlePlayer.bind(this);
  }

  updateStagingSoundPath(soundName:String) {
    if (this.state.tonePlayer) this.state.tonePlayer.dispose();
    const tonePlayer = new Tone.Player("../../" + soundName + ".mp3").toDestination();
    tonePlayer.sync();
    this.setState({
      stagingSoundName: soundName + "",
      stagingSoundBuffer: null,
      playerDuration: tonePlayer.toSeconds(),
      tonePlayer: tonePlayer,
      pausedTime: 0,
      isPlaying: false,
    });
  };

  updateStagingSoundBuffer(soundBuffer:AudioBuffer) {
    if (this.state.tonePlayer) this.state.tonePlayer.dispose();
    const tonePlayer = new Tone.Player(soundBuffer);
    this.setState({
      stagingSoundBuffer: soundBuffer,
      stagingSoundName: null,
      playerDuration: tonePlayer.toSeconds(),
      tonePlayer: tonePlayer,
      pausedTime: 0,
      isPlaying: false,
    });
  };

  handlePlayer() {
    if (this.state.isPlaying) {
      this.setState({
        pausedTime: this.state.tonePlayer.now(),
      });
      console.log(this.state.tonePlayer.now());
      this.state.tonePlayer.stop();
    } else {
      console.log(this.state.tonePlayer.now());
      this.state.tonePlayer.start(0, this.state.pausedTime);
    }
    this.setState({
      isPlaying: !this.state.isPlaying,
    });
  };

  render() {
    return (
      <>
        <div className="palette-layer">
          <div>
            <Button onClick={this.handlePlayer}>
              {this.state.isPlaying ? <PauseFill/> :<PlayFill/>}
            </Button>
          </div>
          <div>
            <span>something</span>
          </div>
          <div>
            <Text blockquote my={0}>
              {this.state.playerDuration}s
            </Text>
          </div>
        </div>
      </>
    )
  };
}

export default PaletteLayer;