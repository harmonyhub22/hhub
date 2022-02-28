import React, { Component, useState, useEffect } from 'react';
import { Button, Page, Text } from '@geist-ui/core';
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar';
import { joinWaitQueue } from '../components/Session';

const Home = () => {
    const router = useRouter();

    const [loading, setLoading] = React.useState(false);

    // match with partner, and then route to session page with new session id
    const enterSession = async () => {

        setLoading(true);

        joinWaitQueue();
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
