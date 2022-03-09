export default interface Layer {
    layerId: string,
    startTime: number;
    endTime: number;
    repeatCount: number;
    file: string;
    bucketUrl: string;
    memberId: string;
}