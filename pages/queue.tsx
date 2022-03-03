import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { joinWaitQueue } from "../components/Session";
import { SocketContext } from "../context/socket";
import SessionMade from "../interfaces/socket-data/session_made";

const Queue = (): React.ReactNode => {
  const [joinedTime, setJoinedTime] = useState<Date>();
  const router = useRouter();

  const socket = useContext(SocketContext);

  useEffect(() => {
    const moveToSession = (data:SessionMade) => {
      console.log(data);
      router.push({
          pathname: "/sessions/" + data.sessionId,
          query: { id: data.sessionId }
      });
    };
    const joinQueue = async () => {
      socket.on('session_made', moveToSession);
      const queue = await joinWaitQueue();
      if (queue === null || queue === undefined)
        return;
      setJoinedTime(queue.timeEntered);
    };
    joinQueue();
    return () => {
      // socket.off('session_made', moveToSession); // destroy hooks
    };
  }, [router, socket]);

  return (
    <>
      <h1>Queue Loading Page</h1>
      <p>Join at time: {joinedTime}</p>
    </>
  );
};

export default Queue;