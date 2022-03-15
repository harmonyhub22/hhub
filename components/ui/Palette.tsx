import {
  Drawer, Tabs, Grid, Select, Text, Button
} from "@geist-ui/core";
import PaletteCell from "./Palette-Cell";
import { config } from "../config";
import React from "react";
import { Mic, Music } from '@geist-ui/icons';
import PaletteLayer from "./Palette-Layer";


interface PaletteProps {
  genreName: string,
  initials: string,
};

interface PaletteState {
  stagingLayerSoundName: string|null,
  stagingLayerSoundBuffer: AudioBuffer|null,
  stagingLayerSoundBufferId: string|null,
  genre: string,
};

class Palette extends React.Component<PaletteProps, PaletteState> {

  static sounds: any = config.sounds;

  constructor(props:PaletteProps) {
    super(props);
    this.state = {
      stagingLayerSoundName: null,
      stagingLayerSoundBuffer: null,
      stagingLayerSoundBufferId: null,
      genre: '',
    };
    this.updateLayerSoundName = this.updateLayerSoundName.bind(this);
    this.updateLayerSoundBuffer = this.updateLayerSoundBuffer.bind(this);
    this.updatePaletteGenre = this.updatePaletteGenre.bind(this);
  }

  componentDidMount() {
    const data = window.localStorage.getItem('palette-staging-layer') || null;
    if (data === null) return;
    const jsonData = JSON.parse(data);
    this.setState({
      stagingLayerSoundName: jsonData.name,
      stagingLayerSoundBuffer: jsonData.buffer || null,
      stagingLayerSoundBufferId: jsonData.id || null,
      genre: jsonData.genre || Object.keys(config.sounds)[0],
    });
  }

  componentDidUpdate(prevProps:PaletteProps, prevState:PaletteState) {
    if (JSON.stringify(prevState) !== JSON.stringify(this.state)) {
      const data = {
        'name': this.state.stagingLayerSoundName,
        'id': this.state.stagingLayerSoundBufferId,
        'buffer': this.state.stagingLayerSoundBuffer,
        'genre': this.state.genre,
      };
      window.localStorage.setItem('palette-staging-layer', JSON.stringify(data));
    }
  }

  updatePaletteGenre(name:string) {
    this.setState({
      genre: name,
      stagingLayerSoundName: null,
    });
  }

  updateLayerSoundName (stagingLayerSoundName:string|null) {
    if (this.state.stagingLayerSoundName === stagingLayerSoundName) {
      this.setState({
        stagingLayerSoundName: null,
      });
    } else {
      this.setState({
        stagingLayerSoundName: stagingLayerSoundName,
      });
    }
  }

  updateLayerSoundBuffer (stagingLayerSoundBuffer:AudioBuffer|null) {
    this.setState({
      stagingLayerSoundBuffer: stagingLayerSoundBuffer,
    });
    if (stagingLayerSoundBuffer !== null) {
      this.setState({
        stagingLayerSoundName: null,
      });
    }
  }

  startRecordingFunction() {
    const MicRecorder = require('mic-recorder-to-mp3');

    var preRecordingDuration = 1850;
    var recordingDuration = 1850 * 4; //TIME TO RECORD FOR (calculate using BPM)

    const recorder = new MicRecorder({
        bitRate: 128
    });

    const player = new Audio("metronome130.mp3");
    player.play();

    setTimeout(function() {
      recorder.start().then(() => {
      }).catch((e:any) => {
          console.error(e);
      });

      //STOP AFTER TIME
      setTimeout(function() {
          recorder
          .stop()
          .getMp3().then(([buffer, blob]) => {
            //Create file
            const file = new File(buffer, 'mp3recording.mp3', {
                type: blob.type,
                lastModified: Date.now()
            });
            
            //Play it back with default sound (not tone js) this is just for trouble shooting
            const player = new Audio(URL.createObjectURL(file));
            player.play();
          }).catch((e:any) => {
            console.log(e);
          });
      }, recordingDuration); //TIME THAT IT RUNS FOR
    }, preRecordingDuration); //TIME BEFORE RECORDING
  }

  render() {
    return (
    <>
      <Drawer.Title>Sound Palette</Drawer.Title>
      <Tabs initialValue="1" align="center" leftSpace={0}>
        <Tabs.Item label={<><Music /> Sounds</>} value="1">
          {(Palette.sounds !== null && Palette.sounds !== undefined) && <div className="palette-genre">
            <span>Genre</span>
            <Select initialValue={this.state.genre} value={this.state.genre} onChange={(val) => {
              if (typeof val === 'string') { this.updatePaletteGenre(val) }
            }}>
              {Object.keys(Palette.sounds).map((genre:string, i:number) => {
                return (<Select.Option key={`genre-option-${i}`} value={`${genre}`}>{genre}</Select.Option>)
              })}
            </Select>
          </div>}
          <br></br>
          {(Palette.sounds[this.state.genre] !== null && Palette.sounds[this.state.genre] !== undefined) && 
          <Grid.Container gap={2} justify="center" style={{maxWidth: 500}}>
            {Object.keys(Palette.sounds[this.state.genre]).map((name:string, i:number) => {
              return(
                <Grid key={`palette-cell-${this.state.genre}-${i}`}>
                  <PaletteCell instrumentName={name} updateLayerStagingSound={this.updateLayerSoundName}
                                isSelected={this.state.stagingLayerSoundName === name} duration={Palette.sounds[this.state.genre][name]} />
                </Grid>)
              })
            }
          </Grid.Container>}
        </Tabs.Item>
        <Tabs.Item label={<><Mic/> Record</>} value="2">
          <span>Recording Section</span>
          <Button onClick={this.startRecordingFunction}>
            Start Recording
          </Button>
        </Tabs.Item>
      </Tabs>
      <br />

      <div style={{textAlign: "center"}}>
        <Drawer.Title>New Layer</Drawer.Title>
        {(this.state.stagingLayerSoundBufferId === null && this.state.stagingLayerSoundName === null) ? 
          <p>Choose a sound or make a recording</p> 
          : <p>Drag and Drop on the session to stage the layer</p>}
        <PaletteLayer stagingSoundBuffer={this.state.stagingLayerSoundBuffer} 
          stagingSoundName={this.state.stagingLayerSoundName} duration={this.state.stagingLayerSoundName ? Palette.sounds[this.state.genre][this.state.stagingLayerSoundName] : 0} />
      </div>
    </>
  )};
};

export default Palette;