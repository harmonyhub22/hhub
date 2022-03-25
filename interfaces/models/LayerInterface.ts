import Member from "./Member";

export default interface LayerInterface {
    layerId: string|null,
    member: Member,
    name: string,
    startTime: number,
    duration: number,
    fileName: string|null,
    bucketUrl: string|null,
    fadeInDuration: number,
    fadeOutDuration: number,
    reversed: boolean,
    trimmedStartDuration: number,
    trimmedEndDuration: number,
    top: number, // we'll add this to the db
}
