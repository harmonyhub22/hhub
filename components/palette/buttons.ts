import * as Tone from "tone";
import { Player } from "tone";

var stopSong = false;
var paletteNums = ["Drums", "Piano", "Bass", "Guitar"];
var paletteNumsStates = [1, 1, 1, 1];
var layerPlayer = 1;
var layerTitles = ["Drums1", "Piano1"];

// Here are the files tonePlayer can be called with:
// ToneButton0 -> piano_middle_C.mp3
// ToneButton1 -> piano_C_sharp.mp3
// ToneButton2 -> piano_D.mp3
// ToneButton3 -> piano_D_sharp.mp3
// ToneButton4 -> piano_D_sharp.mp3
// ToneButtonN1 -> kick.mp3
// ToneButtonN2 -> highhat.mp3
// ToneButtonN3 -> snare.mp3
// ToneButtonN4 -> clap.mp3
// RecordButton -> metronome.mp3
function TonePlayer(soundFile:string) {
  const player = new Tone.Player("../../" + soundFile).toDestination();
  Tone.loaded().then(() => {
    player.start();
  });
}

// function Drum1(drum1Player) {
//   Tone.loaded().then(() => {
//     drum1Player.start();
//   });
// };

// function Drum2(drum2Player) {
//   Tone.loaded().then(() => {
//     drum2Player.start();
//   });
// };

// function Drum3(drum3Player) {
//   Tone.loaded().then(() => {
//     drum3Player.start();
//   });
// };

function PlaySong() {
  var player1 = new Tone.Player(
    "../../Drums" + paletteNumsStates[0] + ".mp3"
  ).toDestination();
  var player2 = new Tone.Player(
    "../../Piano" + paletteNumsStates[1] + ".mp3"
  ).toDestination();
  var player3 = new Tone.Player(
    "../../Bass" + paletteNumsStates[2] + ".mp3"
  ).toDestination();
  var player4 = new Tone.Player(
    "../../Guitar" + paletteNumsStates[3] + ".mp3"
  ).toDestination();
  if (!stopSong) {
    Tone.loaded().then(() => {
      player1.start();
      player2.start();
      player3.start();
      player4.start();
    });
  }
}

function StopSong() {
    if (!stopSong) {
      stopSong = true;
    } else {
      stopSong = false;
    }
}

export {
  PlaySong,
  StopSong,
  TonePlayer
};


// USE TO PICK THE LAYER THAT WILL PLAY
// function FocusLayer1() {
//     layerPlayer = 1;
//     const player = new Tone.Player("../../layer" + layerPlayer + ".mp3").toDestination();
//     Tone.loaded().then(() => {
//       player.start();
//     });
// }

// function FocusLayer2() {
//     layerPlayer = 2;
//     const player = new Tone.Player("../../layer" + layerPlayer + ".mp3").toDestination();
//     Tone.loaded().then(() => {
//       player.start();
//     });
// }
