import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

const Learn = () => {
  const Router = useRouter();
  return (
    <>
      <Navbar />
      <h1>Learn Music Theory</h1>
    </>
  );
};

export default Learn;
