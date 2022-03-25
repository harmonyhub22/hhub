import React, { useContext, useEffect, useState } from "react";
import { Page } from "@geist-ui/core";
import { MemberContext } from "../../context/member";
import { SocketContext } from "../../context/socket";
import Session from "../../components/sessions/Session";
import { useRouter } from "next/router";
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
    <Page>
      <Session member={member} socket={socket}  />
    </Page>
  );
};

export default SessionPage;