import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

const Discover = () => {
  const Router = useRouter();
  return (
    <div>
      <Navbar />
      <h1>Discover New Songs</h1>
    </div>
  );
};

export default Discover;
