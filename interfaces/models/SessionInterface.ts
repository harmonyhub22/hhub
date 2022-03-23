import Genre from "./Genre";
import Layer from "./Layer";
import Member from "./Member";

export default interface SessionInterface {
  sessionId: string;
  turnCount: number;
  startTime: Date;
  endTime: Date;
  genre: Genre;
  member1: Member;
  member2: Member;
  layers: Layer[];
}
