import {
  Drawer, Tabs, Grid, Select, Text
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
  lastGenre: string,
};

class Palette extends React.Component<PaletteProps, PaletteState> {

  static presetSounds: any = config.sounds;
  static genres: string[]|any[] = config.genres;

  constructor(props:PaletteProps) {
    super(props);
    this.state = {
      stagingLayerSoundName: null,
      stagingLayerSoundBuffer: null,
      lastGenre: config.genres[0],
    };
    this.updateLayerSoundName = this.updateLayerSoundName.bind(this);
    this.updateLayerSoundBuffer = this.updateLayerSoundBuffer.bind(this);
  }

  updateLayerSoundName (stagingLayerSoundName:string|null) {
    if (this.state.stagingLayerSoundName === stagingLayerSoundName) {
      console.log('undo');
      this.setState({
        stagingLayerSoundName: null,
      });
    } else {
      console.log('set');
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

  render() {
    return (
    <>
      <Drawer.Title>Sound Palette</Drawer.Title>
      <Tabs initialValue="1" align="center" leftSpace={0}>
        <Tabs.Item label={<><Music /> Sounds</>} value="1">
          <div style={{textAlign: 'center'}}>
            <Text scale={1.25} mb={0}>Genre</Text>
            <Select placeholder="Choose one" initialValue='1'>
              {Palette.genres.map((genreName, i) => {
                return (<Select.Option key={`genre-option-${i}`} value={`${i}`}>{genreName}</Select.Option>)
              })}
            </Select>
          </div>
          <br></br>
          <Grid.Container gap={2} justify="center" style={{maxWidth: 500}}>
            {Object.keys(Palette.presetSounds).map((name:string) => {
              return(
              <Grid key={'palette-cell'+name}>
                <PaletteCell instrumentName={name} updateLayerStagingSound={this.updateLayerSoundName}
                              isSelected={this.state.stagingLayerSoundName === name} duration={Palette.presetSounds[name]} />
              </Grid>)
              })
            }
          </Grid.Container>
        </Tabs.Item>
        <Tabs.Item label={<><Mic/> Record</>} value="2">
          <span>Recording Section</span>
        </Tabs.Item>
      </Tabs>
      <br />

      <div style={{textAlign: "center"}}>
        <Drawer.Title>New Layer</Drawer.Title>
        <p>Drag and Drop on the session to stage the layer</p>
        <PaletteLayer stagingSoundBuffer={this.state.stagingLayerSoundBuffer} 
          stagingSoundName={this.state.stagingLayerSoundName} duration={this.state.stagingLayerSoundName ? Palette.presetSounds[this.state.stagingLayerSoundName] : 0} />
      </div>
    </>
  )};
};

export default Palette;