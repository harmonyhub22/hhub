import React, { useContext, useEffect, useState } from "react";
import { Page, Text } from "@geist-ui/core";
import { MemberContext } from "../../context/member";
import { SocketContext } from "../../context/socket";
import Session from "../../components/sessions/Session";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";

const SessionPage = () => {
  const router = useRouter();
  const member = useContext(MemberContext);
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (typeof router.query?.sessionId === "string") {
      window.localStorage.setItem('sessionId', router.query.sessionId);
    }
  }, [router.query.sessionId]);

  return (
    <>
      <Navbar />
      <Session member={member} socket={socket}  />
    </>
  );
};

export default SessionPage;