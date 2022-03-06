import * as Tone from "tone";
import { Player } from "tone";

var stopSong = false;
var paletteNums = ["drums", "piano", "bass", "guitar"];
var paletteNumsStates = [1, 1, 1, 1];
var layerPlayer = 1;
var layerTitles = ["drums1", "piano1"];

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
export function tonePlayer(soundFile) {
  const player = new Tone.Player("../../" + soundFile).toDestination();
  Tone.loaded().then(() => {
    player.start();
  });
}

export function Drum1() {
  paletteNumsStates[0] = 1;
  const player = new Tone.Player(
    "../../drums" + paletteNumsStates[0] + ".mp3"
  ).toDestination();
  if (!stopSong) {
    Tone.loaded().then(() => {
      player.start();
    });
  }
}

export function Drum2() {
  paletteNumsStates[0] = 2;
  const player = new Tone.Player(
    "../../drums" + paletteNumsStates[0] + ".mp3"
  ).toDestination();
  if (!stopSong) {
    Tone.loaded().then(() => {
      player.start();
    });
  }
}

export function Drum3() {
  paletteNumsStates[0] = 3;
  const player = new Tone.Player(
    "../../drums" + paletteNumsStates[0] + ".mp3"
  ).toDestination();
  if (!stopSong) {
    Tone.loaded().then(() => {
      player.start();
    });
  }
}

export function Piano1() {
  paletteNumsStates[1] = 1;
  const player = new Tone.Player(
    "../../piano" + paletteNumsStates[1] + ".mp3"
  ).toDestination();
  if (!stopSong) {
    Tone.loaded().then(() => {
      player.start();
    });
  }
}

export function Piano2() {
  paletteNumsStates[1] = 2;
  const player = new Tone.Player(
    "../../piano" + paletteNumsStates[1] + ".mp3"
  ).toDestination();
  if (!stopSong) {
    Tone.loaded().then(() => {
      player.start();
    });
  }
}

export function Piano3() {
  paletteNumsStates[1] = 3;
  const player = new Tone.Player(
    "../../piano" + paletteNumsStates[1] + ".mp3"
  ).toDestination();
  if (!stopSong) {
    Tone.loaded().then(() => {
      player.start();
    });
  }
}

export function Bass1() {
  paletteNumsStates[2] = 1;
  const player = new Tone.Player(
    "../../bass" + paletteNumsStates[2] + ".mp3"
  ).toDestination();
  if (!stopSong) {
    Tone.loaded().then(() => {
      player.start();
    });
  }
}

export function Bass2() {
  paletteNumsStates[2] = 2;
  const player = new Tone.Player(
    "../../bass" + paletteNumsStates[2] + ".mp3"
  ).toDestination();
  if (!stopSong) {
    Tone.loaded().then(() => {
      player.start();
    });
  }
}

export function Bass3() {
  paletteNumsStates[2] = 3;
  const player = new Tone.Player(
    "../../bass" + paletteNumsStates[2] + ".mp3"
  ).toDestination();
  if (!stopSong) {
    Tone.loaded().then(() => {
      player.start();
    });
  }
}

export function Guitar1() {
  paletteNumsStates[3] = 1;
  const player = new Tone.Player(
    "../../guitar" + paletteNumsStates[3] + ".mp3"
  ).toDestination();
  if (!stopSong) {
    Tone.loaded().then(() => {
      player.start();
    });
  }
}

export function Guitar2() {
  paletteNumsStates[3] = 2;
  const player = new Tone.Player(
    "../../guitar" + paletteNumsStates[3] + ".mp3"
  ).toDestination();
  if (!stopSong) {
    Tone.loaded().then(() => {
      player.start();
    });
  }
}

export function Guitar3() {
  paletteNumsStates[3] = 3;
  const player = new Tone.Player(
    "../../guitar" + paletteNumsStates[3] + ".mp3"
  ).toDestination();
  if (!stopSong) {
    Tone.loaded().then(() => {
      player.start();
    });
  }
}

export function playSong() {
  var player1 = new Tone.Player(
    "../../drums" + paletteNumsStates[0] + ".mp3"
  ).toDestination();
  var player2 = new Tone.Player(
    "../../piano" + paletteNumsStates[1] + ".mp3"
  ).toDestination();
  var player3 = new Tone.Player(
    "../../bass" + paletteNumsStates[2] + ".mp3"
  ).toDestination();
  var player4 = new Tone.Player(
    "../../guitar" + paletteNumsStates[3] + ".mp3"
  ).toDestination();
  if (!stopSong) {
    Tone.loaded().then(() => {
      player1.start();
      player2.start();
      player3.start();
      player4.start();
    });
  }

  function StopSong() {
    if (!stopSong) {
      stopSong = true;
    } else {
      stopSong = false;
    }
  }
}

// USE TO PICK THE LAYER THAT WILL PLAY
// export function FocusLayer1() {
//     layerPlayer = 1;
//     const player = new Tone.Player("../../layer" + layerPlayer + ".mp3").toDestination();
//     Tone.loaded().then(() => {
//       player.start();
//     });
// }

// export function FocusLayer2() {
//     layerPlayer = 2;
//     const player = new Tone.Player("../../layer" + layerPlayer + ".mp3").toDestination();
//     Tone.loaded().then(() => {
//       player.start();
//     });
// }
