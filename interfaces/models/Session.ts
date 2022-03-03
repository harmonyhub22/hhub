import Genre from "./Genre";
import Member from "./Member";

export default interface Session {
    sessionId: string;
    turnCount: number;
    startTime: Date;
    endTime: Date;
    genre: Genre;
    member1: Member;
    member2: Member;
}