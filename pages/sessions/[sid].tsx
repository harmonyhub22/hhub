import React, { useContext, useEffect, useState } from "react";
import { Page, Drawer, useModal, Button } from "@geist-ui/core";
import { MemberContext } from "../../context/member";
import { SocketContext } from "../../context/socket";
import Palette from "../../components/ui/Palette";
import Session from "../../components/sessions/Session";
import { useRouter } from "next/router";
import { getLiveSession } from "../../api/Session";

const SessionPage = (props:any) => {
  const { visible, setVisible, bindings } = useModal();
  const [showPalette, setShowPalette] = useState(false);

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
      <Session member={member} socket={socket} />
      <Drawer
        visible={showPalette}
        onClose={() => setShowPalette(false)}
        placement="right"
      >
        <Drawer.Content>
          <Palette />
        </Drawer.Content>
      </Drawer>

      <Page.Footer>
        <Button auto onClick={() => setVisible(true)} type="success">
          Finish Song
        </Button>
        <Button auto onClick={() => setShowPalette(true)} scale={1}>
          Show Pallete
        </Button>
      </Page.Footer>
    </Page>
  );
};

export default SessionPage;