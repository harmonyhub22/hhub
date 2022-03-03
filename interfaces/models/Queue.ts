import Member from "./Member";

export default interface Queue {
    matchingQueueId: string;
    member: Member;
    timeEntered: Date;
}