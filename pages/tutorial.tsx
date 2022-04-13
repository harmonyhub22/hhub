import { Page, Text } from "@geist-ui/core";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

const Tutorial = () => {
  const Router = useRouter();
  return (
    <>
      <Navbar />
      <Page className="tutorial">
        <div>
          <Text h1>Tutorial</Text>
          <Text h4>How to use Harmony Hub!</Text>
          <iframe width="720" height="520" src="https://youtube.com/embed/JBqOLxqZ4L8"></iframe>
        </div>
      </Page>
    </>
  );
};

export default Tutorial;
