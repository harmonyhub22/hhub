import { Button, Tooltip } from "@geist-ui/core";
import { PlayFill, PauseFill, Moon, Mic, Music, ChevronLeft } from '@geist-ui/icons'
import React from "react";
import * as Tone from "tone";
import LayerInterface from "../../interfaces/models/LayerInterface";
import Member from "../../interfaces/models/Member";
import StagedLayer from "../../interfaces/StagedLayerInterface";
import { config } from "../config";
import { v4 as uuidv4 } from 'uuid'

interface PaletteLayerProps {
  stagingSoundName: string|null,
  stagingSoundBufferId: string|null,
  stagingSoundBufferDuration: any,
  stagingSoundBuffer: Blob|null,
  member: Member,
  stageLayer: any,
  showPalette: any,
  localStorageKey: string,
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

  constructor(props: PaletteLayerProps) {
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
    this.handleStageLayer = this.handleStageLayer.bind(this);
  }

  componentDidMount() {
    if (this.state.tonePlayer === null) {
      this.createTonePlayer(
        this.props.stagingSoundName,
        this.props.stagingSoundBuffer,
        this.props.stagingSoundBufferDuration
      );
    }
  }

  componentWillUnmount() {
    if (this.state.tonePlayer !== null) this.state.tonePlayer.stop();
    clearInterval(this.state.timer);
  }

  createTonePlayer(
    name: string | null,
    buffer: Blob | null,
    bufferDuration: number | null
  ) {
    if (this.state.tonePlayer !== null) this.state.tonePlayer.dispose();
    if (this.state.timer !== null) clearInterval(this.state.timer);

    // get duration of audio
    if (name !== null) { // get public sound mp3
      const tonePlayer = new Tone.Player('../../' + name + '.mp3',
        onload= () => {
          this.setState({
            duration: tonePlayer.buffer.duration,
            tonePlayer: tonePlayer,
            isPlaying: false,
            currentSeconds: 0,
            paused: false,
            timer: null,
          });
      }).toDestination();
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
    } else if (buffer !== null && buffer !== undefined && bufferDuration !== null) {
      const tonePlayer = new Tone.Player(
        URL.createObjectURL(buffer), onload = () => {
          this.setState({
            duration: tonePlayer.buffer.duration,
            tonePlayer: tonePlayer,
            isPlaying: false,
            currentSeconds: 0,
            paused: false,
            timer: null,
          });
        }
      ).toDestination();
      const duration = bufferDuration;
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
    }
  }

  componentDidUpdate(prevProps: PaletteLayerProps) {
    if (
      this.props.stagingSoundName !== null &&
      this.props.stagingSoundName !== prevProps.stagingSoundName
    ) {
      // set to name
      this.createTonePlayer(
        this.props.stagingSoundName,
        this.props.stagingSoundBuffer,
        null
      );
    } else if (
      this.props.stagingSoundBufferId !== null &&
      this.props.stagingSoundBuffer !== null &&
      (this.props.stagingSoundBufferId !== prevProps.stagingSoundBufferId ||
        this.props.stagingSoundBuffer !== prevProps.stagingSoundBuffer)
    ) {
      // set to recording
      this.createTonePlayer(
        null,
        this.props.stagingSoundBuffer,
        this.props.stagingSoundBufferDuration
      );
    } else if (
      this.props.stagingSoundBufferId === null &&
      this.props.stagingSoundName === null &&
      (prevProps.stagingSoundBufferId !== null ||
        prevProps.stagingSoundName !== null)
    ) {
      // remove name and recording
      console.log("removing both");
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
  }

  handlePlayer() {
    if (this.state.tonePlayer === null) return;
    if (this.state.tonePlayer.loaded === false) return;
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

  handleStageLayer() {
    const id = uuidv4();
    const layer: LayerInterface = {
      layerId: id,
      member: this.props.member,
      name: `layer-${id}`,
      startTime: 0,
      duration: this.state.duration,
      fileName: this.props.stagingSoundName,
      bucketUrl: null,
      fadeInDuration: 0,
      fadeOutDuration: 0,
      trimmedStartDuration: 0,
      trimmedEndDuration: 0,
      y: 30,
      muted: false,
    }
    const newLayer: StagedLayer = {
      layer: layer,
      recordingBlob: this.props.stagingSoundBuffer !== null && this.props.stagingSoundBuffer !== undefined ? new Blob([this.props.stagingSoundBuffer], {type: this.props.stagingSoundBuffer.type}) : null,
      recordingId: this.props.stagingSoundBufferId,
    };
    this.props.stageLayer(newLayer);
    const genreData = {
      genre: JSON.parse(window.localStorage.getItem(this.props.localStorageKey) ?? '')?.genre ?? Object.keys(config.sounds)[0],
    }
    window.localStorage.setItem(this.props.localStorageKey, JSON.stringify(genreData));
    this.props.showPalette(false);
  };

  render() {
    return (
      <>
        <div className="palette-layer" style={{backgroundColor: this.state.tonePlayer === null ? "" : PaletteLayer.hasPlayerColor, border: this.state.tonePlayer === null ? "1px solid #eaeaea" : "none"}}>
          <div className="palette-layer-details">
            <div>
            {this.state.tonePlayer !== null && <Tooltip text={'Stage Layer'} type="dark">
              <Button iconRight={<ChevronLeft color="white" />} auto
                style={{backgroundColor: 'transparent', padding: '2px', position: 'relative'
                }}
                onClick={this.handleStageLayer}
              ></Button>
            </Tooltip>}
            </div>
            <div>
              <Button
                iconRight={
                  this.state.tonePlayer === null ? (
                    <Moon />
                  ) : this.state.isPlaying ? (
                    <PauseFill color={PaletteLayer.hasPlayerIconColor} />
                  ) : (
                    <PlayFill color={PaletteLayer.hasPlayerIconColor} />
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
            <div style={{ display: "flex" }}>
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
                  (this.state.currentSeconds / this.state.duration) * 100
                }%`,
              }}
            ></div>
          )}
        </div>
      </>
    );
  }
}

export default PaletteLayer;
