import React, { Component,useState, useEffect } from 'react';
import { Button, Text } from '@geist-ui/core';

const ENDPOINT = "http://localhost:5000";

export default function NewSession() {
    const [loading, setLoading] = React.useState(false);

    // match with partner, and then route to session page
    const enterSession = async () => {
        setLoading(true);

        fetch(ENDPOINT + "/newSession", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            MEMBERID: 123, // not sure what member id is
            GENREID: "dff3c144-eb29-41d3-82ea-9bcd200fc891",
        }),
        })
        .then((res) => res.json())
        .then((x) => {
            const sessionId = x.
        });
    };

  if (loading) {
    return <div>Loading...</div>
  }
  else {
    return (
    <div>
        <Text>Genre: Alt (id = dff3c144-eb29-41d3-82ea-9bcd200fc891)</Text>
        <Button onClick={enterSession}>Enter session with chosen genre!</Button>
    </div>
    );
  }
}
