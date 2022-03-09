import { useEffect, useState } from "react";
import {
  Button,
  Drawer,
  Input,
} from "@geist-ui/core";
import PaletteData from "../../interfaces/palette_data";
import { Players } from "tone";
import * as Tone from "tone";
import PaletteCell from "./Palette-Cell";
import { config } from "../config";

const Palette = (genreName:string, addLayerFunc:any) => {

  const selectedBorder = "solid #FFBF00 3px";

  const presetPatterns: string|any[] = config.sounds;
  

  const [players, setPlayers] = useState<Players>();
  const [selectedPatterns, setSelectedPatterns] = useState<string[]>([]);
  const [paletteData, setPaletteData] = useState<PaletteData>({
    name: '',
    numRepeats: 0,
    startMeasure: 0,
    maxMeasuresNeeded: 0,
    genreName: genreName,
  });

  const playLayer = () => {
    if (players === undefined || players === null) return;
    selectedPatterns.forEach((name) => {
      players.player(name).start();
    });
  };

  const stopLayer = () => {
    if (players === undefined || players === null) return;
    players.stopAll();
  };

  const clearLayer = () => {
    if (players === undefined || players === null) return;
    players.stopAll();
    setSelectedPatterns([]);
    document.querySelectorAll<HTMLElement>(".button-palette").forEach((item) => {
      item.style.border = "";
    });
  };

  const handlePatternClick = (name:string, target:any) => {
    if (players === undefined || players === null) return;
    if (!selectedPatterns.includes(name)) {
      target.style.border = selectedBorder;
      setSelectedPatterns([...selectedPatterns, name]);
      [...selectedPatterns, name].forEach((p) => {
        players.player(p).start(0);
      });
    } else {
      target.style.border = "";
      const sp = selectedPatterns.splice(selectedPatterns.indexOf(name), 1);
      setSelectedPatterns(sp);
      players.player(name).stop();
    }
  };

  const numRepeatsBoxHandler = (e:any) => {
    let converted = parseInt(e.target.value);
    // setting the cap at 256 repeats for now
    if (!converted || converted < 0 || converted > 256) {
      alert(
        "Invalid value for number of repeats! Please enter a valid number."
      );
    } else {
      paletteData.numRepeats = converted;
      setPaletteData(paletteData);
    }
  };
  
  const startMeasureBoxHandler = (e:any) => {
    let converted = parseInt(e.target.value);
    // user should enter a start measure which is within the current measures of the song
    if (!converted || converted < 0 || converted > paletteData.maxMeasuresNeeded) {
      alert(
        "Invalid value for start measure! Please enter a valid number."
      );
    } else {
      paletteData.maxMeasuresNeeded = converted;
      setPaletteData(paletteData);
    }
  };

  // initialize all the players
  const initPlayers = () => {
    const tonePlayers = new Tone.Players();
    presetPatterns.map((name) => {
      tonePlayers.add(name, "../../" + name + ".mp3");
    });
    tonePlayers.toDestination();
    setPlayers(tonePlayers);
    // the problem here is that the players state isnt set by the time we click a palette button...look into componentDidMount...
  };

  useEffect(() => {
    if (players === null || players === undefined || players.channelCount !== presetPatterns.length)
      initPlayers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const paletteRows: any = [];
  for (let i = 0; i < presetPatterns.length; i+=3) {
    const paletteRow:any = [];
    presetPatterns.slice(i, i+3).map((name) => {
      let border = "";
      if (selectedPatterns.includes(name)) border = selectedBorder;
      paletteRow.push(<>
        {i < presetPatterns.length && PaletteCell(name, handlePatternClick, border)}
        </>
      );
    });
    paletteRows.push(<tr>{paletteRow}</tr>)
  }

  return (
    <>
      <table className="table-palette">
        <thead>
          <tr>
            <th>GENRE:</th>
            <th className="table-palette-th2">{paletteData.genreName}</th>
          </tr>
        </thead>
        <tbody>
          {paletteRows}
        </tbody>
        <tfoot>
          <tr>
            <td>
              <button onClick={playLayer}>Play All</button>
            </td>
            <td>
              <button onClick={stopLayer}>Stop</button>
            </td>
            <td>
              <button onClick={clearLayer}>Clear</button>
            </td>
          </tr>
        </tfoot>
      </table>
      <br />

      <div id="layer-settings-section">
        <Drawer.Title>Layer settings</Drawer.Title>
        <h5>Number of repeats</h5>
        <p>(0 means it will play once)</p>
        <Input
          value={paletteData.numRepeats.toString()}
          onChange={numRepeatsBoxHandler}
          placeholder="Enter a number, like 0, 4, or 16..."
        />
        <h5>Start measure</h5>
        <p>(The beginning of the song is measure 0)</p>
        <Input
          value={paletteData.startMeasure.toString()}
          onChange={startMeasureBoxHandler}
          placeholder="Enter a number, like 0, 2, or 8..."
        />
        <Button onClick={() => addLayerFunc(paletteData, selectedPatterns)}>Submit Layer</Button>
      </div>
    </>
  )
};

export default Palette;