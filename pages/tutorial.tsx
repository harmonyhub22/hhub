import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

const Tutorial = () => {
  const Router = useRouter();
  return (
    <div>
      <Navbar />
      <h1>How to use Harmony Hub</h1>
    </div>
  );
};

export default Tutorial;
