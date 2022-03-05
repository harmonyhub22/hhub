import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { GeistProvider, CssBaseline } from '@geist-ui/core'
import { useEffect, useState } from 'react';
import { getCurrentMember } from '../components/Helper';
import "react-calendar-timeline/src/lib/Timeline.scss";
import Member from '../interfaces/models/Member';
import { SocketContext } from '../context/socket';
import { createSocket } from '../components/init-socket';

function MyApp({ Component, pageProps }: AppProps) {

  const [member, setMember] = useState<Member>();

  const [socket, setSocket] = useState<any>();

  const fetchCurrentMember = async () => {
    const fetchedMember = await getCurrentMember();
    console.log(fetchedMember)
    if (fetchedMember?.memberId !== member?.memberId)
      setMember(fetchedMember);
  }

  useEffect(() => {
    fetchCurrentMember();
    if ((member !== undefined && member !== null) && (socket === null || socket === undefined)) 
      setSocket(createSocket(member.memberId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [member]);

  return (
    <GeistProvider>
      <CssBaseline />
      <SocketContext.Provider value={socket}>
      <Component {...pageProps} />
      </SocketContext.Provider>
    </GeistProvider>
  )
}

export default MyApp
