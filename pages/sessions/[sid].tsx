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
  Input
} from "@geist-ui/core";
import {
  Drum1,
  Drum2,
  Drum3,
  Piano1,
  Piano2,
  Piano3,
  Guitar1,
  Guitar2,
  Guitar3,
  Bass1,
  Bass2,
  Bass3,
  PlaySong,
  StopSong,
//   FocusLayer1,
//   FocusLayer2,
} from "../../components/palette/buttons";
// import { io } from "socket.io-client";
import { config } from "../../components/config";
import { saveAs } from "file-saver";
// import { getCurrentMember } from "../../components/Helper";
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
  const [selectedPattern, setSelectedPattern] = useState();
  const [numRepeats, setNumRepeats] = useState();

  const router = useRouter();
  
  const socket = useContext(SocketContext);
  const player = useContext(MemberContext);
  const sessionId = router.query.id;
  
  
  //   const [layers, setLayers] = useState([]);
  //   const [rows, setRows] = useState([]);

  const rows = [
    { id: 1, title: "Player 1 layer" },
    { id: 2, title: "Player 2 layer" },
  ];

  const layers = [
    {
      id: 1,
      group: 1,
      title: "item 1",
      start_time: moment(),
      end_time: moment().add(1, "hour"),
    },
    {
      id: 2,
      group: 2,
      title: "item 2",
      start_time: moment().add(-0.5, "hour"),
      end_time: moment().add(0.5, "hour"),
    },
    {
      id: 3,
      group: 1,
      title: "item 3",
      start_time: moment().add(2, "hour"),
      end_time: moment().add(3, "hour"),
    },
  ];

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
    setSelectedPattern(name);
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
  }

  const numRepeatsBoxHandler = (e) => {
      setNumRepeats(e.target.value);
  }

  const paletteCell = (instrumentFunc, instrumentName) => {
    return (
      <td>
        <div className="table-palette-buttonframe">
          <button className="button-palette" role="button" onClick={instrumentFunc}>
            {instrumentName}
          </button>
        </div>
      </td>
    );
  };

//   useEffect(() => {
//   }, []);

  const addLayer = async () => {
    const newLayer: Layer = {
        startTime: 0,
        endTime: 10,
        numRepeats: 1,
        userId: '2',
        file: 'hi'
    };

    const dataToEmit = {
        layer: newLayer,
        sessionId: sessionId
    }
    socket.emit("add_layer", dataToEmit);

    // because we cant send json data and audio data at the same time, we must do 2 API calls
    // POST request to make new layer with metadata
    // const response = await fetch(config.server_url, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   // send the start time, end time, number of repeats, user id, and session id
    //   body: JSON.stringify(newLayer),
    // });

    // PUT request to this layer to actually send the audio file

    
    // set layers state
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

  return (
    <Page>
      <Head>
        <h3>Your song session! Add a layer to your song with your partner!</h3>
      </Head>
      <div>
        <Timeline
          groups={rows}
          items={layers}
          defaultTimeStart={moment().add(-12, "hour")}
          defaultTimeEnd={moment().add(12, "hour")}
        />
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
            <Input
              value={numRepeats}
              onChange={numRepeatsBoxHandler}
              placeholder="Enter a number"
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
