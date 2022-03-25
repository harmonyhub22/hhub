import "../styles/style.scss";
import type { AppProps } from "next/app";
import { GeistProvider, CssBaseline } from "@geist-ui/core";
import { useEffect, useMemo, useState } from "react";
import { getCurrentMember } from "../api/Helper";
import Member from "../interfaces/models/Member";
import { SocketContext } from "../context/socket";
import { createSocket } from "../api/InitSockets";
import { MemberContext } from "../context/member";
import { useRouter } from "next/router";
import { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps }: AppProps) {
  const [member, setMember] = useState<Member>({} as Member);
  const [socket, setSocket] = useState<any>();
  const router = useRouter();

  const fetchCurrentMember = async () => {
    const fetchedMember = await getCurrentMember();
    console.log(fetchedMember);
    if (fetchedMember !== undefined && fetchedMember !== null) {
      console.log(fetchedMember);
      setMember(fetchedMember);
      if (socket === undefined || socket === null) {
        setSocket(createSocket(fetchedMember.memberId));
      }
    } else {
      console.log("logging in");
      router.push({
        pathname: "/login",
      });
    }
  };

  useEffect(() => {
    fetchCurrentMember();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GeistProvider>
      <CssBaseline />
      <MemberContext.Provider value={member}>
        <SocketContext.Provider value={socket}>
          <Component {...pageProps} />
        </SocketContext.Provider>
      </MemberContext.Provider>
      <Toaster 
        position="top-left"
        toastOptions={{
          className: '.toast-messages',
          duration: Infinity,
        }}/>
    </GeistProvider>
  );
}

export default MyApp;
