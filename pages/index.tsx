import React, { useState, useEffect, useContext } from "react";
import { Button } from "@geist-ui/core";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import { SocketContext } from "../context/socket";
import { getLiveSession } from "../api/Session";
import SessionInterface from "../interfaces/models/SessionInterface";

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
    const liveSession: SessionInterface|null = await getLiveSession();
    if (liveSession === null) return;
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
      <div>
        <h1>Harmony Hub</h1>
      </div>

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

      <Button shadow type="secondary" id="btn-new-session" onClick={sendMsg}>
        Ping Message
      </Button>
    </>
  );
};

export default Home;
