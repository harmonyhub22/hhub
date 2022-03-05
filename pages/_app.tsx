import "../styles/globals.css";
import type { AppProps } from "next/app";
import { GeistProvider, CssBaseline } from "@geist-ui/core";
import { useEffect } from "react";
import { ping } from "../components/Helper";
import "../components/timeline/lib/Timeline.scss";

function MyApp({ Component, pageProps }: AppProps) {
  const fetchPing = async () => {
    await ping();
  };

  useEffect(() => {
    fetchPing();
  });

  return (
    <GeistProvider>
      <CssBaseline />
      <Component {...pageProps} />
    </GeistProvider>
  );
}

export default MyApp;
