import Member from "./Member";

export default interface LayerInterface {
    layerId: string,
    member: Member,
    name: string,
    startTime: number,
    duration: number,
    fileName: string|null,
    bucketUrl: string|null,
    fadeInDuration: number,
    fadeOutDuration: number,
    trimmedStartDuration: number,
    trimmedEndDuration: number,
    y: number,
    muted: boolean,
}
