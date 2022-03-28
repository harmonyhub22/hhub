import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

const Library = () => {
  const Router = useRouter();
  return (
    <>
      <Navbar />
      <h1>Your Library</h1>
    </>
  );
};

export default Library;
