import { Button } from "@geist-ui/core";
import { PlayFill, PauseFill, Moon, Mic, Music } from '@geist-ui/icons'
import React, { CSSProperties } from "react";
import * as Tone from "tone";
import { Draggable } from "../Draggable";

interface PaletteLayerProps {
  stagingSoundName: string|null,
  stagingSoundBufferDate: string|null,
  stagingSoundBufferDuration: any,
  stagingSoundBuffer: Blob|null,
  isDragging: boolean;
  drag: any;
  preview: any;
  left: number;
  top: number;
};

interface PaletteLayerState {
  stagingSoundBuffer: Blob|null,
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
      stagingSoundBuffer: null,
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
    if (this.state.tonePlayer === null) {
      this.createTonePlayer(this.props.stagingSoundName, 
        this.props.stagingSoundBuffer, this.props.stagingSoundBufferDuration);
    }
  }

  componentWillUnmount() {
    if (this.state.tonePlayer !== null) this.state.tonePlayer.stop();
    clearInterval(this.state.timer);
  }

  createTonePlayer(name: string|null, buffer: Blob|null, bufferDuration: number|null) {
    if (this.state.tonePlayer !== null) this.state.tonePlayer.dispose();
    if (this.state.timer !== null) clearInterval(this.state.timer);

    // get duration of audio
    if (name !== null) { // get public sound mp3
      const au = document.createElement('audio');
      au.src = '../../' + name + '.mp3';
      au.addEventListener('loadedmetadata', () => {
        const duration = au.duration;
        const tonePlayer = new Tone.Player('../../' + name + '.mp3').toDestination();
        console.log("The duration of the song is of: " + duration + " seconds");
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
          stagingSoundBuffer: buffer,
          duration: duration,
          isPlaying: false,
          currentSeconds: 0,
          paused: false,
          timer: null,
        });
      }, false);
      au.remove();
    } else if (buffer !== null && bufferDuration !== null) { // get buffer from props
      const tonePlayer = new Tone.Player(URL.createObjectURL(buffer)).toDestination();
      const duration = bufferDuration;
      console.log("The duration of the song is of: " + duration + " seconds");
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
        stagingSoundBuffer: buffer,
        duration: duration,
        isPlaying: false,
        currentSeconds: 0,
        paused: false,
        timer: null,
      });
    }
  }

  componentDidUpdate(prevProps:PaletteLayerProps) {
    if (this.props.stagingSoundName !== null &&
      this.props.stagingSoundName !== prevProps.stagingSoundName) { // set to name
      this.createTonePlayer(this.props.stagingSoundName, this.props.stagingSoundBuffer, null);
    } else if (this.props.stagingSoundBufferDate !== null && this.props.stagingSoundBuffer !== null
      && (this.props.stagingSoundBufferDate !== prevProps.stagingSoundBufferDate 
        || this.props.stagingSoundBuffer !== prevProps.stagingSoundBuffer)) { // set to recording
      this.createTonePlayer(null, this.props.stagingSoundBuffer, this.props.stagingSoundBufferDuration)
    } else if (this.props.stagingSoundBufferDate === null && this.props.stagingSoundName === null
        && (prevProps.stagingSoundBufferDate !== null || prevProps.stagingSoundName !== null)) { // remove name and recording
      console.log('removing both');
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

  getStyles(left: number, top: number, isDragging: boolean): CSSProperties {
    const transform = `translate3d(${left}px, ${top}px, 0)`;
    return {
      position: "absolute",
      transform,
      WebkitTransform: transform,
      // IE fallback: hide the real node using CSS when dragging
      // because IE will ignore our custom "empty image" drag preview.
      opacity: isDragging ? 0 : 1,
      height: isDragging ? 0 : "",
    };
  }

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
      <div
        ref={this.props.drag}
        style={this.getStyles(
          this.props.left,
          this.props.top,
          this.props.isDragging
        )}
        role="DraggableBox"
      >
        <div className="palette-layer" style={{backgroundColor: this.state.tonePlayer === null ? "" : PaletteLayer.hasPlayerColor, border: this.state.tonePlayer === null ? "1px solid #eaeaea" : "none"}}>
          <div className="palette-layer-details">
            <div>
              <Button iconRight={this.state.tonePlayer === null ? <Moon/> : this.state.isPlaying ? 
                <PauseFill color={PaletteLayer.hasPlayerIconColor} /> : <PlayFill color={PaletteLayer.hasPlayerIconColor}/>} auto scale={2/3} px={0.6}
                onClick={this.handlePlayer} className="play-btn" />
            </div>
            <div className="palette-layer-wav">
            </div>
            <div style={{display: 'flex'}}>
              {this.props.stagingSoundName === null ? <Mic color="white"/> : <Music color="white"/>}
            </div>
          </div>
          {(this.state.isPlaying || this.state.paused) && <div className='palette-layer-progress' style={{width: `${(this.state.currentSeconds / this.state.duration) * 100}%`}}>
          </div>}
        </div>
      </div>
    )
  };
}

export default Draggable(PaletteLayer);