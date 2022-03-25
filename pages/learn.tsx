import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import { Page, Text, Divider, Link } from "@geist-ui/core";

const Learn = () => {
  const Router = useRouter();
  return (
    <Page>
      <Navbar />
      <Text h1>Learn Music Theory</Text>
      <Text>Looking to learn what things mean? We got your back!</Text>

      <Text h3>Tempo</Text>
      <Text>
        Tempo is the underlying beat of the song. This is what keeps your song together so that
        it has structure. It is what plays in the background as you add to your song.
      </Text>
      <Link href="#" icon color>Learn more</Link>
      <Divider /> {/* --------------------------------------------------------------------- */}
      <Text h3>Time Signature</Text>
      <Text>
        
      </Text>
      <Link href="#" icon color>Learn more</Link>
      <Divider /> {/* --------------------------------------------------------------------- */}
      <Text h3>Rhythm</Text>
      <Text>
        
      </Text>
      <Link href="#" icon color>Learn more</Link>
      <Divider /> {/* --------------------------------------------------------------------- */}
    </Page>
  );
};

export default Learn;
