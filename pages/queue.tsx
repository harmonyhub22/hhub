import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { syncJoinWaitQueue, syncLeaveWaitQueue } from "../api/Session";
import { SocketContext } from "../context/socket";
import SessionMade from "../interfaces/socket-data/session_made";
import Navbar from "../components/Navbar";
import { Button, Code, Loading, Text } from "@geist-ui/core";
import Queue from "../interfaces/models/Queue";
import moment from 'moment';

const Queue = (): React.ReactNode => {
  const [queue, setQueue] = useState<Queue|null>(null);
  const [timer, setTimer] = useState<any>(null);
  const [netWaitTime, setNetWaitTime] = useState<number>(0);
  const router = useRouter();

  const socket = useContext(SocketContext);

  const moveToSession = (data: SessionMade) => {
    console.log('got move to session signal', data);
    if (timer !== null) clearInterval(timer);
    console.log(data);
    router.push({
      pathname: "/sessions/[sessionId]",
      query: { sessionId: data.sessionId },
    });
  };

  const joinWaitQueueCallback = (queue:Queue|null) => {
    console.log('queue', queue);
    /*if (queue === null || queue === undefined) {
      alert('could not join queue');
      window.location.assign('/');
    } */
    if (timer !== null) clearInterval(timer);
    const queueTimer = setInterval(() => {
      setNetWaitTime(netWaitTime => netWaitTime += 1);
    }, 1000);
    setTimer(queueTimer);
    setQueue(queue);
  }

  const fancyTimeFormat = (duration:number) => {   
    // Hours, minutes and seconds
    const hrs = ~~(duration / 3600);
    const mins = ~~((duration % 3600) / 60);
    const secs = ~~duration % 60;
    // Output like "1:01" or "4:03:59" or "123:03:59"
    let ret = "";
    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }
    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
  };

  useEffect(() => {
    if (socket === null || socket === undefined) {
      window.location.assign('/');
      return;
    }
    socket.on("session_made", moveToSession);
    if (queue === null) {
      syncJoinWaitQueue(joinWaitQueueCallback);
    }
    window.onbeforeunload = () => {
      socket.off('session_made', moveToSession);
      syncLeaveWaitQueue((worked:boolean) => {});
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const leaveQueue = () => {
    if (queue !== null && queue !== undefined) {
      window.location.assign("/");
    }
  };

  return (
    <>
      <Navbar />
      <div className="queue-page">
        <h1>Waiting for a match!</h1>
        <p>do not refresh this page</p>
        {queue !== null &&
        <>
          <p>Joined on <Code>{moment(queue.timeEntered).format("dddd, MMMM Do YYYY, h:mm a")}</Code></p>
          <Text h3 style={{color: '#21a0aa'}}>{fancyTimeFormat(netWaitTime)}</Text>
          <Loading scale={15} />
          <Button onClick={leaveQueue} type="success" ghost shadow>
            Cancel
          </Button>
        </>}
      </div>
    </>
  );
};

export default Queue;
