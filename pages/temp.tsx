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
// import { config } from "../../components/config";
//import { saveAs } from "file-saver";
// import { getCurrentMember } from "../../components/Helper";
import Timeline from "../components/timeline/_timeline";
import moment from "moment";

function Session() {
  const [response, setResponse] = useState("");
  //   const [socket, setSocket] = useState(io);
  const { visible, setVisible, bindings } = useModal();
  const [showPallete, setShowPallete] = React.useState(false);
  //   const router = useRouter();
  const [layers, setLayers] = useState([]);
  const [rows, setRows] = useState([]);

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

  useEffect(() => {
    // startSession();
  }, []);

  const addLayer = () => {
    alert("added");
    // socket.emit("addlayer", {
    //   data: "im a layer",
    // });
  };

  const finishSong = () => {
    alert("TODO");
    // TODO: make backend request to process the finished song (send all of the layers)
  };

  //   const saveFile = () => {
  //     saveAs(
  //       "https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_1MG.mp3"
  //     );
  //   };

  return (
    <Page>
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
      <div>
        <Timeline
          groups={groups}
          items={layers}
          defaultTimeStart={moment().add(-12, "hour")}
          defaultTimeEnd={moment().add(12, "hour")}
        />
      </div>
    </Page>
  );
}

export default Session;
