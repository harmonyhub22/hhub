import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

const Library = () => {
  const Router = useRouter();
  return (
    <div>
      <Navbar />
      <h1>Your Library</h1>
    </div>
  );
};

export default Library;
