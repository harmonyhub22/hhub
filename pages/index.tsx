import React, { useState, useEffect } from 'react';
import { Button } from '@geist-ui/core';
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar';
import { getLiveSession } from '../components/Session';

const Home = () => {
    const [liveSessionId, setLiveSessionId] = useState<string>();
    const router = useRouter();

    // match with partner, and then route to session page with new session id
    const enterQueue = async () => {
        router.push({
            pathname: '/queue'
        });
    };

    const checkLiveSession = async () => {
        const liveSession = await getLiveSession();
        if (liveSession !== null)
            setLiveSessionId(liveSession.sessionId);
    };

    const enterLiveSession = async () => {
        if (liveSessionId === null || liveSessionId === undefined)
            return;
        router.push({
            pathname: "/sessions/" + liveSessionId,
            query: { id: liveSessionId }
        });
    };

    useEffect(() => {
        checkLiveSession();
    }, []);

    return (
        <>
        <Navbar/>
        <div>
            <h1>Harmony Hub</h1>
        </div>
        
        <Button shadow type="secondary" id="btn-new-session" onClick={enterQueue}>
            Join a New Session
        </Button>

        {liveSessionId !== null && liveSessionId !== undefined &&
        <Button shadow type="success" id="btn-new-session" onClick={enterLiveSession}>
            Join your Live Session
        </Button>
        }
        </>
    );
};

export default Home;
