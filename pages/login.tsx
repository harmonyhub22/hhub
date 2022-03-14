import { Button, Input, Spacer } from "@geist-ui/core";
import { useRouter } from "next/router";
import { useState } from "react";
import { Tone } from "tone/build/esm/core/Tone";
import { login } from "../components/Helper";

const Login = (): React.ReactNode => {
    const router = useRouter();

    const [email, setEmail] = useState<string>('');
    const [firstname, setFirstname] = useState<string>('');
    const [lastname, setLastname] = useState<string>('');

    function startRecordingFunction() {

      const MicRecorder = require('mic-recorder-to-mp3');

      var preRecordingDuration = 1850;
      var recordingDuration = 1850 * 4; //TIME TO RECORD FOR (calculate using BPM)
  
      const recorder = new MicRecorder({
        bitRate: 128
      });

      const player = new Audio("metronome130.mp3");
      player.play();

      setTimeout(function () {
        
      
        //START
        recorder.start().then(() => {
          //
        }).catch((e:any) => {
          console.error(e);
        });

        //STOP AFTER TIME
        setTimeout(function () {
          recorder
          .stop()
          .getMp3().then(([buffer, blob]) => {

            //Create file
            const file = new File(buffer, 'mp3recording.mp3', {
              type: blob.type,
              lastModified: Date.now()
            });
          
            //Play it back with default sound (not tone js) this is just for trouble shooting
            const player = new Audio(URL.createObjectURL(file));
            player.play();
          
          }).catch((e:any) => {
            console.log(e);
          });
        }, recordingDuration); //TIME THAT IT RUNS FOR

      }, preRecordingDuration); //TIME BEFORE RECORDING
      
    }

    const getLogin = async () => {
        if (email.length === 0 || firstname.length === 0 || lastname.length === 0) {
            console.log('email, firstname, lastname required');
            return;
        }
        const newMember = await login(email, firstname, lastname);
        if (newMember === null || newMember === undefined || newMember?.memberId === null || newMember?.memberId === undefined) {
            console.log('login failed');
            return;
        }
        // router.push({
        //     pathname: "/",
        // });
        window.location.href = window.location.origin;
    }
  
    return (
      <>
        <h1>Login</h1>
        <Input clearable label="email" placeholder="someone@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Spacer h={.5} />
        <Input clearable label="first name" placeholder="Harmony" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
        <Spacer h={.5} />
        <Input clearable label="last name" placeholder="Hub" value={lastname} onChange={(e) => setLastname(e.target.value)} />
        <Spacer h={.5} />
        <Button shadow type="secondary" id="btn-new-session" onClick={getLogin}>
            Login
        </Button>
        <button onClick={startRecordingFunction}>
          Start Recording
        </button>
      </>
    );
  };
  
  export default Login;