import {
  Drawer, Tabs,
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
};

class Palette extends React.Component<PaletteProps, PaletteState> {

  static presetSounds: string[]|any[] = config.sounds;

  constructor(props:PaletteProps) {
    super(props);
    this.state = {
      stagingLayerSoundName: null,
      stagingLayerSoundBuffer: null,
    };
    this.updateLayerSoundName = this.updateLayerSoundName.bind(this);
    this.updateLayerSoundBuffer = this.updateLayerSoundBuffer.bind(this);
  }

  updateLayerSoundName (stagingLayerSoundName:string|null) {
    console.log(this.state);
    this.setState({
      stagingLayerSoundName: stagingLayerSoundName,
    });
    if (stagingLayerSoundName !== null) {
      this.setState({
        stagingLayerSoundBuffer: null,
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

  initPaletteRows () {
    const paletteRows = [];
    for (let i = 0; i < Palette.presetSounds.length; i+=3) {
      const paletteRow:any = [];
      Palette.presetSounds.slice(i, i+3).map((name) => {
        paletteRow.push(<>
          {i < Palette.presetSounds.length && <PaletteCell instrumentName={name} 
            updateLayerStagingSound={this.updateLayerSoundName} isSelected={name === this.state.stagingLayerSoundName ? true : false} />}
          </>
        );
      });
      paletteRows.push(<tr>{paletteRow}</tr>)
    }
    return (<>{paletteRows}</>);
  };

  render() {
    return (
    <>
      <Tabs initialValue="1" align="center" leftSpace={0}>
        <Tabs.Item label={<><Music /> Sounds</>} value="1">
          <table className="table-palette">
            <thead>
              <tr>
                <th>Genre</th>
                <th className="table-palette-th2">{this.props.genreName}</th>
              </tr>
            </thead>
            <tbody>
              {this.initPaletteRows}
            </tbody>
          </table>
        </Tabs.Item>
        <Tabs.Item label={<><Mic/> Record</>} value="2">
          <span>Recording Section</span>
        </Tabs.Item>
      </Tabs>
      <br />

      <div id="layer-settings-section">
        <Drawer.Title>New Layer</Drawer.Title>
        <p>Drag and Drop on the session to stage the layer</p>
        <PaletteLayer initials={""} />
      </div>
    </>
  )};
};

export default Palette;