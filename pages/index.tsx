import React, { useState, useEffect, useContext } from "react";
import { Button, Text, Spinner, Spacer } from "@geist-ui/core";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import { SocketContext } from "../context/socket";
import { getLiveSession } from "../api/Session";
import SessionInterface from "../interfaces/models/SessionInterface";
import {
  DoubleHomeAnimation,
  SingleHomeAnimation,
} from "../components/animations/AnimationPic";
import { motion } from "framer-motion";
import {
  homeSlider,
  slider,
} from "../components/animations/Animation";

const Home = () => {
  const [liveSessionId, setLiveSessionId] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const socket = useContext(SocketContext);

  // match with partner, and then route to session page with new session id
  const enterQueue = async () => {
    setLoading(true);
    router.push({
      pathname: "/queue",
    });
  };

  const checkLiveSession = async () => {
    const liveSession: SessionInterface | null = await getLiveSession();
    if (liveSession === null) return;
    setLiveSessionId(liveSession.sessionId);
  };

  const enterLiveSession = async () => {
    setLoading(true);
    if (liveSessionId === null || liveSessionId === undefined) return;
    socket.emit("join-session", { sessionId: liveSessionId });
    router.push({
      pathname: "/sessions/" + liveSessionId,
    });
  };

  useEffect(() => {
    checkLiveSession();
  }, []);

  return (
    <>
      <Navbar />
      <motion.div className="home-button">
        <div className="home-title">
          <Text
            h1
            style={{
              textAlign: "center",
              color: "#21a0aa",
              fontSize: "4rem",
              fontFamily: "Lobster",
            }}
          >
            Harmony Hub
          </Text>
          <Text
            style={{
              textAlign: "center",
              color: "#3f1844",
              fontSize: "1rem",
              fontFamily: "Inter",
            }}
          >
            Make Music with Friends
          </Text>
        </div>
        <div className="home-live-button">
          {(liveSessionId === null || liveSessionId === undefined) && (
            <Button
              shadow
              type="secondary"
              id="btn-new-session"
              onClick={enterQueue}
              style={{ backgroundColor: "white" }}
              scale={1.3}
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
              style={{ backgroundColor: "white" }}
              scale={2.0}
            >
              Join your Live Session
            </Button>
          )}
        </div>
      </motion.div>
      <motion.div className="home">
        <motion.div
          className="home-single-image"
          variants={slider}
          initial="hidden"
          animate="show"
        >
          <SingleHomeAnimation />
        </motion.div>
        <motion.div
          className="home-images"
          variants={homeSlider}
          initial="hidden"
          animate="show"
        >
          <DoubleHomeAnimation />
        </motion.div>
      </motion.div>
    </>
  );
};

export default Home;
