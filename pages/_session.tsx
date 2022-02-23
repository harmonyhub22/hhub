import React, { Component,useState, useEffect } from "react";
import {Button, Page, Text, GeistProvider, CssBaseline } from '@geist-ui/core'
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:5000";
function Session() {
  const [response, setResponse] = useState("");

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("/queuejoin", data => {
      setResponse(data);
    });
  }, []);

  return (
    <Page>
      <Text h1>Session Page</Text>
      <Button>Submit</Button>
      <p>
      It's <time dateTime={response}>{response}</time>
      </p>
    </Page>
  );
}

export default Session