import Member from "./Member";
import SessionInterface from "./SessionInterface";

export default interface SongInterface {
    songId: string;
    member: Member;
    session: SessionInterface;
    name: string;
    duration: number;
    createdAt: Date;
};