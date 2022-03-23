import React, { useState, useEffect, useContext } from "react";
import { Button, Spacer } from "@geist-ui/core";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import { getLiveSession } from "../api/Session";
import { SocketContext } from "../context/socket";
import * as Tone from "tone";
import {
  SingleHomeAnimation,
  SingleNode,
  DoubleNote,
  DoubleHomeAnimation,
} from "../components/animations/AnimationPic";

const Home = () => {
  const [liveSessionId, setLiveSessionId] = useState<string>();
  const router = useRouter();

  const socket = useContext(SocketContext);

  // match with partner, and then route to session page with new session id
  const enterQueue = async () => {
    router.push({
      pathname: "/queue",
    });
  };

  const checkLiveSession = async () => {
    const liveSession = await getLiveSession();
    if (liveSession === null || liveSession === undefined) return;
    setLiveSessionId(liveSession.sessionId);
  };

  const enterLiveSession = async () => {
    if (liveSessionId === null || liveSessionId === undefined) return;
    socket.emit("join-session", { sessionId: liveSessionId });
    router.push({
      pathname: "/sessions/" + liveSessionId,
    });
  };

  const sendMsg = () => {
    socket.emit("message", "test message");
  };

  useEffect(() => {
    checkLiveSession();
  }, []);

  return (
    <>
      <Navbar />
      <div className="home">
        <div className="button-images">
          <SingleHomeAnimation />
        </div>
        <div className="home-button">
          <SingleNode />
          <div className="button-middle">
            <div className="button1">
              {(liveSessionId === null || liveSessionId === undefined) && (
                <Button
                  shadow
                  type="secondary"
                  id="btn-new-session"
                  onClick={enterQueue}
                >
                  Join a New Session
                </Button>
              )}
            </div>
            <div className="button2">
              {liveSessionId !== null && liveSessionId !== undefined && (
                <Button
                  shadow
                  type="success"
                  id="btn-new-session"
                  onClick={enterLiveSession}
                >
                  Join your Live Session
                </Button>
              )}
            </div>
            <div className="button3">
              <Button
                shadow
                type="secondary"
                id="btn-new-session"
                onClick={sendMsg}
              >
                Ping Message
              </Button>
            </div>
            <DoubleNote />
          </div>
        </div>
        <div className="home-images">
          <DoubleHomeAnimation />
        </div>
      </div>
    </>
  );
};

export default Home;
