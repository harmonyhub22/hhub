import React, { useContext, useEffect, useState } from "react";
import { Page, Drawer, useModal, Button } from "@geist-ui/core";
import { MemberContext } from "../../context/member";
import { SocketContext } from "../../context/socket";
import Palette from "../../components/ui/Palette";
import Session from "../../components/sessions/Session";
import { useRouter } from "next/router";
import { IoIosColorPalette } from "react-icons/io";
import Timer from "../../components/Timer"

const SessionPage = () => {
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

      <div className="palette-open-button">
        <Button type="secondary-light" style={{borderRadius: '6px 6px 0px 0px'}}
          onClick={() => setShowPalette(true)} icon={<IoIosColorPalette />}>
          Open Palette
        </Button>
      </div>
      <Drawer
        visible={showPalette}
        onClose={() => setShowPalette(false)}
        placement="right"
      >
        <Drawer.Content>
          <Palette />
        </Drawer.Content>
      </Drawer>
    </Page>
  );
};

export default SessionPage;