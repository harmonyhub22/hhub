import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { joinWaitQueue } from "../api/Session";
import { SocketContext } from "../context/socket";
import SessionMade from "../interfaces/socket-data/session_made";
import Navbar from "../components/Navbar";

const Queue = (): React.ReactNode => {
  const [joinedTime, setJoinedTime] = useState<Date>();
  const router = useRouter();

  const socket = useContext(SocketContext);

  useEffect(() => {
    const moveToSession = (data: SessionMade) => {
      console.log(data);
      router.push({
        pathname: "/sessions/" + data.sessionId,
        query: { id: data.sessionId },
      });
    };
    const joinQueue = async () => {
      socket.on("session_made", moveToSession);
      const queue = await joinWaitQueue();
      console.log(queue);
      if (queue === null || queue === undefined) return;
      setJoinedTime(queue.timeEntered);
    };
    joinQueue();
    return () => {
      // socket.off('session_made', moveToSession); // destroy hooks
    };
  }, [router, socket]);

  return (
    <>
      <Navbar />
      <div className="queue-page">
        <h1>Queue loading...</h1>
        <h1>Please wait!</h1>
        <p>Join at time: {joinedTime}</p>
      </div>
    </>
  );
};

export default Queue;
