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
import {
  PlaySong,
  StopSong,
  //   FocusLayer1,
  //   FocusLayer2,
} from "../../components/palette/buttons";
import { io } from "socket.io-client";
import { config } from "../../components/config";
import { saveAs } from "file-saver";
// import { getCurrentMember } from "../components/Helper";
import Timeline from "../../components/timeline/_timeline";
import moment from "moment";
import Head from "next/head";
import Layer from "../../interfaces/models/Layer";
import { MemberContext } from "../../context/member";
import { SocketContext } from "../../context/socket";

function Session() {
  const [response, setResponse] = useState("");
  const { visible, setVisible, bindings } = useModal();
  const [showPallete, setShowPallete] = React.useState(false);
  const [selectedPattern, setSelectedPattern] = useState("");
  const [numRepeats, setNumRepeats] = useState(0);
  const [startMeasure, setStartMeasure] = useState(0);
  const [maxMeasuresNeeded, setMaxMeasuresNeeded] = useState(1);
  const [songLength, setSongLength] = useState();
  var tableHeaders = [<th>M1</th>];
  var tableRows = [];

  const router = useRouter();

  const socket = useContext(SocketContext);
  const player = useContext(MemberContext);
  const sessionId = router.query.id;

  const [layers, setLayers] = useState([]);

  const presetPatterns = [
    { name: "Drum1" },
    { name: "Drum2" },
    { name: "Drum3" },
    { name: "Piano1" },
    { name: "Piano2" },
    { name: "Piano3" },
    { name: "Bass1" },
    { name: "Bass2" },
    { name: "Bass3" },
    { name: "Guitar1" },
    { name: "Guitar2" },
    { name: "Guitar3" },
  ];

  const handlePatternClick = (name) => {
    // selectedPattern === name
    //   ? setSelectedPattern("")
    //   : setSelectedPattern(name);
    console.log("playing");
    switch (name) {
      case "Drum1":
        Drum1();
        break;
      case "Drum2":
        Drum2();
        break;
      case "Drum3":
        Drum3();
        break;
      case "Bass1":
        Bass1();
        break;
      case "Bass2":
        Bass2();
        break;
      case "Bass3":
        Bass3();
        break;
      case "Guitar1":
        Guitar1();
        break;
      case "Guitar2":
        Guitar2();
        break;
      case "Guitar3":
        Guitar3();
        break;
      case "Piano1":
        Piano1();
        break;
      case "Piano2":
        Piano2();
        break;
      case "Piano3":
        Piano3();
        break;
      default:
        break;
    }
  };

  const numRepeatsBoxHandler = (e) => {
    setNumRepeats(e.target.value);
  };

  const startMeasureBoxHandler = (e) => {
    setStartMeasure(e.target.value);
  };

  const paletteCell = (instrumentFunc, instrumentName) => {
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
      console.log("DEBUG: startTime = " + startTime);
      console.log("DEBUG: endTime = " + endTime);

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
      setLayers(totalLayers);

      const measuresNeeded = startMeasure + 4 * (numRepeats + 1);
      console.log("DEBUG: measures needed = " + measuresNeeded);
      if (measuresNeeded > maxMeasuresNeeded) {
        setMaxMeasuresNeeded(measuresNeeded);
      }

      tableHeaders = [];
      for (let i = 1; i <= maxMeasuresNeeded; i++) {
        tableHeaders.push(<th>M{i}</th>);
      }

      tableRows = totalLayers.map((layer, i) => {
        return (
          <tr key={"layer_" + i}>
            <td aria-colspan={maxMeasuresNeeded}>
              <audio controls style="width: 50px; margin-left: 0px;">
                <source src={layer.file} type="audio/mp3" />
              </audio>
            </td>
          </tr>
        );
      });

      setSelectedPattern("");
      setNumRepeats(0);
      setStartMeasure(0);
    }
  };

  const finishSong = () => {
    alert("TODO");
    // TODO: make backend request to process the finished song (send all of the layers)
    socket.emit("finished");
  };

  const saveFile = () => {
    saveAs(
      "https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_1MG.mp3"
    );
  };

  var drum1Player = null;
  var drum2Player = null;
  var drum3Player = null;
  var piano1Player = null;
  var piano2Player = null;
  var piano3Player = null;
  var guitar1Player = null;
  var guitar2Player = null;
  var guitar3Player = null;
  var bass1Player = null;
  var bass2Player = null;
  var bass3Player = null;

  const Drum1 = () => {
    drum1Player = new Tone.Player("../Drums1.mp3").toDestination();
    Tone.loaded().then(() => {
      drum1Player.start();
    });
  };
  const Drum2 = () => {
    drum2Player = new Tone.Player("../Drums2.mp3").toDestination();
    Tone.loaded().then(() => {
      drum2Player.start();
    });
  };
  const Drum3 = () => {
    drum3Player = new Tone.Player("../Drums3.mp3").toDestination(); 
    Tone.loaded().then(() => {
      drum3Player.start();
    });
  };
  const Piano1 = () => {
    piano1Player = new Tone.Player("../Piano1.mp3").toDestination();
    Tone.loaded().then(() => {
      piano1Player.start();
    });
  };
  const Piano2 = () => {
    piano2Player = new Tone.Player("../Piano2.mp3").toDestination();
    Tone.loaded().then(() => {
      piano2Player.start();
    });
  };
  const Piano3 = () => {
    piano3Player = new Tone.Player("../Piano3.mp3").toDestination();
    Tone.loaded().then(() => {
      piano3Player.start();
    });
  };
  const Bass1 = () => {
      console.log("running bass 1");
      bass1Player = new Tone.Player("../Bass1.mp3").toDestination();
      Tone.loaded().then(() => {
        bass1Player.start();
      });
  }
  const Bass2 = () => {
      bass2Player = new Tone.Player("../Bass2.mp3").toDestination();
      Tone.loaded().then(() => {
        bass2Player.start();
      });
  }
  const Bass3 = () => {
    bass3Player = new Tone.Player("../Bass3.mp3").toDestination();
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

  useEffect(() => {
  }, []);

  return (
    <Page>
      <Head>
        <h3>Your song session! Add a layer to your song with your partner!</h3>
        <p>Song BPM: 130</p>
      </Head>
      <div>
        {/* <Timeline
          groups={rows}
          items={layers}
          defaultTimeStart={moment().add(-12, "hour")}
          defaultTimeEnd={moment().add(12, "hour")}
        /> */}
        <table>
          {tableHeaders}
          {tableRows}
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
            {/* <tfoot>
              <tr>
                <td>
                  <button onClick={PlaySong}>Play</button>
                </td>
                <td>
                  <button onClick={StopSong}>Mute</button>
                </td>
              </tr>
            </tfoot> */}
            <tbody>
              <tr>
                {paletteCell(Drum1, "Drum1")}
                {paletteCell(Drum2, "Drum2")}
                {paletteCell(Drum3, "Drum3")}
              </tr>
              <tr>
                {paletteCell(Piano1, "Piano1")}
                {paletteCell(Piano2, "Piano2")}
                {paletteCell(Piano3, "Piano3")}
              </tr>
              <tr>
                {paletteCell(Bass1, "Bass1")}
                {paletteCell(Bass2, "Bass2")}
                {paletteCell(Bass3, "Bass3")}
              </tr>
              <tr>
                {paletteCell(Guitar1, "Guitar1")}
                {paletteCell(Guitar2, "Guitar2")}
                {paletteCell(Guitar3, "Guitar3")}
              </tr>
            </tbody>
          </table>
          <br />
          <table className="table-palette">
            <thead>
              <tr>
                <th>Palette:</th>
                <th className="table-palette-th2">ROCK</th>
              </tr>
            </thead>
            <tfoot>
              <tr>
                <td>
                  <button>RESET</button>
                </td>
                <td>
                  <button>SAVE</button>
                </td>
              </tr>
            </tfoot>
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
          </table>
          <br />

          <div id="layer-settings-section">
            <Drawer.Title>Layer settings</Drawer.Title>
            <h5>Number of repeats</h5>
            <p>(0 means it will play once)</p>
            <Input
              value={numRepeats}
              onChange={numRepeatsBoxHandler}
              placeholder="Enter a number, like 0, 4, or 16..."
            />
            <h5>Start measure</h5>
            <p>(The beginning of the song is measure 0)</p>
            <Input
              value={startMeasure}
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
        <Modal.Action passive onClick={() => saveFile()}>
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
