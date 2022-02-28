import React, { Component, useState, useEffect } from "react";
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
import io from "socket.io-client";
import { saveAs } from "file-saver";

const ENDPOINT = "http://localhost:5000";
const socket = io(ENDPOINT, {transports: ['websocket']});

function Session() {
  const [response, setResponse] = useState("");
  const [input, setInput] = useState("");
  //const [socket, setSocket] = useState({});
  const { visible, setVisible, bindings } = useModal();
  const [showPallete, setShowPallete] = React.useState(false);

//   const socketInitializer = async () => {
//     await fetch("/api/socket");
//     const newSocket = io();

//     newSocket.on("connect", () => {
//       console.log("connected");
//     });

//     newSocket.on("update-input", (msg) => {
//       console.log("input updated!");
//     });

//     setSocket(newSocket);
//   };

  //useEffect(() => socketInitializer(), []);

  const onChangeHandler = (e) => {
    setInput(e.target.value);
    socket.emit("input-change", e.target.value);
  };

  const addLayer = () => {
    alert("added");
    socket.emit("addlayer", {
        data: 'im a layer'
    });
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
  
  return (
    <Page>
      <Text h1>Session Page</Text>
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
        <input
          placeholder="Type something"
          value={input}
          onChange={onChangeHandler}
        />
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
      </Grid.Container>
    </Page>
  );
}

export default Session;
