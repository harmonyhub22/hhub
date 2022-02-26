import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

const Learn = () => {
  const Router = useRouter();
  return (
    <div>
      <Navbar />
      <h1>Learn Music Theory</h1>
    </div>
  );
};

export default Learn;
