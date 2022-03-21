import React, { useState, useEffect, useContext } from "react";
import { Button, Spacer } from "@geist-ui/core";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import { getLiveSession } from "../components/Session";
import { SocketContext } from "../context/socket";
import * as Tone from "tone";
import {
  SingleHomeAnimation,
  SingleNode,
  DoubleNote,
  DoubleHomeAnimation,
} from "../components/AnimationPic";

const Home = () => {
  const [liveSessionId, setLiveSessionId] = useState<string>();
  const router = useRouter();

  const socket = useContext(SocketContext);

  // match with partner, and then route to session page with new session id
  const enterQueue = async () => {
    router.push({
      pathname: "/queue",
    });
  };

  const checkLiveSession = async () => {
    const liveSession = await getLiveSession();
    if (liveSession === null || liveSession === undefined) return;
    setLiveSessionId(liveSession.sessionId);
  };

  const enterLiveSession = async () => {
    if (liveSessionId === null || liveSessionId === undefined) return;
    socket.emit("join-session", { sessionId: liveSessionId });
    router.push({
      pathname: "/sessions/" + liveSessionId,
    });
  };

  const sendMsg = () => {
    socket.emit("message", "test message");
  };

  useEffect(() => {
    checkLiveSession();
  }, []);

  return (
    <>
      <Navbar />
      <div className="home">
        <div className="button-images">
          <SingleHomeAnimation />
        </div>
        <div className="home-button">
          <SingleNode />
          <div className="button-middle">
            <div className="button1">
              {(liveSessionId === null || liveSessionId === undefined) && (
                <Button
                  shadow
                  type="secondary"
                  id="btn-new-session"
                  onClick={enterQueue}
                >
                  Join a New Session
                </Button>
              )}
            </div>
            <div className="button2">
              {liveSessionId !== null && liveSessionId !== undefined && (
                <Button
                  shadow
                  type="success"
                  id="btn-new-session"
                  onClick={enterLiveSession}
                >
                  Join your Live Session
                </Button>
              )}
            </div>
            <div className="button3">
              <Button
                shadow
                type="secondary"
                id="btn-new-session"
                onClick={sendMsg}
              >
                Ping Message
              </Button>
            </div>
            <DoubleNote />
          </div>
          <div>
            <svg
              width="185"
              height="228"
              viewBox="0 0 185 228"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="notes">
                <g id="Frame" clipPath="url(#clip0_10_518)">
                  <g id="Group">
                    <path
                      id="Vector"
                      d="M19.478 226.113C27.9614 224.529 33.8305 219.626 32.587 215.162C31.3435 210.697 23.4583 208.361 14.9748 209.945C6.49142 211.529 0.622324 216.432 1.86584 220.896C3.10935 225.361 10.9946 227.697 19.478 226.113Z"
                      fill="#9B3C82"
                    />
                    <path
                      id="Vector_2"
                      d="M14.1371 228.011C7.0618 228.011 1.37977 225.41 0.208937 221.205C-1.266 215.914 5.05485 210.369 14.5977 208.586C24.1405 206.804 32.7724 209.558 34.2467 214.851C35.7209 220.145 29.4008 225.688 19.8572 227.471C17.9812 227.825 16.0625 228.006 14.1371 228.011V228.011ZM20.192 210.849C18.5634 210.852 16.9403 211.004 15.3529 211.302C7.92512 212.688 2.50842 216.94 3.52413 220.586C4.53985 224.232 11.6716 226.142 19.1035 224.755C26.5353 223.369 31.9479 219.117 30.9322 215.47C30.1382 212.634 25.6481 210.849 20.1933 210.849H20.192Z"
                      fill="#9B3C82"
                    />
                    <path
                      id="Vector_3"
                      d="M81.2561 214.806C89.7395 213.223 95.6086 208.32 94.3651 203.855C93.1215 199.39 85.2363 197.055 76.7529 198.638C68.2695 200.222 62.4004 205.125 63.6439 209.59C64.8874 214.054 72.7727 216.39 81.2561 214.806Z"
                      fill="#9B3C82"
                    />
                    <path
                      id="Vector_4"
                      d="M75.915 216.705C68.8397 216.705 63.1576 214.103 61.9861 209.898C60.5119 204.607 66.832 199.061 76.3756 197.28C85.9191 195.498 94.5496 198.25 96.0245 203.544C97.4988 208.835 91.178 214.382 81.6351 216.163C79.7591 216.518 77.8404 216.699 75.915 216.705V216.705ZM81.9698 199.541C80.3412 199.544 78.718 199.696 77.1307 199.995C69.703 201.381 64.2863 205.633 65.3013 209.279C66.3164 212.925 73.4522 214.834 80.8772 213.448C88.3022 212.062 93.7217 207.809 92.7066 204.163C91.9181 201.327 87.4212 199.541 81.9712 199.541H81.9698Z"
                      fill="#9B3C82"
                    />
                    <path
                      id="Vector_5"
                      d="M32.5874 216.553C32.1643 216.553 31.7566 216.424 31.4439 216.19C31.1312 215.957 30.9359 215.637 30.8961 215.292L26.3965 176.3C26.3576 175.964 26.4698 175.627 26.712 175.353C26.9543 175.079 27.31 174.887 27.7129 174.812L89.4471 163.345C89.6828 163.301 89.9272 163.299 90.1639 163.339C90.4007 163.378 90.6245 163.459 90.8203 163.575C91.0161 163.691 91.1795 163.839 91.2996 164.011C91.4197 164.183 91.4937 164.373 91.5167 164.57L96.0585 203.724C96.0796 203.907 96.0567 204.09 95.9912 204.265C95.9256 204.44 95.8186 204.602 95.6763 204.743C95.3889 205.028 94.9752 205.208 94.5261 205.242C94.3037 205.26 94.0793 205.241 93.8658 205.187C93.6523 205.134 93.4538 205.046 93.2816 204.93C92.9338 204.694 92.7145 204.356 92.6718 203.988L88.313 166.413L29.9232 177.257L34.2807 215.031C34.3017 215.213 34.2787 215.397 34.213 215.572C34.1473 215.747 34.0402 215.909 33.8978 216.05C33.7554 216.191 33.5805 216.307 33.3831 216.393C33.1857 216.478 32.9696 216.531 32.7472 216.548C32.6935 216.551 32.6398 216.553 32.5874 216.553V216.553Z"
                      fill="#9B3C82"
                    />
                    <path
                      id="Vector_6"
                      d="M146.92 56.7731C155.403 55.1895 161.272 50.2864 160.029 45.8218C158.785 41.3571 150.9 39.0216 142.416 40.6052C133.933 42.1889 128.064 47.092 129.307 51.5566C130.551 56.0212 138.436 58.3567 146.92 56.7731Z"
                      fill="#9B3C82"
                    />
                    <path
                      id="Vector_7"
                      d="M141.575 58.6715C134.504 58.6715 128.818 56.0705 127.647 51.8661C126.173 46.5716 132.493 41.0288 142.036 39.2465C151.579 37.4642 160.216 40.2178 161.687 45.5117C162.421 48.1489 161.232 50.9332 158.336 53.352C155.28 55.7644 151.454 57.4208 147.298 58.1307C145.421 58.4853 143.501 58.6667 141.575 58.6715V58.6715ZM147.63 41.5089C146.001 41.5118 144.378 41.6637 142.79 41.9617C135.363 43.3485 129.946 47.6003 130.962 51.2467C131.977 54.8931 139.109 56.8029 146.541 55.4155C150.061 54.8261 153.307 53.4363 155.906 51.4055C157.964 49.6867 158.838 47.8142 158.37 46.1333C157.58 43.2945 153.087 41.5089 147.634 41.5089H147.63Z"
                      fill="#9B3C82"
                    />
                    <path
                      id="Vector_8"
                      d="M160.026 47.2144C159.603 47.214 159.196 47.0846 158.883 46.8514C158.57 46.6183 158.375 46.2981 158.335 45.9534L153.781 6.69236C153.742 6.35556 153.854 6.01865 154.096 5.74457C154.339 5.4705 154.694 5.278 155.097 5.20306L182.923 0.0344908C183.363 -0.0471952 183.824 0.0175538 184.206 0.214494C184.587 0.411434 184.858 0.724433 184.958 1.08463C185.057 1.44484 184.978 1.82273 184.738 2.1352C184.497 2.44766 184.115 2.66909 183.675 2.75077L157.309 7.64754L161.722 45.6877C161.764 46.0553 161.627 46.4217 161.34 46.7063C161.052 46.9909 160.639 47.1705 160.19 47.2054C160.135 47.2121 160.079 47.2144 160.026 47.2144V47.2144Z"
                      fill="#9B3C82"
                    />
                  </g>
                </g>
              </g>
              <defs>
                <clipPath id="clip0_10_518">
                  <rect width="185" height="228" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
        <div className="home-images">
          <DoubleHomeAnimation />
        </div>
      </div>
    </>
  );
};

export default Home;
