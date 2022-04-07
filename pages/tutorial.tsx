import { Page, Text } from "@geist-ui/core";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

const Tutorial = () => {
  const Router = useRouter();
  return (
    <>
      <Navbar />
      <Page>
        <Text h1>Tutorial</Text>
        <Text h4>How to use Harmony Hub!</Text>
      </Page>
    </>
  );
};

export default Tutorial;
