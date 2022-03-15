import { Button, Text } from "@geist-ui/core";
import { PlayFill, PauseFill, Moon, Mic, Music } from '@geist-ui/icons'
import React from "react";
import * as Tone from "tone";

interface PaletteLayerProps {
  stagingSoundName: string|null,
  stagingSoundBuffer: AudioBuffer|null,
};

interface PaletteLayerState {
  isPlaying: boolean,
  timer: any,
  tonePlayer: any,
  currentSeconds: number,
  paused: boolean,
  duration: number,
};

class PaletteLayer extends React.Component<PaletteLayerProps, PaletteLayerState> {

  static hasPlayerColor: string = "#320f48";
  static hasPlayerFontColor: string = "#DDDDDD";
  static hasPlayerIconColor: string = "#c563c5";

  constructor(props:PaletteLayerProps) {
    super(props);
    this.state = {
      isPlaying: false,
      timer: null,
      tonePlayer: null,
      currentSeconds: 0,
      paused: false,
      duration: 0,
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
    if (this.state.timer !== null) clearInterval(this.state.timer);
    if (buffer === null) {
      const au = document.createElement('audio');
      au.src = '../../' + name + '.mp3';
      au.addEventListener('loadedmetadata', () => {
        const duration = au.duration;
        this.setState({
          duration: duration,
        });
        console.log("The duration of the song is of: " + duration + " seconds");
      }, false);
      au.remove();
    } else {
      
    }
    const tonePlayer = buffer !== null ? new Tone.Player(buffer).toDestination() : new Tone.Player('../../' + name + '.mp3').toDestination();
    tonePlayer.onstop = () => {
      clearInterval(this.state.timer);
      if (!this.state.paused) {
        this.setState({
          currentSeconds: 0,
          paused: false,
          isPlaying: false,
        });
      }
    };
    this.setState({
      tonePlayer: tonePlayer,
      isPlaying: false,
      currentSeconds: 0,
      paused: false,
      timer: null,
    });
  }

  componentDidUpdate(prevProps:PaletteLayerProps) {
    if (this.props.stagingSoundName !== null &&
      this.props.stagingSoundName !== prevProps.stagingSoundName) { // set to name
      this.createTonePlayer(this.props.stagingSoundName, null);
    } else if (this.props.stagingSoundBuffer !== null) { // set to recording
      this.createTonePlayer(null, this.props.stagingSoundBuffer)
    } else if (this.props.stagingSoundBuffer === null && this.props.stagingSoundName === null
        && (prevProps.stagingSoundBuffer !== null || prevProps.stagingSoundName !== null)) { // remove name and recording
      if (this.state.tonePlayer !== null) this.state.tonePlayer.dispose();
      if (this.state.timer !== null) clearInterval(this.state.timer);
      this.setState({
        tonePlayer: null,
        timer: null,
        currentSeconds: 0,
        paused: false,
        isPlaying: false,
        duration: 0,
      });
    }
  };

  handlePlayer() {
    if (this.state.tonePlayer === null) return;
    if (this.state.tonePlayer.state === "started") {
      this.setState({
        paused: true,
      });
      this.state.tonePlayer.stop();
    } else {
      this.state.tonePlayer.start(0, this.state.currentSeconds);
      const timer = setInterval(() => {
        this.setState({
          currentSeconds: this.state.currentSeconds + 0.1,
        });
      }, 100);
      this.setState({
        timer: timer,
        paused: false,
      });
    }
    this.setState({
      isPlaying: !this.state.isPlaying,
    });
  };

  render() {
    return (
      <>
        <div className="palette-layer" style={{backgroundColor: this.state.tonePlayer === null ? "" : PaletteLayer.hasPlayerColor, border: this.state.tonePlayer === null ? "1px solid #eaeaea" : "none"}}>
          <div className="palette-layer-details">
            <div>
              <Button iconRight={this.state.tonePlayer === null ? <Moon/> : this.state.isPlaying ? 
                <PauseFill color={PaletteLayer.hasPlayerIconColor} /> : <PlayFill color={PaletteLayer.hasPlayerIconColor}/>} auto scale={2/3} px={0.6}
                onClick={this.handlePlayer} className="play-btn" />
            </div>
            <div className="palette-layer-wav">
            </div>
            <div>
              {this.props.stagingSoundName === null ? <Mic color="white"/> : <Music color="white"/>}
            </div>
          </div>
          {(this.state.isPlaying || this.state.paused) && <div className='palette-layer-progress' style={{width: `${(this.state.currentSeconds / this.state.duration) * 100}%`}}>
          </div>}
        </div>
      </>
    )
  };
}

export default PaletteLayer;