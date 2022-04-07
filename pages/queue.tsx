import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { joinWaitQueue } from "../api/Session";
import { SocketContext } from "../context/socket";
import SessionMade from "../interfaces/socket-data/session_made";
import Navbar from "../components/Navbar";
import { Button, Loading } from "@geist-ui/core";

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

  const leaveQueue = () => {
    
  };

  return (
    <>
      <Navbar />
      <div className="queue-page">
        <h1>Waiting for a match!</h1>
        <p>Join at time: {joinedTime}</p>
        <Loading scale={15} />
        <Button onClick={leaveQueue}>
          Leave Queue
        </Button>
      </div>
    </>
  );
};

export default Queue;
