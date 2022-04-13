import { Page, Text } from "@geist-ui/core";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

const Tutorial = () => {
  const Router = useRouter();
  return (
    <>
      <Navbar />
      <Page className="tutorial">
        <div style={{display: 'flex', width: '100%', justifyContent: "center", textAlign: 'center', flexDirection: 'column'}}>
          <Text h1>Tutorial</Text>
          <Text h4>How to use Harmony Hub!</Text>
        </div>
        <div className="video" style={{position: "relative",paddingBottom: "56.25%",paddingTop: 25,height: 0, justifyContent: "center"}}>
          <iframe style={{position: "absolute",top: 0,left: 0,width: "80%",height: "80%"}} src={`https://www.youtube.com/embed/JBqOLxqZ4L8`}frameBorder="0"/>
        </div>
      </Page>
    </>
  );
};

export default Tutorial;
