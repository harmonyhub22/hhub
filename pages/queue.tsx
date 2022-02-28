import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { joinWaitQueue } from "../components/Session";

const Queue = (): React.ReactNode => {
  const [socket, setSocket] = useState();
  const [joinedTime, setJoinedTime] = useState();
  const Router = useRouter();

  const joinQueue = async () => {
    const queueResponse = await joinWaitQueue();
    console.log(queueResponse);
    setJoinedTime(queueResponse.timeEntered);
  }

  useEffect(() => {
    joinQueue();
  }, []);

  return (<>
      <h1>Queue Loading Page</h1>
      <p>Join at time: {joinedTime}</p>
    </>
  );
};

export default Queue;