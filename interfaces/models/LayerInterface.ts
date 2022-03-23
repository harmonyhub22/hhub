export default interface LayerInterface {
    layerId: string,
    memberId: string,
    startTime: number,
    endTime: number,
    fileName: string|null,
    bucketUrl: string|null,
    duration: string,
    fadeInDuration: number,
    fadeOutDuration: number,
    reversed: boolean,
    trimmedStart: number, // ie. song is 10 seconds and they trim a second off of the beginning, trimmedStart = 1
    trimmedEnd: number,
}
