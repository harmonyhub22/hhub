import React, { useContext, useEffect, useState } from "react";
import { Page, Text } from "@geist-ui/core";
import { MemberContext } from "../../context/member";
import { SocketContext } from "../../context/socket";
import Session from "../../components/sessions/Session";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
// import Timer from "../../components/Timer"

const SessionPage = () => {
  const router = useRouter();
  const member = useContext(MemberContext);
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (typeof router.query?.sid === "string") {
      window.localStorage.setItem('sid', router.query.sid);
    }
  }, [router.query.sid]);

  return (
    <>
      <Navbar />
      {/*<Text h4 style={{textAlign: 'center', marginBottom: '0px', marginTop: '10px', minHeight: '40px'}}>Your Collaborative Session</Text>*/}
      <Session member={member} socket={socket}  />
    </>
  );
};

export default SessionPage;