import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { GeistProvider, CssBaseline } from '@geist-ui/core'
import { useEffect, useState } from 'react';
import { getCurrentMember } from '../components/Helper';
import Member from '../interfaces/models/Member';
import { SocketContext } from '../context/socket';
import { createSocket } from '../components/init-socket';

function MyApp({ Component, pageProps }: AppProps) {

  const [member, setMember] = useState<Member>();

  const [socket, setSocket] = useState<any>();

  const fetchCurrentMember = async () => {
    const fetchedMember = await getCurrentMember();
    console.log(fetchedMember)
    setMember(fetchedMember);
  }

  useEffect(() => {
    if (socket === null || socket === undefined) 
      setSocket(createSocket());
    fetchCurrentMember();
  }, [socket]);

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
