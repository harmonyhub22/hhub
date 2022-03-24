export default interface LayerInterface {
    layerId: string|null,
    memberId: string,
    name: string,
    startTime: number,
    duration: number,
    fileName: string|null,
    bucketUrl: string|null,
    fadeInDuration: number,
    fadeOutDuration: number,
    reversed: boolean,
    trimmedStartDuration: number, // ie. song is 10 seconds and they trim a second off of the beginning, trimmedStartDuration = 1
    trimmedEndDuration: number,
}
