import LayerInterface from "./models/LayerInterface";

export default interface StagedLayer {
  layer: LayerInterface,
  recordingId: string|null,
  recordingBlob: Blob|null,
}