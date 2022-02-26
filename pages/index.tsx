import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  console.log(process.env.SERVER_URL)
  return (
    <div className={styles.container}>
        <main className={styles.main}>
            <a
                href="http://localhost:3001/session"
                className={styles.card}
            >
            <h2>New Song</h2>
            <p>Match with a friend and enter a song session!</p>
            </a>
        </main>
    </div>
  );
};

export default Home;
