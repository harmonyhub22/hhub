import React, { Component, useState, useEffect } from 'react';
import { Button, Link, Page, Text } from '@geist-ui/core';
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar';
import { joinWaitQueue } from '../components/Session';

const Home = () => {
    const router = useRouter();

    // match with partner, and then route to session page with new session id
    const enterSession = async () => {

        router.push({
            pathname: '/queue'
        });
    };

    return (
        <>
        <Navbar/>
        <div>
            <h1>Harmony Hub</h1>
        </div>
        
        <Button shadow type="secondary" id="btn-new-session" onClick={enterSession}>
            New Session
        </Button>
        </>
    );
};

export default Home;
