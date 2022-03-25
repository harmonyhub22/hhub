import LayerInterface from "./models/LayerInterface";

export default interface NeverCommittedLayer {
  layer: LayerInterface, // put stagingFileName as fileName
  stagingSoundBuffer: Blob|null,
  stagingSoundBufferDate: string|null,
}