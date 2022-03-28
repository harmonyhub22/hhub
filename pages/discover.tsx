import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

const Discover = () => {
  const Router = useRouter();
  return (
    <>
      <Navbar />
      <h1>Discover New Songs</h1>
    </>
  );
};

export default Discover;
