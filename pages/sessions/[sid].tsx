import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import {
  Button,
  Page,
  Drawer,
  Modal,
  useModal,
} from "@geist-ui/core";
import { saveAs } from "file-saver";
import Head from "next/head";
import Layer from "../../interfaces/models/Layer";
import { MemberContext } from "../../context/member";
import { SocketContext } from "../../context/socket";
import Crunker from "crunker";
import Palette from "../../components/ui/Palette";
import Session from "../../interfaces/models/Session";
import PaletteData from "../../interfaces/palette-data";
import { getSession } from "../../components/Session";
import SessionData from "../../interfaces/session-data";

function Session() {
  const { visible, setVisible, bindings } = useModal();
  const [showPallete, setShowPalette] = React.useState(false);


  const [session, setSession] = useState<Session>();
  const [sessionData, setSessionData] = useState<SessionData>({
    bpm: 130,
    measures: 1,
  });
  const [layers, setLayers] = useState<Layer[]>([]);

  const router = useRouter();
  const member = useContext(MemberContext);
  const socket = useContext(SocketContext);

  const getThisSession = async () => {
    console.log(router.query.sid);
    const s = await getSession(router?.query?.sid?.toString() || '');
    console.log(s);
    if (s === null || s === undefined) return;
    setSession(s);
  };

  useEffect(() => {
    getThisSession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addLayer = async (paletteData:PaletteData) => {
    if (paletteData === null || paletteData === undefined)
      return;
    if (!paletteData.name) {
      alert("Please seclect a palette pattern to use!");
    } else {
      /*
      const dataToEmit = {
        sessionId: sessionId,
      };
      socket.emit("add_layer", dataToEmit);
      */

      // each of Will's patterns is 4 measures = .7 seconds
      // therefore, there are .7/4 = .175 seconds per measure
      const startTime = paletteData.startMeasure * 0.175;
      const endTime = startTime + 0.7 * (paletteData.numRepeats + 1);

      /*
      // because we cant send json data and audio data at the same time, we must do 2 API calls (POST and PUT)
      // POST request to make new layer with metadata
      const postResponse = await fetch(config.server_url + "api/session/" + sessionId + "/layers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
      const layer = await postResponse.json();
      const layerId = layer.layerId.toString();

      // PUT request to this layer to actually send the audio file
      const layerFormData = new FormData();
      layerFormData.append('file', fileFromInput);
      const putResponse = await fetch(
      config.server_url + "api/session/" + sessionId + "/layers/" + layerId,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            MEMBERID: player.memberId,
          },
          body: layerFormData,
        }
      );
      */

      const newLayer: Layer = {
        memberId: member.memberId,
        startTime: startTime,
        endTime: endTime,
        repeatCount: paletteData.numRepeats,
        file: "../" + paletteData.name + ".mp3",
        bucketUrl: '',
      };

      setLayers([...layers, newLayer]);

      const measuresNeeded = paletteData.startMeasure + 4 * (paletteData.numRepeats + 1);
      if (measuresNeeded > paletteData.maxMeasuresNeeded) {
        sessionData.measures = measuresNeeded;
        setSessionData(sessionData);
      }
    }
  };

  // the left offset and width of the layer depends on the start time and ratio of layer duration to the entire song, respectively
  const computeLayerStyle = (start:number, duration:number) => {
      const layerStyle = {
        width: "50px",
        marginLeft: "0px",
      };

      let durationPerentage = duration / (sessionData.measures * .175) * 100;
      layerStyle.width = durationPerentage.toString() + "%";
      
      // the percentage of left offset decreases as the # of columns in our table increases (since columns shrink as more are added)
      let multiplier = 20;
      if (sessionData.measures >= 5 && sessionData.measures < 10) multiplier = 10;
      else if (sessionData.measures >= 10) multiplier = 5;
      const leftOffset = start * multiplier;
      layerStyle.marginLeft = leftOffset.toString() + "%";
      return layerStyle;
  };


  const finishSong = async () => {
    // TODO: make backend request to process the finished song (send all of the layers)
    const crunker = new Crunker();
    const buffers: AudioBuffer[] = [];
    const getBuffers = new Promise(() => {
      layers.map(async (layer) => {
      const buffer = await crunker.fetchAudio(layer.file);
      return crunker.padAudio(buffer[0], 0, layer.startTime);
    })});
    await getBuffers;

    const t = crunker.mergeAudio(buffers)
    const output = crunker.export(t, 'audio/mp3')
    crunker.download(output.blob)
    socket.emit("finished");
  };

  /*
  const saveFile = () => {
    saveAs(
      "https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_1MG.mp3"
    );
  };
  */

  return (
    <Page>
      <Head>
        <h3>Your song session! Add a layer to your song with your partner!</h3>
        <p>Song BPM: {sessionData.bpm}</p>
      </Head>
      <div id="session-timeline-div">
        <table id="session-timeline">
          <tbody>
            <tr>
              {Array.from(Array(sessionData.measures), (_, i) => <th key={"M_" + i}>M{i}</th>)}
            </tr>
            {((layers?.length ?? 0) === 0) ?
              (layers.map((layer, i) => 
                (
                  <tr key={"layer_" + i}>
                    <td colSpan={sessionData.measures}>
                      <audio
                        controls
                        style={computeLayerStyle(layer.startTime, layer.endTime - layer.startTime)}
                        src={layer.file}
                      ></audio>
                    </td>
                  </tr>
                )
              )) :
              (<tr>
                <td key={"first_layer"}>
                  <Button onClick={() => setShowPalette(true)}>Create your first layer!</Button>
                </td>
              </tr>)
            }
          </tbody>
        </table>
      </div>

      <Drawer
        visible={showPallete}
        onClose={() => setShowPalette(false)}
        placement="right"
      >
        <Drawer.Title>Your Sound Pallete</Drawer.Title>
        <Drawer.Content>
          {Palette(session?.genre?.name || '', addLayer)}
        </Drawer.Content>
      </Drawer>

      <Modal {...bindings}>
        <Modal.Title>Finishing Song</Modal.Title>
        <Modal.Content>
          <p>Would you like to leave or download the song</p>
        </Modal.Content>
        <Modal.Action passive onClick={() => setVisible(false)}>
          Leave
        </Modal.Action>
        <Modal.Action passive onClick={() => finishSong()}>
          Download
        </Modal.Action>
      </Modal>

      <Page.Footer>
        <Button auto onClick={() => setVisible(true)} type="success">
          Finish Song
        </Button>
        <Button auto onClick={() => setShowPalette(true)} scale={1}>
          Show Pallete
        </Button>
      </Page.Footer>
    </Page>
  );
}

export default Session;
