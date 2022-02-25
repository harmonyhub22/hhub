import React, { Component,useState, useEffect } from "react";
import {Button, Page, Text, GeistProvider, CssBaseline, Table } from '@geist-ui/core'
import io from "socket.io-client";
const ENDPOINT = "http://localhost:5000";

function Session() {
  const [response, setResponse] = useState("");
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState({});

  const socketInitializer = async () => {
    await fetch("/api/socket");
    const newSocket = io();

    newSocket.on("connect", () => {
      console.log("connected");
    });

    newSocket.on("update-input", (msg) => {
      console.log("input updated!")
    });

    setSocket(newSocket);
  };

  useEffect(() => socketInitializer(), []);

  const onChangeHandler = (e) => {
    setInput(e.target.value);
    socket.emit("input-change", e.target.value);
  };

  const addLayer = () =>{
    alert("added")
  };

  const finishSong = () =>{
    alert("OOOf")
  };

  return (
    <Page>
      <Text h1>Session Page</Text>
      <audio controls>
        <source
          src="https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_1MG.mp3"
          type="audio/mpeg"
        ></source>
      </audio>
      <Button onClick={() => addLayer()}>Submit Layer</Button>
      <Button onClick={() => finishSong()}>Finish Song</Button>
      <input
        placeholder="Type something"
        value={input}
        onChange={onChangeHandler}
      />
    </Page>
  );
}

export default Session