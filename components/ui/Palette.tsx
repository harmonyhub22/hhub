import {
  Drawer, Tabs, Grid, Select
} from "@geist-ui/core";
import PaletteCell from "./Palette-Cell";
import { config } from "../config";
import React from "react";
import { Mic, Music } from '@geist-ui/icons';
import PaletteLayer from "./Palette-Layer";
import PaletteRecorder from "./Palette-Recorder";


interface PaletteProps {
};

interface PaletteState {
  stagingLayerSoundName: string|null,
  stagingLayerSoundBuffer: Blob|null,
  stagingLayerSoundBufferDate: string|null,
  stagingLayerSoundBufferDuration: any,
  genre: string,
};

class Palette extends React.Component<PaletteProps, PaletteState> {

  static sounds: any = config.sounds;
  static db_name: string = 'AUDIO_BUFFERS';
  static db_obj_store_name: string = 'AUDIO';

  constructor(props:PaletteProps) {
    super(props);
    this.state = {
      stagingLayerSoundName: null,
      stagingLayerSoundBuffer: null,
      stagingLayerSoundBufferDate: null,
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
    const data = window.localStorage.getItem('palette-staging-layer') || null;
    if (data === null) return;

    // get data from local storage
    const jsonData = JSON.parse(data);

    // set the state
    this.setState({
      stagingLayerSoundName: jsonData.name,
      stagingLayerSoundBufferDate: jsonData.date || null,
      stagingLayerSoundBufferDuration: jsonData.duration || null,
      genre: jsonData.genre || Object.keys(config.sounds)[0],
    });
  }

  componentDidUpdate(prevProps:PaletteProps, prevState:PaletteState) {
    if (prevState.stagingLayerSoundName !== this.state.stagingLayerSoundName || 
      prevState.stagingLayerSoundBufferDate !== this.state.stagingLayerSoundBufferDate) {
      const data = {
        'name': this.state.stagingLayerSoundName,
        'date': this.state.stagingLayerSoundBufferDate,
        'duration': this.state.stagingLayerSoundBufferDuration,
        'genre': this.state.genre,
      };
      window.localStorage.setItem('palette-staging-layer', JSON.stringify(data));

      // get the sound buffer if its there
      if (this.state.stagingLayerSoundBufferDate !== null && this.state.stagingLayerSoundBufferDate !== undefined 
        && prevState.stagingLayerSoundBufferDate !== this.state.stagingLayerSoundBufferDate) {
        const request = indexedDB.open(Palette.db_name, 1);
        request.onsuccess = (event) => {
          const db = request.result;
          const transaction = db.transaction([Palette.db_obj_store_name], 'readwrite');
          if (this.state.stagingLayerSoundBufferDate !== null) {
            const getRequest = transaction.objectStore(Palette.db_obj_store_name)
              .get(this.state.stagingLayerSoundBufferDate);
            getRequest.onsuccess = (event) => {
              const buffer = getRequest.result;
              this.setState({
                stagingLayerSoundBuffer: buffer,
              });
            };
            const getAllRequest = transaction.objectStore(Palette.db_obj_store_name).getAllKeys();
            getAllRequest.onsuccess = () => {
              const allRecords = getAllRequest.result;
              allRecords.forEach((key:any) => {
                if (key !== this.state.stagingLayerSoundBufferDate) {
                  const deleteRequest = transaction.objectStore(Palette.db_obj_store_name).delete(key);
                  deleteRequest.onsuccess = () => {
                    console.log('deleted');
                  };
                }
              });
            };
          }
        };
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
      stagingLayerSoundBufferDate: null,
      stagingLayerSoundBuffer: null,
      stagingLayerSoundBufferDuration: null,
    });
  }

  updateLayerSoundBuffer (stagingLayerSoundBuffer:Blob|null, duration:number|null) {
    const oldBufferDate: string|null = this.state.stagingLayerSoundBufferDate;
    const request = indexedDB.open(Palette.db_name, 1);
    const newDate = Date.now().toString();
    request.onsuccess = (event) => {
      const db = request.result;
      const transaction = db.transaction([Palette.db_obj_store_name], 'readwrite');
      // add the recording to indexed db
      const putRequest = transaction.objectStore(Palette.db_obj_store_name)
        .put(this.state.stagingLayerSoundBuffer, newDate);
      putRequest.onsuccess = (event) => {
        console.log('putted');
      };
    }

    this.setState({
      stagingLayerSoundBufferDate: stagingLayerSoundBuffer === null ? null : newDate,
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
        <br></br>
      </div>
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
        <Tabs.Item label={<><Mic/> Record</>} value="2">
          <PaletteRecorder updateLayerStagingBuffer={this.updateLayerSoundBuffer} />
        </Tabs.Item>
      </Tabs>
      <br />

      <div style={{textAlign: "center"}}>
        <Drawer.Title>New Layer</Drawer.Title>
        {(this.state.stagingLayerSoundBufferDate === null && this.state.stagingLayerSoundName === null) ? 
          <p>Choose a sound or make a recording</p> 
          : <p>Drag and Drop on the session to stage the layer</p>}
        <PaletteLayer
          stagingSoundBuffer={this.state.stagingLayerSoundBuffer}
          stagingSoundBufferDate={this.state.stagingLayerSoundBufferDate}
          stagingSoundBufferDuration={this.state.stagingLayerSoundBufferDuration}
          stagingSoundName={this.state.stagingLayerSoundName}
          isDragging={false}
          isDropped={false}
          top={0}
        />
      </div>
    </>
  )};
};

export default Palette;