import React from "react";
import {
  Text, Button, Capacity, Toggle, Spacer
} from "@geist-ui/core";
import { Target, StopCircle } from '@geist-ui/icons';
import { Player } from "tone";
import { ToggleEvent } from "@geist-ui/core/esm/toggle";

interface PaletteRecorderProps {
  updateLayerStagingBuffer: any,
};

interface PaletteRecorderState {
  recorder: MediaRecorder|null,
  isRecording: boolean,
  metronome: any,
  timer: any,
  currentSeconds: number,
  volume: number,
};

class PaletteRecorder extends React.Component<PaletteRecorderProps, PaletteRecorderState> {

  static RecordingLimit: number = 180; // seconds

  constructor(props:PaletteRecorderProps) {
    super(props);
    this.state = {
      recorder: null,
      isRecording: false,
      metronome: new Player("../../metronome.mp3").toDestination(),
      timer: null,
      currentSeconds: 0,
      volume: 0,
    };
    this.startRecording = this.startRecording.bind(this);
    this.stopRecording = this.stopRecording.bind(this);
  };

  componentWillUnmount() {
    this.state.metronome.stop();
    clearInterval(this.state.timer);
    this.setState({
      isRecording: false,
      currentSeconds: 0,
      timer: null,
      recorder: null,
    });
  };

  startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const mediaRecorder = new MediaRecorder(stream);
      this.setState({
        recorder: mediaRecorder,
      });

      let startTime: any = Date.now();
      mediaRecorder.onstart = (event) => {
        startTime = Date.now();
        const timer = setInterval(() => {
          if (this.state.currentSeconds > PaletteRecorder.RecordingLimit) {
            mediaRecorder.stop();
          }
          this.setState({
            currentSeconds: this.state.currentSeconds + 1,
          });
        }, 1000);
        this.setState({
          isRecording: true,
          timer: timer,
        });
      };

      const audioChunks: any[] = [];
      mediaRecorder.addEventListener("dataavailable", event => {
        audioChunks.push(event.data);
      });

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' });
        this.props.updateLayerStagingBuffer(audioBlob, (Date.now() - startTime) / 1000);
        clearInterval(this.state.timer);
        this.setState({
          timer: null,
          isRecording: false,
          currentSeconds: 0,
          volume: 0,
        });
        mediaRecorder.stream.getTracks() // get all tracks from the MediaStream
          .forEach(track => track.stop()); // stop each of them
      };

      mediaRecorder.start();
    });
  };

  stopRecording() {
    if (this.state.recorder === null) return;
    this.state.recorder.stop();
  };

  toggleMetronome(checked:boolean) {
    if (checked) {
      if (!this.state.metronome.loaded) return;
      // eslint-disable-next-line react/no-direct-mutation-state
      this.state.metronome.loop = true,
      this.state.metronome.start(0);
    } else {
      this.state.metronome.stop();
    }
  };

  printTime(seconds:number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().length < 2 ? 0 : ""}${secs}`;
  };

  render() {
    return (
    <>
      <div className="palette-recording-tab" style={{width: '100%', textAlign: 'center', display: 'flex', justifyContent: 'space-around', 
        flexDirection: 'column', height: '50vh'}}>
        <Text h5>Record with your microphone</Text>
        <div className="palette-metronome">
          <span>Metronome</span>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <Toggle type="warning" style={{padding: '0px'}} onChange={(e:ToggleEvent) => this.toggleMetronome(e.target.checked)}/>
          </div>
        </div>
        <div className="palette-recording-details">
          <Text className={this.state.isRecording ? "record-timer" : ""} style={{width: '30%'}} blockquote>{this.printTime(this.state.currentSeconds)}
          </Text>
          {!this.state.isRecording ?
            <Button icon={<Target color="white" />} className="record-btn" auto onClick={this.startRecording}
              style={{background: '#320f48', color: 'white'}}>
              Start Recording
            </Button>
          : 
            <Button icon={<StopCircle/>} className="record-btn" auto type="error" onClick={this.stopRecording}>
              Stop Recording
            </Button>
          }
        </div>
      </div>
    </>
    )
  }
}

export default PaletteRecorder;