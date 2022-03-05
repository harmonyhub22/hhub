import React, { Component, useState, useEffect } from "react";
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
} from "@geist-ui/core";
// import { io } from "socket.io-client";
import { config } from "../components/config";
import { saveAs } from "file-saver";
// import { getCurrentMember } from "../../components/Helper";
import Timeline from "../components/timeline/_timeline";
import moment from "moment";
import Head from "next/head";
import * as Tone from "tone";
import { Player } from "tone";
import Layer from "../interfaces/models/Layer";

function Session() {
  const [response, setResponse] = useState("");
  //   const [socket, setSocket] = useState(io);
  const { visible, setVisible, bindings } = useModal();
  const [showPallete, setShowPallete] = React.useState(false);
  //   const router = useRouter();
  const [layers, setLayers] = useState([]);
  const [rows, setRows] = useState([]);
  const [selectedPattern, setSelectedPattern] = useState();

  //   const sessionId = router.query.id;

  // groups represent our layers
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
    { name: "Guitar3" }
  ];

  var _stopSong = false;
  var paletteNums = ["drums", "piano", "bass", "guitar"];
  var paletteNumsStates = [1, 1, 1, 1];

  function ToneButton0() {
    const player = new Tone.Player("piano_middle_C.mp3").toDestination();
    Tone.loaded().then(() => {
      player.start();
    });
  }

  function ToneButton1() {
    const player = new Tone.Player("piano_C_sharp.mp3").toDestination();
    Tone.loaded().then(() => {
      player.start();
    });
  }

  function ToneButton2() {
    const player = new Tone.Player("piano_D.mp3").toDestination();
    Tone.loaded().then(() => {
      player.start();
    });
  }

  function ToneButton3() {
    const player = new Tone.Player("piano_D_sharp.mp3").toDestination();
    Tone.loaded().then(() => {
      player.start();
    });
  }

  function ToneButton4() {
    const player = new Tone.Player("piano_E.mp3").toDestination();
    Tone.loaded().then(() => {
      player.start();
    });
  }

  function ToneButtonN1() {
    const player = new Tone.Player("kick.mp3").toDestination();
    Tone.loaded().then(() => {
      player.start();
    });
  }

  function ToneButtonN2() {
    const player = new Tone.Player("highhat.mp3").toDestination();
    Tone.loaded().then(() => {
      player.start();
    });
  }

  function ToneButtonN3() {
    const player = new Tone.Player("snare.mp3").toDestination();
    Tone.loaded().then(() => {
      player.start();
    });
  }

  function ToneButtonN4() {
    const player = new Tone.Player("clap.mp3").toDestination();
    Tone.loaded().then(() => {
      player.start();
    });
  }

  function RecordButton() {
    const player = new Tone.Player("metronome.mp3").toDestination();
    Tone.loaded().then(() => {
      player.start();
    });
  }

  function Drum1() {
    paletteNumsStates[0] = 1;
    const player = new Tone.Player(
      "drums" + paletteNumsStates[0] + ".mp3"
    ).toDestination();
    if (!_stopSong) {
      Tone.loaded().then(() => {
        player.start();
      });
    }
  }

  function Drum2() {
    paletteNumsStates[0] = 2;
    const player = new Tone.Player(
      "drums" + paletteNumsStates[0] + ".mp3"
    ).toDestination();
    if (!_stopSong) {
      Tone.loaded().then(() => {
        player.start();
      });
    }
  }

  function Drum3() {
    paletteNumsStates[0] = 3;
    const player = new Tone.Player(
      "drums" + paletteNumsStates[0] + ".mp3"
    ).toDestination();
    if (!_stopSong) {
      Tone.loaded().then(() => {
        player.start();
      });
    }
  }

  function Piano1() {
    paletteNumsStates[1] = 1;
    const player = new Tone.Player(
      "piano" + paletteNumsStates[1] + ".mp3"
    ).toDestination();
    if (!_stopSong) {
      Tone.loaded().then(() => {
        player.start();
      });
    }
  }

  function Piano2() {
    paletteNumsStates[1] = 2;
    const player = new Tone.Player(
      "piano" + paletteNumsStates[1] + ".mp3"
    ).toDestination();
    if (!_stopSong) {
      Tone.loaded().then(() => {
        player.start();
      });
    }
  }

  function Piano3() {
    paletteNumsStates[1] = 3;
    const player = new Tone.Player(
      "piano" + paletteNumsStates[1] + ".mp3"
    ).toDestination();
    if (!_stopSong) {
      Tone.loaded().then(() => {
        player.start();
      });
    }
  }

  function Bass1() {
    paletteNumsStates[2] = 1;
    const player = new Tone.Player(
      "bass" + paletteNumsStates[2] + ".mp3"
    ).toDestination();
    if (!_stopSong) {
      Tone.loaded().then(() => {
        player.start();
      });
    }
  }

  function Bass2() {
    paletteNumsStates[2] = 2;
    const player = new Tone.Player(
      "bass" + paletteNumsStates[2] + ".mp3"
    ).toDestination();
    if (!_stopSong) {
      Tone.loaded().then(() => {
        player.start();
      });
    }
  }

  function Bass3() {
    paletteNumsStates[2] = 3;
    const player = new Tone.Player(
      "bass" + paletteNumsStates[2] + ".mp3"
    ).toDestination();
    if (!_stopSong) {
      Tone.loaded().then(() => {
        player.start();
      });
    }
  }

  function Guitar1() {
    paletteNumsStates[3] = 1;
    const player = new Tone.Player(
      "guitar" + paletteNumsStates[3] + ".mp3"
    ).toDestination();
    if (!_stopSong) {
      Tone.loaded().then(() => {
        player.start();
      });
    }
  }

  function Guitar2() {
    paletteNumsStates[3] = 2;
    const player = new Tone.Player(
      "guitar" + paletteNumsStates[3] + ".mp3"
    ).toDestination();
    if (!_stopSong) {
      Tone.loaded().then(() => {
        player.start();
      });
    }
  }

  function Guitar3() {
    paletteNumsStates[3] = 3;
    const player = new Tone.Player(
      "guitar" + paletteNumsStates[3] + ".mp3"
    ).toDestination();
    if (!_stopSong) {
      Tone.loaded().then(() => {
        player.start();
      });
    }
  }

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

  function PlaySong() {
    var player1 = new Tone.Player(
      "drums" + paletteNumsStates[0] + ".mp3"
    ).toDestination();
    var player2 = new Tone.Player(
      "piano" + paletteNumsStates[1] + ".mp3"
    ).toDestination();
    var player3 = new Tone.Player(
      "bass" + paletteNumsStates[2] + ".mp3"
    ).toDestination();
    var player4 = new Tone.Player(
      "guitar" + paletteNumsStates[3] + ".mp3"
    ).toDestination();
    if (!_stopSong) {
      Tone.loaded().then(() => {
        player1.start();
        player2.start();
        player3.start();
        player4.start();
      });
    }
  }

  function StopSong() {
    if (!_stopSong) {
      _stopSong = true;
    } else {
      _stopSong = false;
    }
  }

  // put the user in their web socket room (room # = session ID)
  //   const startSession = async () => {
  //     const newSocket = io("http://localhost:5000/api");
  //     setSocket(newSocket);
  //     const member = await getCurrentMember();
  //     const data = {
  //       fullName: member.firstname + " " + member.lastname,
  //       sessionId: sessionId,
  //     };
  //     socket.emit("join", data);
  //   };

  const paletteCell = (instrument) => {
      return (
        <td>
            <div className="table-palette-buttonframe">
            <button
                className="button-palette"
                role="button"
                onClick={instrument}
            >
                instrument
            </button>
            </div>
        </td>
      );
  }

  useEffect(() => {
    // var player = new Tone.Player("drums" + paletteNumsStates[0] + ".mp3").toDestination();
    // startSession();
    var player = new Tone.Player(
      "drums" + paletteNumsStates[0] + ".mp3"
    ).toDestination();
  }, []);

  const addLayer = () => {
    const newLayer: Layer = {
        startTime: 0,
        endTime: ,
        numRepeats: ,
        userId: ,
        file: 
    }

    // because we cant send json data and audio data at the same time, we must do 2 API calls
    // POST request to make new layer with metadata
    const response = await fetch(config.server_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // send the start time, end time, number of repeats, user id, and session id
      body: JSON.stringify(newLayer),
    });

    // PUT request to this layer to actually send the audio file

    
    // set layers state

    alert("added");
    // socket.emit("addlayer", {
    //   data: "im a layer",
    // });
  };

  const finishSong = () => {
    alert("TODO");
    // TODO: make backend request to process the finished song (send all of the layers)
  };

  const saveFile = () => {
    saveAs(
      "https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_1MG.mp3"
    );
  };

  //LAYER SONG MP3 NAMES
  var layerTitles = ["drums1", "piano1"];
  var layerPlayer = 1;
  function playLayer() {
    const player = new Tone.Player("layer" + layerPlayer + ".mp3").toDestination();
    Tone.loaded().then(() => {
      player.start();
    });
  }
  function FocusLayer1() { //USE TO PICK THE LAYER THAT WILL PLAY
    layerPlayer = 1;
    playLayer();
  }
  function FocusLayer2() {
    layerPlayer = 2;
    playLayer();
  }

  return (
    <Page>
      {/* <div id="PaletteList" className="palette-list">
          <a href="#" onClick={ShowPalette}>Rock</a>
          <a href="#" onClick={ShowPalette}>Electronic</a>
          <a href="#" onClick={ShowPalette}>Lo-Fi</a>
          <a href="#" onClick={ShowPalette}>Hip-Hop</a>
        </div> */}

      <br></br>

      {/* <Text h1>Session Page</Text>
      <Grid.Container gap={1} justify="flex-end" height="100px">
        <audio controls id="">
          <source
            src="https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_1MG.mp3"
            type="audio/mpeg"
          ></source>
        </audio>
        <Button onClick={addLayer}>Submit Layer</Button>
        <Button auto onClick={() => setVisible(true)}>
          Finish Song
        </Button>
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
        <Button auto onClick={() => setShowPallete(true)} scale={1}>
          Show Pallete
        </Button>
        <Drawer
          visible={showPallete}
          onClose={() => setShowPallete(false)}
          placement="right"
        >
          <Drawer.Title>Pallete</Drawer.Title>
          <Drawer.Subtitle>Pallete will go here</Drawer.Subtitle>
          <Drawer.Content>
            <p>Some content contained within the drawer.</p>
          </Drawer.Content>
        </Drawer>
      </Grid.Container> */}
      <Head>
        <h3>Your song session! Add a layer to your song with your partner!</h3>
      </Head>
      <div>
        <Timeline
          rows={rows}
          layers={layers}
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
                {paletteCell("Drum1")}
                {paletteCell("Drum2")}
                {paletteCell("Drum3")}
              </tr>
              <tr>
                {paletteCell("Piano1")}
                {paletteCell("Piano2")}
                {paletteCell("Piano3")}
              </tr>
              <tr>
                {paletteCell("Bass1")}
                {paletteCell("Bass2")}
                {paletteCell("Bass3")}
              </tr>
              <tr>
                {paletteCell("Guitar1")}
                {paletteCell("Guitar2")}
                {paletteCell("Guitar3")}
              </tr>
            </tbody>
          </table>

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
        </Drawer.Content>
      </Drawer>

      <br></br>
      <Button auto ghost px={0.6} onClick={FocusLayer1}>Play Layer 1</Button>
      <Button auto ghost px={0.6} onClick={FocusLayer2}>Play Layer 2</Button>

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
