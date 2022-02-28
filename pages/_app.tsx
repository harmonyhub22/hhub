import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { GeistProvider, CssBaseline } from '@geist-ui/core'
import { useEffect, useState } from 'react';
import { ping, getCurrentMember } from '../components/Helper';

function MyApp({ Component, pageProps }: AppProps) {

  const [member, setMember] = useState();

  const fetchPing = async () => {
    await ping();
  };

  const fetchCurrentMember = async () => {
    const member = await getCurrentMember();
    console.log(member)
    setMember(member);
  }

  useEffect(() => {
    fetchPing();
    // fetchCurrentMember();
  });

  return (
    <GeistProvider>
      <CssBaseline />
      <Component {...pageProps} />
    </GeistProvider>
  )
}

export default MyApp
