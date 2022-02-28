import { io } from "socket.io-client";
import { config } from "./config";

export const joinWaitQueue = async () => {
    const response = await fetch(config.server_url + "/queue", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        }
    });
    return response.json()
};

export const newSession = () => {
    /*
    fetch(config.server_url + "/newSession", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            MEMBERID: 123, // not sure what member id is
            GENREID: "dff3c144-eb29-41d3-82ea-9bcd200fc891",
        }),
    }).then((res) => res.json())
    .then((x) => {
        const sessionId = 'fill_me';
        router.push({
            pathname: '/sessions/[sid]',
            query: { 'sid': sessionId },
        });
    });
    */
}

export const createSocket = async () => {
    const socket = io(config.server_url + "/socket", {transports: ['websocket']});
    socket.on("message", () => {});
};