import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { GeistProvider, CssBaseline } from '@geist-ui/core'
import { useEffect } from 'react';
import { ping, getCurrentUser } from '../components/Helper';

function MyApp({ Component, pageProps }: AppProps) {

  const fetchPing = async () => {
    await ping();
  };

  useEffect(() => {
    fetchPing();
    getCurrentUser();
  });

  return (
    <GeistProvider>
      <CssBaseline />
      <Component {...pageProps} />
    </GeistProvider>
  )
}

export default MyApp
