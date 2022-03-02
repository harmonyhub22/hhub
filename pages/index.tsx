import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import { ReactMediaRecorder } from "react-media-recorder";
import React, { useState } from 'react';
import * as Tone from 'tone'

function ShowPalette() {
}

function ToneButton0() {
  const player = new Tone.Player("piano_middle_C.mp3").toDestination();
  Tone.loaded().then(() => {
    player.start();
  });
}
function ToneButton1() {
  const player = new Tone.Player("piano_C_sharp.mp3").toDestination();
  Tone.loaded().then(() => {
    player.start();
  });
}
function ToneButton2() {
  const player = new Tone.Player("piano_D.mp3").toDestination();
  Tone.loaded().then(() => {
    player.start();
  });
}
function ToneButton3() {
  const player = new Tone.Player("piano_D_sharp.mp3").toDestination();
  Tone.loaded().then(() => {
    player.start();
  });
}
function ToneButton4() {
  const player = new Tone.Player("piano_E.mp3").toDestination();
  Tone.loaded().then(() => {
    player.start();
  });
}

function ToneButtonN1() {
  const player = new Tone.Player("kick.mp3").toDestination();
  Tone.loaded().then(() => {
    player.start();
  });
}
function ToneButtonN2() {
  const player = new Tone.Player("highhat.mp3").toDestination();
  Tone.loaded().then(() => {
    player.start();
  });
}
function ToneButtonN3() {
  const player = new Tone.Player("snare.mp3").toDestination();
  Tone.loaded().then(() => {
    player.start();
  });
}
function ToneButtonN4() {
  const player = new Tone.Player("clap.mp3").toDestination();
  Tone.loaded().then(() => {
    player.start();
  });
}

function RecordButton() {
  const player = new Tone.Player("metronome.mp3").toDestination();
  Tone.loaded().then(() => {
    player.start();
  });
}


var paletteNums = ["drums", "piano", "bass", "guitar"];
var paletteNumsStates = [1, 1, 1, 1]

function Drum1() {
  paletteNumsStates[0] = 1;
}
function Drum2() {
  paletteNumsStates[0] = 2;
}
function Piano1() {
  paletteNumsStates[1] = 1;
}
function Piano2() {
  paletteNumsStates[1] = 2;
}
function Bass1() {
  paletteNumsStates[2] = 1;
}
function Bass2() {
  paletteNumsStates[2] = 2;
}
function Guitar1() {
  paletteNumsStates[3] = 1;
}
function Guitar2() {
  paletteNumsStates[3] = 2;
}
function PlaySong() {
  const player1 = new Tone.Player("drums" + paletteNumsStates[0] + ".mp3").toDestination();
  const player2 = new Tone.Player("piano" + paletteNumsStates[1] + ".mp3").toDestination();
  const player3 = new Tone.Player("bass" + paletteNumsStates[2] + ".mp3").toDestination();
  const player4 = new Tone.Player("guitar" + paletteNumsStates[3] + ".mp3").toDestination();
  Tone.loaded().then(() => {
    player1.start();
    player2.start();
    player3.start();
    player4.start();
  });
}



const Home: NextPage = () => {

  

  return (
    
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.tsx</code>
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className={styles.card}
          >
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>

        <audio controls></audio>

        
        {/* <div id="PaletteList" className="palette-list">
          <a href="#" onClick={ShowPalette}>Rock</a>
          <a href="#" onClick={ShowPalette}>Electronic</a>
          <a href="#" onClick={ShowPalette}>Lo-Fi</a>
          <a href="#" onClick={ShowPalette}>Hip-Hop</a>
        </div> */}

        <ReactMediaRecorder
          audio
          render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
            <div>
              <p>{status}</p>
              <button onClick={startRecording}>Start Recording</button>
              <button onClick={stopRecording}>Stop Recording</button>
              <video src={mediaBlobUrl} controls autoPlay loop />
            </div>
          )}
        />

        <br></br>

        <table className="table-palette">
          <thead>
            <tr>
              <th>Palette:</th>
              <th className="table-palette-th2">ROCK</th>
            </tr>
          </thead>
          <tfoot>
            <tr>
              <td>
                <button onClick={PlaySong}>Play</button>
              </td>
              <td>
                <button>SAVE</button>
              </td>
            </tr>
          </tfoot>
          <tbody>
            <tr>
              <td>
                <div className="table-palette-buttonframe">
                  <button className="button-palette" role="button" onClick={Drum1}>Drums1</button>
                </div>
              </td>
              <td>
                <div className="table-palette-buttonframe">
                  <button className="button-palette" role="button" onClick={Drum2}>Drums2</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="table-palette-buttonframe">
                  <button className="button-palette" role="button" onClick={Piano1}>Piano1</button>
                </div>
              </td>
              <td>
                <div className="table-palette-buttonframe">
                  <button className="button-palette" role="button" onClick={Piano2}>Piano2</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="table-palette-buttonframe">
                  <button className="button-palette" role="button" onClick={Bass1}>Bass1</button>
                </div>
              </td>
              <td>
                <div className="table-palette-buttonframe">
                  <button className="button-palette" role="button" onClick={Bass2}>Bass2</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="table-palette-buttonframe">
                  <button className="button-palette" role="button" onClick={Bass1}>Guitar1</button>
                </div>
              </td>
              <td>
                <div className="table-palette-buttonframe">
                  <button className="button-palette" role="button" onClick={Bass2}>Guitar2</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <br></br>
        <button onClick={RecordButton}>Record</button>
        <br></br>
        <button onClick={ToneButton0}>C</button>
        <button onClick={ToneButton1}>C#</button>
        <button onClick={ToneButton2}>D</button>
        <button onClick={ToneButton3}>D#</button>
        <button onClick={ToneButton4}>E</button>
        <br></br>
        <br></br>
        <button onClick={ToneButtonN1}>Kick</button>
        <button onClick={ToneButtonN2}>High Hat</button>
        <button onClick={ToneButtonN3}>Snare</button>
        <button onClick={ToneButtonN4}>Clap</button>

        <br></br>
        <button className="button-palette" role="button">Piano</button>

        <br></br>
        <br></br>


        <table className="table-palette">
          <thead>
            <tr>
              <th>Palette:</th>
              <th className="table-palette-th2">ROCK</th>
            </tr>
          </thead>
          <tfoot>
            <tr>
              <td>
                <button>RESET</button>
              </td>
              <td>
                <button>SAVE</button>
              </td>
            </tr>
          </tfoot>
          <tbody>
            <tr>
              <td>
                <div className="table-palette-buttonframe">
                  <button className="button-palette" role="button">Piano</button>
                </div>
              </td>
              <td>
                <div className="table-palette-buttonframe">
                  <button className="button-palette" role="button">Overdriven Guitar</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="table-palette-buttonframe">
                  <button className="button-palette" role="button">Rock Drums</button>
                </div>
              </td>
              <td>
                <div className="table-palette-buttonframe">
                  <button className="button-palette" role="button">Bass Guitar</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>

    </div>
  )
}



export default Home
