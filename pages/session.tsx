import React, { Component,useState, useEffect } from "react";
import {Button, Page, Text, GeistProvider, CssBaseline, Table } from '@geist-ui/core'
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:5000";


function Session() {
  
  const [response, setResponse] = useState("");


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
        <source src = "https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_1MG.mp3" type = "audio/mpeg"></source> 
      </audio>
      <Button onClick = {() => addLayer()}>Submit Layer</Button>
      <Button onClick = {() => finishSong()}>Finish Song</Button>
    </Page>
  );
}

export default Session