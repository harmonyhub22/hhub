import {
  Drawer, Tabs, Grid, Select, Spacer
} from "@geist-ui/core";
import PaletteCell from "./Palette-Cell";
import { config } from "../config";
import React from "react";
import { Mic, Music } from '@geist-ui/icons';
import PaletteLayer from "./Palette-Layer";
import PaletteRecorder from "./Palette-Recorder";
import Member from "../../interfaces/models/Member";
import { get, put } from "../helpers/indexedDb";
import { v4 as uuidv4 } from 'uuid'
import { initResizePalette } from "../helpers/resize";

interface PaletteProps {
  stageLayer: any,
  showPalette: any,
  member: Member,
  setPaletteWidth: any,
};

interface PaletteState {
  stagingLayerSoundName: string|null,
  stagingLayerSoundBuffer: Blob|null,
  stagingLayerSoundBufferId: string|null,
  stagingLayerSoundBufferDuration: any,
  genre: string,
};

class Palette extends React.Component<PaletteProps, PaletteState> {

  static sounds: any = config.sounds;
  static db_name: string = 'AUDIO_BUFFERS';
  static db_obj_store_name: string = 'AUDIO';
  static local_storage_key: string = 'palette-staging-layer';

  constructor(props:PaletteProps) {
    super(props);
    this.state = {
      stagingLayerSoundName: null,
      stagingLayerSoundBuffer: null,
      stagingLayerSoundBufferId: null,
      stagingLayerSoundBufferDuration: null,
      genre: '',
    };
    this.updateLayerSoundName = this.updateLayerSoundName.bind(this);
    this.updateLayerSoundBuffer = this.updateLayerSoundBuffer.bind(this);
    this.updatePaletteGenre = this.updatePaletteGenre.bind(this);

    // create indexed db
    const request = indexedDB.open(Palette.db_name, 1);
    request.onupgradeneeded = (event) => {
      const db = request.result;
      db.createObjectStore(Palette.db_obj_store_name);
    };
  }

  componentDidMount() {
    const data = window.localStorage.getItem(Palette.local_storage_key) || null;
    if (data === null) return;

    // get data from local storage
    const jsonData = JSON.parse(data);

    // set the state
    this.setState({
      stagingLayerSoundName: jsonData.name || null,
      stagingLayerSoundBufferId: jsonData.id || null,
      stagingLayerSoundBufferDuration: jsonData.duration || null,
      genre: jsonData.genre || Object.keys(config.sounds)[0],
    });

    // resize the palette
    initResizePalette(this.props.setPaletteWidth);
  }

  componentDidUpdate(prevProps:PaletteProps, prevState:PaletteState) {
    if (prevState.stagingLayerSoundName !== this.state.stagingLayerSoundName 
      || prevState.stagingLayerSoundBufferId !== this.state.stagingLayerSoundBufferId
      || prevState.genre !== this.state.genre) {
      const data = {
        'name': this.state.stagingLayerSoundName,
        'id': this.state.stagingLayerSoundBufferId,
        'duration': this.state.stagingLayerSoundBufferDuration,
        'genre': this.state.genre,
      };
      window.localStorage.setItem('palette-staging-layer', JSON.stringify(data));

      // get the sound buffer if its there
      if (this.state.stagingLayerSoundBufferId !== null && this.state.stagingLayerSoundBufferId !== undefined 
        && prevState.stagingLayerSoundBufferId !== this.state.stagingLayerSoundBufferId) {
        if (this.state.stagingLayerSoundBufferId !== null) {
          get(Palette.db_name, Palette.db_obj_store_name, this.state.stagingLayerSoundBufferId, (buffer:any) => {
            this.setState({
              stagingLayerSoundBuffer: buffer,
            });
          });
        }
      }
    }
  }

  updatePaletteGenre(name:string) {
    this.setState({
      genre: name,
      stagingLayerSoundName: null,
    });
  }

  updateLayerSoundName (stagingLayerSoundName:string|null) {
    this.setState({
      stagingLayerSoundName: this.state.stagingLayerSoundName === stagingLayerSoundName ? null : stagingLayerSoundName,
      stagingLayerSoundBufferId: null,
      stagingLayerSoundBuffer: null,
      stagingLayerSoundBufferDuration: null,
    });
  }

  updateLayerSoundBuffer (stagingLayerSoundBuffer:Blob|null, duration:number|null) {
    const newId: string = uuidv4();
    if (stagingLayerSoundBuffer !== null && stagingLayerSoundBuffer !== undefined) {
      put(Palette.db_name, Palette.db_obj_store_name, newId, stagingLayerSoundBuffer, () => {});
    }

    this.setState({
      stagingLayerSoundBufferId: stagingLayerSoundBuffer === null ? null : newId,
      stagingLayerSoundBuffer: stagingLayerSoundBuffer,
      stagingLayerSoundBufferDuration: stagingLayerSoundBuffer === null ? null : duration,
      stagingLayerSoundName: stagingLayerSoundBuffer === null ? this.state.stagingLayerSoundName : null,
    });
  }

  render() {
    return (
    <>
      <div style={{textAlign: 'center'}}>
        <Drawer.Title>Sound Palette</Drawer.Title>
      </div>
      <Tabs initialValue="1" align="center" leftSpace={0}>
        <Tabs.Item label={<><Music /> Sounds</>} value="1">
          {(Palette.sounds !== null && Palette.sounds !== undefined) && <div className="palette-genre">
            <span>Genre</span>
            <Spacer w={1}/>
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
          <Grid.Container gap={2} justify="center" style={{maxWidth: '100%', overflow: 'hidden scroll', height: '310px', margin: '0px'}}>
            {Palette.sounds[this.state.genre].map((name:string, i:number) => {
              return(
                <Grid key={`palette-cell-${this.state.genre}-${i}`}>
                  <PaletteCell instrumentName={name} updateLayerStagingSound={this.updateLayerSoundName}
                                isSelected={this.state.stagingLayerSoundName === name} />
                </Grid>)
              })
            }
          </Grid.Container>}
        </Tabs.Item>
        <Tabs.Item label={<><Mic/> Record</>} value="2" style={{width: '400px'}}>
          <PaletteRecorder updateLayerStagingBuffer={this.updateLayerSoundBuffer} />
        </Tabs.Item>
      </Tabs>

      <div style={{textAlign: "center", backgroundColor: 'white'}}>
        <div className="palette-layer-trasition"></div>
        <Drawer.Title>New Layer</Drawer.Title>
        {(this.state.stagingLayerSoundBufferId === null && this.state.stagingLayerSoundName === null) ? 
          <p style={{margin: '2px'}}>Choose a sound or make a recording</p>
          : <p style={{margin: '2px'}}>Click the arrow below to stage the layer on the timeline</p>}
        <PaletteLayer
          stagingSoundBuffer={this.state.stagingLayerSoundBuffer}
          stagingSoundBufferId={this.state.stagingLayerSoundBufferId}
          stagingSoundBufferDuration={this.state.stagingLayerSoundBufferDuration}
          stagingSoundName={this.state.stagingLayerSoundName}
          member={this.props.member}
          stageLayer={this.props.stageLayer}
          showPalette={this.props.showPalette}
          localStorageKey={Palette.local_storage_key}
        />
      </div>
    </>
  )};
};

export default Palette;