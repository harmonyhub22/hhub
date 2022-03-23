import Layer from './models/LayerInterface';

export default interface TimelineLayer {
    layer: Layer | null,
    submitted: boolean,
    top: number,
    left: number,
    stagingSoundName: string | null,
    stagingSoundBuffer: AudioBuffer | null,
    duration: number,
}