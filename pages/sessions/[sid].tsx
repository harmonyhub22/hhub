import { Player } from "tone";
import * as Tone from "tone";
import React, { Component, useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import {
  Button,
  Page,
  Text,
  Drawer,
  Modal,
  useModal,
  Grid,
  GeistProvider,
  CssBaseline,
  Table,
  ButtonDropdown,
  Input,
} from "@geist-ui/core";
import { PlaySong, StopSong } from "../../components/palette/buttons";
import { io } from "socket.io-client";
import { config } from "../../components/config";
import { saveAs } from "file-saver";
import moment from "moment";
import Head from "next/head";
import Layer from "../../interfaces/models/Layer";
import { MemberContext } from "../../context/member";
import { SocketContext } from "../../context/socket";
import Crunker from "crunker";
import { buffer } from "stream/consumers";

function Session() {
  const { visible, setVisible, bindings } = useModal();
  const [showPallete, setShowPallete] = React.useState(false);
  const [selectedPattern, setSelectedPattern] = useState("");
  // TODO: change these to one data object { numRepeats: , startMeasure: , maxMeasuresNeeded: }
  const [numRepeats, setNumRepeats] = useState(0);
  const [startMeasure, setStartMeasure] = useState(0);
  const [maxMeasuresNeeded, setMaxMeasuresNeeded] = useState(1);


  const [songLength, setSongLength] = useState();

  // shouldn't store jsx elements
  const [tableHeaders, setTableHeaders] = useState<JSX.Element | null>([
    <th>M1</th>,
  ]);
  const [tableRows, setTableRows] = useState([]);

  const router = useRouter();
  const allLayers :Array<Layer> = []
  const buffers :Array<AudioBuffer> = []
  const socket = useContext(SocketContext);
  const player = useContext(MemberContext);
  const sessionId = router.query.id;

  const [layers, setLayers] = useState(allLayers);
  const [buffs, setbuffers] = useState(buffers);

  const presetPatterns = ["Drum1", "Drum2", "Drum3", "Piano1", "Piano2", "Piano3", "Bass1", "Bass2", "Bass3", "Guitar1", "Guitar2", "Guitar3"];

  const [players, setPlayers] = useState({})

  const handlePatternClick = (name:string) => {
    selectedPattern === name
      ? setSelectedPattern("")
      : setSelectedPattern(name);
    const player = players[name];
    player.play();
  };

  const numRepeatsBoxHandler = (e:any) => {
    let converted = parseInt(e.target.value);
    // setting the cap at 256 repeats for now
    if (!converted || converted < 0 || converted > 256) {
      alert(
        "Invalid value for number of repeats! Please enter a valid number."
      );
    } else {
      setNumRepeats(converted);
    }
  };

  const startMeasureBoxHandler = (e:any) => {
    let converted = parseInt(e.target.value);
    // user should enter a start measure which is within the current measures of the song
    if (!converted || converted < 0 || converted > maxMeasuresNeeded) {
      alert(
        "Invalid value for start measure! Please enter a valid number."
      );
    } else {
      setStartMeasure(converted);
    }
  };

  const paletteCell = (instrumentName:string) => {
    return (
      <td>
        <div className="table-palette-buttonframe">
          <button
            className="button-palette"
            role="button"
            onClick={() => handlePatternClick(instrumentName)}
          >
            {instrumentName}
          </button>
        </div>
      </td>
    );
  };

  const addLayer = async () => {
    if (!selectedPattern) {
      alert("Please seclect a palette pattern to use!");
    } else {
      const dataToEmit = {
        sessionId: sessionId,
      };
      socket.emit("add_layer", dataToEmit);

      // each of Will's patterns is 4 measures = .7 seconds
      // therefore, there are .7/4 = .175 seconds per measure
      const startTime = startMeasure * 0.175;
      const endTime = startTime + 0.7 * (numRepeats + 1);

      // because we cant send json data and audio data at the same time, we must do 2 API calls (POST and PUT)
      // POST request to make new layer with metadata
      // const postData = {
      //   startTime: startTime,
      //   endTime: endTime,
      //   repeatCount: numRepeats,
      // };
      // const postResponse = await fetch(config.server_url + "api/session/" + sessionId + "/layers", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     "MEMBERID": player.memberId
      //   },
      //   body: JSON.stringify(postData),
      // });
      // const layer = await postResponse.json();
      // const layerId = layer.layerId.toString();

      // PUT request to this layer to actually send the audio file
      // const layerFormData = new FormData();
      // //layerFormData.append('file', fileFromInput);
      // const putResponse = await fetch(
      //   config.server_url + "api/session/" + sessionId + "/layers/" + layerId,
      //   {
      //     method: "PUT",
      //     headers: {
      //       "Content-Type": "application/x-www-form-urlencoded",
      //       MEMBERID: player.memberId,
      //     },
      //     // body: ot sure what to put for body
      //     body: layerFormData,
      //   }
      // );

      let totalLayers = layers;
      const newLayer: Layer = {
        startTime: startTime,
        endTime: endTime,
        repeatCount: numRepeats,
        file: "../" + selectedPattern + ".mp3",
      };
      
      totalLayers.push(newLayer);
      allLayers.push(newLayer);
      setLayers(totalLayers);

      const measuresNeeded = startMeasure + 4 * (numRepeats + 1);
      if (measuresNeeded > maxMeasuresNeeded) {
        setMaxMeasuresNeeded(measuresNeeded);
      }

      let items = [];
      for (let i = 1; i <= maxMeasuresNeeded; i++) {
        items.push(<th key={"header_" + i}>M{i}</th>);
      }
      setTableHeaders(items); // bad

      let rows = [];
      rows = totalLayers.map((layer, i) => {
        return (
          <tr key={"layer_" + i}>
            <td colSpan={maxMeasuresNeeded}>
              <audio
                controls
                style={computeLayerStyle(layer.startTime, layer.endTime - layer.startTime)}
                src={layer.file}
              ></audio>
            </td>
          </tr>
        );
      });
      setTableRows(rows); // bad

      setSelectedPattern("");
      setNumRepeats(0);
      setStartMeasure(0);
    }
  };

  // the left offset and width of the layer depends on the start time and ratio of layer duration to the entire song, respectively
  const computeLayerStyle = (start:number, duration:number) => {
      const layerStyle = {
        width: "50px",
        marginLeft: "0px",
      };

      let durationPerentage = duration / (maxMeasuresNeeded * .175) * 100;
      layerStyle.width = durationPerentage.toString() + "%";
      
      // the percentage of left offset decreases as the # of columns in our table increases (since columns shrink as more are added)
      let multiplier = 20;
      if (maxMeasuresNeeded >= 5 && maxMeasuresNeeded < 10) multiplier = 10;
      else if (maxMeasuresNeeded >= 10) multiplier = 5;
      let leftOffset = start * multiplier;
      layerStyle.marginLeft = leftOffset.toString() + "%";
      return layerStyle;
  };


  const finishSong = async () => {
    // TODO: make backend request to process the finished song (send all of the layers)
    let crunker = new Crunker();
    let cleararr  :Array<AudioBuffer> = []
    let allLayers = layers
    let mp3s = buffs
    let start: Array<number> = []
    let repeats : Array<number> = []
    
    allLayers?.map(async (layer) => {
      let buffer = await crunker.fetchAudio(layer.file).then((buffer:any)=>crunker.padAudio(buffer[0],0,layer.startTime))
      mp3s.push(buffer)
      setbuffers(mp3s)
      }
    )
    let t = crunker.mergeAudio(buffs)
    let output = crunker.export(t, 'audio/mp3')
    crunker.download(output.blob)
    mp3s = [];
    setbuffers([]);

    socket.emit("finished");
  };

  const saveFile = () => {
    saveAs(
      "https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_1MG.mp3"
    );
  };

  const startPlayers = () => {
    const tempPlayers:any = {};
    presetPatterns.map((pattern) => {
      const player = new Tone.Player("../" + pattern + ".mp3").toDestination();
      Tone.loaded().then(() => {
        tempPlayers[pattern] = player;
      });
    });
    setPlayers(tempPlayers);
    // the problem here is that the players state isnt set by the time we click a palette button...look into componentDidMount...
  };
  /*
  const Drum1 = () => {
    const drum1Player = new Tone.Player("../Drum1.mp3").toDestination();
    Tone.loaded().then(() => {
      drum1Player.start();
    });
    players['Drum1'] = drumPlayer;
    setPlayers(players)
  };
  const Drum2 = () => {
    const drum2Player = new Tone.Player("../Drum2.mp3").toDestination();
    Tone.loaded().then(() => {
      drum2Player.start();
    });
  };
  const Drum3 = () => {
    const drum3Player = new Tone.Player("../Drum3.mp3").toDestination();
    Tone.loaded().then(() => {
      drum3Player.start();
    });
  };
  const Piano1 = () => {
    const piano1Player = new Tone.Player("../Piano1.mp3").toDestination();
    Tone.loaded().then(() => {
      piano1Player.start();
    });
  };
  const Piano2 = () => {
    const piano2Player = new Tone.Player("../Piano2.mp3").toDestination();
    Tone.loaded().then(() => {
      piano2Player.start();
    });
  };
  const Piano3 = () => {
    const piano3Player = new Tone.Player("../Piano3.mp3").toDestination();
    Tone.loaded().then(() => {
      piano3Player.start();
    });
  };
  const Bass1 = () => {
    const bass1Player = new Tone.Player("../Bass1.mp3").toDestination();
    Tone.loaded().then(() => {
      bass1Player.start();
    });
  };
  const Bass2 = () => {
    const bass2Player = new Tone.Player("../Bass2.mp3").toDestination();
    Tone.loaded().then(() => {
      bass2Player.start();
    });
  };
  const Bass3 = () => {
    const bass3Player = new Tone.Player("../Bass3.mp3").toDestination();
    Tone.loaded().then(() => {
      bass3Player.start();
    });
  };
  const Guitar1 = () => {
    guitar1Player = new Tone.Player("../Guitar1.mp3").toDestination();
    Tone.loaded().then(() => {
      guitar1Player.start();
    });
  };
  const Guitar2 = () => {
    guitar2Player = new Tone.Player("../Guitar2.mp3").toDestination();
    Tone.loaded().then(() => {
      guitar2Player.start();
    });
  };
  const Guitar3 = () => {
    guitar3Player = new Tone.Player("../Guitar3.mp3").toDestination();
    Tone.loaded().then(() => {
      guitar3Player.start();
    });
  };
  */

  useEffect(() => {
      startPlayers();
  }, []);

  return (
    <Page>
      <Head>
        <h3>Your song session! Add a layer to your song with your partner!</h3>
        <p>Song BPM: 130</p>
      </Head>
      <div id="session-timeline-div">
        <table id="session-timeline">
          <tbody>
            <tr>{tableHeaders}</tr>
            {(tableRows?.length ?? 0) === 0 ?
            (<tr>
              <td>
                <p>Create your first layer!</p>
              </td>
            </tr>) : tableRows}
          </tbody>
        </table>
      </div>

      <Drawer
        visible={showPallete}
        onClose={() => setShowPallete(false)}
        placement="right"
      >
        <Drawer.Title>Your Sound Pallete</Drawer.Title>
        <Drawer.Content>
          <table className="table-palette">
            <thead>
              <tr>
                <th>GENRE:</th>
                <th className="table-palette-th2">ROCK</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {paletteCell(presetPatterns[0])}
                {paletteCell(presetPatterns[1])}
                {paletteCell(presetPatterns[2])}
              </tr>
              <tr>
                {paletteCell(presetPatterns[3])}
                {paletteCell(presetPatterns[4])}
                {paletteCell(presetPatterns[5])}
              </tr>
              <tr>
                {paletteCell(presetPatterns[6])}
                {paletteCell(presetPatterns[7])}
                {paletteCell(presetPatterns[8])}  
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td>
                  <button onClick={PlaySong}>Play</button>
                </td>
                <td>
                  <button onClick={StopSong}>Mute</button>
                </td>
              </tr>
            </tfoot>
          </table>
          <br />
          <table className="table-palette">
            <thead>
              <tr>
                <th>Palette:</th>
                <th className="table-palette-th2">ROCK</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="table-palette-buttonframe">
                    <button className="button-palette" role="button">
                      Piano
                    </button>
                  </div>
                </td>
                <td>
                  <div className="table-palette-buttonframe">
                    <button className="button-palette" role="button">
                      Overdriven Guitar
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="table-palette-buttonframe">
                    <button className="button-palette" role="button">
                      Rock Drums
                    </button>
                  </div>
                </td>
                <td>
                  <div className="table-palette-buttonframe">
                    <button className="button-palette" role="button">
                      Bass Guitar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot>
              {/* <tr>
                <td>
                  <button>RESET</button>
                </td>
                <td>
                  <button>SAVE</button>
                </td>
              </tr> */}
            </tfoot>
          </table>
          <br />

          <div id="layer-settings-section">
            <Drawer.Title>Layer settings</Drawer.Title>
            <h5>Number of repeats</h5>
            <p>(0 means it will play once)</p>
            <Input
              value={numRepeats.toString()}
              onChange={numRepeatsBoxHandler}
              placeholder="Enter a number, like 0, 4, or 16..."
            />
            <h5>Start measure</h5>
            <p>(The beginning of the song is measure 0)</p>
            <Input
              value={startMeasure.toString()}
              onChange={startMeasureBoxHandler}
              placeholder="Enter a number, like 0, 2, or 8..."
            />
          </div>
        </Drawer.Content>
      </Drawer>

      <br></br>
      {/* <Button auto ghost px={0.6} onClick={FocusLayer1}>
        Play Layer 1
      </Button>
      <Button auto ghost px={0.6} onClick={FocusLayer2}>
        Play Layer 2
      </Button> */}

      <Modal {...bindings}>
        <Modal.Title>Finishing Song</Modal.Title>
        <Modal.Content>
          <p>Would you like to leave or download the song</p>
        </Modal.Content>
        <Modal.Action passive onClick={() => setVisible(false)}>
          Leave
        </Modal.Action>
        <Modal.Action passive onClick={() => finishSong()}>
          Download
        </Modal.Action>
      </Modal>

      <Page.Footer>
        <Button auto onClick={() => setVisible(true)} type="success">
          Finish Song
        </Button>
        <Button auto onClick={() => setShowPallete(true)} scale={1}>
          Show Pallete
        </Button>
        <Button onClick={addLayer}>Submit Layer</Button>
      </Page.Footer>
    </Page>
  );
}

export default Session;
