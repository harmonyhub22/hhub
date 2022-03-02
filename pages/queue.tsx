import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { joinWaitQueue } from "../components/Session";
import { config } from "../components/config";
import { io } from "socket.io-client";

const Queue = (): React.ReactNode => {
  const [socket, setSocket] = useState(io);
  const [joinedTime, setJoinedTime] = useState();
  const [sessionId, setSessionId] = useState();
  const router = useRouter();

  socket.on('connect', () => {
      console.log('connected!');
  });

  socket.on("disconnect", () => {
    console.log("disconnected!");
  });

  socket.on('message', function(msg) {
    console.log(msg);
  });
  
  socket.on("error", (error) => {
    console.log('error connecting!!')
  });

  const joinQueue = async () => {
    const queueResponse = await joinWaitQueue();
    console.log(queueResponse);
    setJoinedTime(queueResponse.timeEntered);

    // now join a session by connecting to the web socket
    const newSocket = io("http://localhost:5000/api");
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