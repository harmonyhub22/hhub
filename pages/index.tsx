import React, { Component, useState, useEffect } from 'react';
import { Button, Page, Text } from '@geist-ui/core';
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar';

const ENDPOINT = "http://localhost:5000";

const Home = () => {
    const router = useRouter();

    const [loading, setLoading] = React.useState(false);

    // match with partner, and then route to session page with new session id
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
            const sessionId = 'fill_me';
            router.push({
                pathname: '/sessions/[sid]',
                query: { 'sid': sessionId },
            });
        });
    };

    if (loading) {
        return (
          <div>
            <h1>Loading session...</h1>
          </div>
        );
    }
    else {
        return (
          <div>
              <Navbar/>
            <div>
                <h1>Harmony Hub</h1>
            </div>
            <Button shadow type="secondary" id="btn-new-session" onClick={enterSession}>
              New Session
            </Button>
          </div>
        );
    }
};

export default Home;
