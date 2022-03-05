import { Button, Page, Text } from "@geist-ui/core";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

const Home = () => {
  const router = useRouter();
  const enterSession2 = async () => {
    router.push({
      pathname: "/temp",
    });
  };
  return (
    // <div className={styles.container}>
    //   <main className={styles.main}>
    //     <a href="http://localhost:3001/session" className={styles.card}>
    //       <h2>New Song</h2>
    //       <p>Match with a friend and enter a song session!</p>
    //     </a>
    //   </main>
    // </div>
    <div>
      <Navbar />
      <div>
        <h1>Harmony Hub</h1>
      </div>
      <Button shadow type="secondary" id="btn-new-session">
        New Session
      </Button>
      <Button
        shadow
        type="secondary"
        id="btn-new-session"
        onClick={enterSession2}
      >
        New Session (temp)
      </Button>
    </div>
  );
};

export default Home;
