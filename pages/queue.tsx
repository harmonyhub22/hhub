import { useRouter } from "next/router";
import { useState } from "react";
import Navbar from "../components/Navbar";

const Queue = (): React.ReactNode => {
  const [socket, setSocket] = useState();
  const Router = useRouter();

  

  return (
    <div>
      <Navbar />
      <h1>Queue Page</h1>
    </div>
  );
};

export default Queue;