import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { GeistProvider, CssBaseline } from '@geist-ui/core'
import { useEffect, useState } from 'react';
import { getCurrentMember } from '../components/Helper';

function MyApp({ Component, pageProps }: AppProps) {

  const [member, setMember] = useState();

  const fetchCurrentMember = async () => {
    const member = await getCurrentMember();
    //console.log(member)
    setMember(member);
  }

  useEffect(() => {
    fetchCurrentMember();
  }, []);

  return (
    <GeistProvider>
      <CssBaseline />
      <Component {...pageProps} />
    </GeistProvider>
  )
}

export default MyApp
