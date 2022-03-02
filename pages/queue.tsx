import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { joinWaitQueue } from "../components/Session";
import { config } from "../components/config";
import { io } from "socket.io-client";
import { createSocket } from "../components/socket";

const Queue = (): React.ReactNode => {
  const [socket, setSocket] = useState(io);
  const [joinedTime, setJoinedTime] = useState();
  const [sessionId, setSessionId] = useState();
  const router = useRouter();

  const joinQueue = async () => {
    // now join a session by connecting to the web socket
    if (!socket) {
      const newSocket = createSocket();
      newSocket.on('session_made', (data) => {
        setSessionId(data.sessionId);
        router.push({
            pathname: "/sessions/" + sessionId,
            query: { id: sessionId }
        });
      }); 
      setSocket(newSocket);
    }
  
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