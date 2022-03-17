import { Button, Text } from "@geist-ui/core";
import { PlayFill, PauseFill, Moon, Mic, Music } from "@geist-ui/icons";
import React, { CSSProperties } from "react";
import * as Tone from "tone";
import { Draggable } from "../Draggable";

interface DraggableLayerProps {
  id: string;
  left: number;
  top: number;
  stagingSoundName: string | null;
  stagingSoundBuffer: AudioBuffer | null;
  isDragging: boolean;
  drag: any;
  showPalette: any;
  duration: number;
  preview?: boolean; 
  layerIsPlaced: boolean;
  layerWidth: number;
}

interface DraggableLayerState {
  stagingSoundName: string | null;
  isPlaying: boolean;
  playerDuration: number;
  pauseTime: number;
  tonePlayer: any;
  paused: boolean;
  currentSeconds: number;
}

class DraggableLayer extends React.Component<
  DraggableLayerProps,
  DraggableLayerState
> {
  static hasPlayerColor: string = "#320f48";
  static hasPlayerFontColor: string = "#DDDDDD";
  static hasPlayerIconColor: string = "#c563c5";

  constructor(props: DraggableLayerProps) {
    super(props);
    this.state = {
      stagingSoundName: null,
      isPlaying: false,
      pauseTime: 0,
      playerDuration: 0,
      tonePlayer: null,
      currentSeconds: 0,
      paused: false,
    };
    this.handlePlayer = this.handlePlayer.bind(this);
    this.createTonePlayer = this.createTonePlayer.bind(this);
  }

  componentDidMount() {
    if (
      this.props.stagingSoundName !== null &&
      this.state.tonePlayer === null
    ) {
      this.createTonePlayer(this.props.stagingSoundName, null);
    } else if (
      this.props.stagingSoundBuffer !== null &&
      this.state.tonePlayer === null
    ) {
      this.createTonePlayer(null, this.props.stagingSoundBuffer);
    }
  }

  createTonePlayer(name: string | null, buffer: AudioBuffer | null) {
    if (this.state.tonePlayer !== null) this.state.tonePlayer.dispose();
    const tonePlayer =
      buffer !== null
        ? new Tone.Player(buffer).toDestination()
        : new Tone.Player("../../" + name + ".mp3").toDestination();
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

  componentDidUpdate(prevProps: DraggableLayerProps) {
    console.log("~~~~~ componentDidUpdate for DraggableLayer ~~~~~~~");
    console.log("prev sound name was " + prevProps.stagingSoundName);
    console.log("now its " + this.props.stagingSoundName);
    console.log("prev buffer was " + prevProps.stagingSoundBuffer);
    console.log("now its " + this.props.stagingSoundBuffer);
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~");
    if (
      this.props.stagingSoundName !== null &&
      this.props.stagingSoundName !== prevProps.stagingSoundName
    ) {
      this.createTonePlayer(this.props.stagingSoundName, null);
    } else if (this.props.stagingSoundBuffer !== null) {
      this.createTonePlayer(null, this.props.stagingSoundBuffer);
    } else if (
      this.props.stagingSoundBuffer === null &&
      this.props.stagingSoundName === null &&
      (prevProps.stagingSoundBuffer !== null ||
        prevProps.stagingSoundName !== null)
    ) {
      if (this.state.tonePlayer !== null) this.state.tonePlayer.dispose();
      this.setState({
        tonePlayer: null,
        playerDuration: 0,
      });
    }
  }

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
      this.state.tonePlayer.stop();
    } else {
      this.state.tonePlayer.start(0, 1);
    }
    this.setState({
      isPlaying: !this.state.isPlaying,
    });
  }

  render() {
    // TODO: add logic to show timeline-specific functionality (duplication, deletion, submitting, etc) based on if this is dropped in the container
    return (
      <div
        ref={this.props.drag}
        style={this.getStyles(
          this.props.left,
          this.props.top,
          this.props.isDragging
        )}
        role="DraggableBox"
        onDragStart={() => this.props.showPalette(false)}
      >
        <div
          className="palette-layer"
          style={{
            backgroundColor:
              this.state.tonePlayer === null ? "" : DraggableLayer.hasPlayerColor,
            border:
              this.state.tonePlayer === null ? "1px solid #eaeaea" : "none",
          }}
        >
          <div className="palette-layer-details">
            <div>
              <Button
                iconRight={
                  this.state.tonePlayer === null ? (
                    <Moon />
                  ) : this.state.isPlaying ? (
                    <PauseFill color={DraggableLayer.hasPlayerIconColor} />
                  ) : (
                    <PlayFill color={DraggableLayer.hasPlayerIconColor} />
                  )
                }
                auto
                scale={2 / 3}
                px={0.6}
                onClick={this.handlePlayer}
                className="play-btn"
              />
            </div>
            <div className="palette-layer-wav"></div>
            <div>
              {this.props.stagingSoundName === null ? (
                <Mic color="white" />
              ) : (
                <Music color="white" />
              )}
            </div>
          </div>
          {(this.state.isPlaying || this.state.paused) && (
            <div
              className="palette-layer-progress"
              style={{
                width: `${
                  (this.state.currentSeconds / this.props.duration) * 100
                }%`,
              }}
            ></div>
          )}
        </div>
      </div>
    );
  }
}

export default Draggable(DraggableLayer);
