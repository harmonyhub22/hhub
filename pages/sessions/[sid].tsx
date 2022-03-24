import React, { useContext } from "react";
import { useRouter } from "next/router";
import { Page, Drawer, useModal, Button } from "@geist-ui/core";
import { MemberContext } from "../../context/member";
import { SocketContext } from "../../context/socket";
import Palette from "../../components/ui/Palette";
import Session from "../../components/sessions/Session";
import Timer from "../../components/Timer"
const SessionPage = () => {
  const { visible, setVisible, bindings } = useModal();
  const [showPalette, setShowPalette] = React.useState(false);

  const member = useContext(MemberContext);
  const socket = useContext(SocketContext);

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
