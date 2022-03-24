import React, { useState, useEffect, useContext } from "react";
import { MemberContext } from '../context/member';
import { useRouter } from "next/router";
import { SocketContext } from "../context/socket";
import { getLiveSession } from "../components/Session";

const Timer = ({initialMinutes = 0,initialSeconds = 10,}) => {
    const member = useContext(MemberContext);
    const router = useRouter()
    const socket = useContext(SocketContext);
    const [time, setTime] = useState({
        m: initialMinutes,
        s: initialSeconds,
    });

    const [timer, setTimer] = useState(null);
    //starts timer
    const startTimer = () => {
        cancelTimer()
        let myInterval = setInterval(() => {
            setTime((time) => {
                const updatedTime = { ...time };
                if (time.s > 0) {
                    updatedTime.s--;
                }

                if (time.s === 0) {
                    if (time.m > 0) {
                        updatedTime.m--;
                        updatedTime.s = 59;
                    } 
                }if (time.s === 0) {
                if (time.m == 0) {
                    endSession();
                } 
            }
                return updatedTime;
            });
        }, 1000);
        setTimer(myInterval);
    };
    //pauses timer code in session page should require approval of both users for this to be called, otherwise timer continues to tick
    const pauseTimer = () => {
        clearInterval(timer);
    };
    //Extends timer in a situation similarly to the pause timer
    // should it have default value of 5 min or allow user input
    //Should not make it go over an hour, its easy to implement logic but I kinda dont want to .-.
    const extendTimer = (extime) =>{
        let myInterval = setInterval(() => {
            setTime((time) => {
                const updatedTime = { ...time };
                updatedTime.s= updatedTime.s + extime.s;
                let overflow = 0;
                if(updatedTime.s > 59){
                    overflow = Math.floor(updatedTime.s/60);
                    updatedTime.s = updatedTime.s-(60*overflow);
                }
                updatedTime.m = updatedTime.m+overflow+extime.m;
                return updatedTime;
            });
        }, 1000);
        setTimer(myInterval);
    }
    // Ends Session and sends users to end session page
    const endSession = async () =>{
        const liveSession = await getLiveSession();
        socket.emit("endSession",member)
        // router.push({
        //     pathname: "/endSession",
        //     query: {
        //         session: liveSession.sessionId
        //     }
        // })
        console.log(liveSession)
    }
    // Stops timer and resets it to original time
    const cancelTimer = () => {
        clearInterval(timer);
        setTime({
            m: initialMinutes,
            s: initialSeconds,
        });
    };
    //Restarts timer
    const restartTimer= () => {
        cancelTimer()

        setTime({
            m: initialMinutes,
            s: initialSeconds,
        });
        startTimer()
    }
    return (
        <div>
            <h1 className='timer'>
                {time.m < 10 ? `0${time.m}` : time.m}:
                {time.s < 10 ? `0${time.s}` : time.s}
            </h1>
            
            <button onClick={startTimer}>Start</button>
            <button onClick={pauseTimer}>Pause</button>
            <button onClick={cancelTimer}>Cancel</button>
            <button onClick={restartTimer}>Restart</button>
            <button onClick={endSession}>end</button>
        </div>
    );
  };
  export default Timer;