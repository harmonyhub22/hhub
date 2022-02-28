import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

const Tutorial = () => {
  const Router = useRouter();
  return (
    <>
      <Navbar />
      <h1>How to use Harmony Hub</h1>
    </>
  );
};

export default Tutorial;
