import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { joinWaitQueue } from "../components/Session";
import { config } from "../components/config";
import { io } from "socket.io-client";

const Queue = (): React.ReactNode => {
  const [socket, setSocket] = useState(null);
  const [joinedTime, setJoinedTime] = useState();
  const [sessionId, setSessionId] = useState();
  const router = useRouter();

  const joinQueue = async () => {
    const queueResponse = await joinWaitQueue();
    console.log(queueResponse);
    setJoinedTime(queueResponse.timeEntered);

    // now join a session by connecting to the web socket
    const newSocket = io(config.server_url);
    setSocket(newSocket);
  }

  socket.on('session_made', function(data) {
    setSessionId(data.sessionId);
    router.push({
        pathname: "/sessions/" + sessionId,
        query: { id: sessionId }
    });
  }); 

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