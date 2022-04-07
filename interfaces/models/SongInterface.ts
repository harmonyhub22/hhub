import SessionInterface from "./SessionInterface";

export default interface SongInterface {
    songId: string;
    session: SessionInterface;
    name: string;
    duration: number;
    createdAt: Date;
};