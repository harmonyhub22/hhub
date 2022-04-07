import Genre from "./Genre";
import LayerInterface from "./LayerInterface";
import Member from "./Member";

export default interface SessionInterface {
  sessionId: string;
  startTime: Date;
  endTime: Date;
  member1: Member;
  member2: Member;
  layers: LayerInterface[];
}
