import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { Button, Page, Drawer, Modal, useModal } from "@geist-ui/core";
import Head from "next/head";
import Layer from "../../interfaces/models/Layer";
import { MemberContext } from "../../context/member";
import { SocketContext } from "../../context/socket";
import Crunker from "crunker";
import Palette from "../../components/ui/Palette";
import Session from "../../interfaces/models/Session";
import PaletteData from "../../interfaces/palette_data";
import {
  getLayerById,
  getSession,
  postLayer,
  postLayerRecording,
} from "../../components/Session";
import SessionData from "../../interfaces/session_data";
import LayerCreated from "../../interfaces/socket-data/layers_created";
import LayersCreated from "../../interfaces/socket-data/layers_created";
import Member from "../../interfaces/models/Member";

function Session() {
  const { visible, setVisible, bindings } = useModal();
  const [showPallete, setShowPalette] = React.useState(false);

  const [session, setSession] = useState<Session>();
  const [sessionData, setSessionData] = useState<SessionData>({
    bpm: 130,
    measures: 1,
  });
  const [layers, setLayers] = useState<Layer[]>([]);
  const [partner, setPartner] = useState<Member>();

  const router = useRouter();
  const member = useContext(MemberContext);
  const socket = useContext(SocketContext);

  const partnerLayer = async (layerId: string) => {
    if (session?.sessionId === undefined) return;
    const layer: Layer | null = await getLayerById(session?.sessionId, layerId);
    if (layer === null || layer === undefined) {
      console.log("could not get partner layer");
      return;
    }
    setLayers([...layers, layer]);
  };

  const getThisSession = async () => {
    console.log(router.query.sid);
    const s = await getSession(router?.query?.sid?.toString() || "");
    console.log(s);
    if (s === null || s === undefined) return;
    setSession(s);
    setLayers(s.layers); // set the current layers
    setPartner(s.member1.memberId === member.memberId ? s.member2 : s.member1); // set the partner
    socket.on("layers_added", async (data: LayersCreated) => {
      data.layerIds.map(async (layerId) => {
        await partnerLayer(layerId);
      });
    });
  };

  useEffect(() => {
    getThisSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const addLayer = async (paletteData:PaletteData, selectedPatterns:string[]) => {
  //   if (paletteData === null || paletteData === undefined)
  //     return;
  //   if (!paletteData.name) {
  //     alert("Please seclect a palette pattern to use!");
  //     return;
  //   }
  //   if (session?.sessionId === undefined) return;

  //   // each of Will's patterns is 4 measures = .7 seconds
  //   // therefore, there are .7/4 = .175 seconds per measure
  //   const startTime = paletteData.startMeasure * 0.175;
  //   const endTime = startTime + 0.7 * (paletteData.numRepeats + 1);
  //   const layerData = {
  //     startTime: startTime,
  //     endTime: endTime,
  //     repeatCount: paletteData.numRepeats,
  //     file: '',
  //   };

  //   const newLayers: Layer[] = [];
  //   selectedPatterns.forEach(async (patternName:string) => {

  //     layerData.file = patternName;

  //     const newLayer: Layer | null = await postLayer(session.sessionId, layerData);
  //     if (newLayer === null) {
  //       console.log('could not add layer');
  //       alert('could not add layer');
  //       return;
  //     }
  //     console.log(newLayer);

  //     newLayers.push(newLayer);
  //   });

  //   setLayers([...layers, ...newLayers]);

  //   // adjust the measures needed
  //   const measuresNeeded = paletteData.startMeasure + 4 * (paletteData.numRepeats + 1);
  //   if (measuresNeeded > paletteData.maxMeasuresNeeded) {
  //     sessionData.measures = measuresNeeded;
  //     setSessionData(sessionData);
  //   }

  //   // tell partner there's a new layer
  //   const newLayerIds = newLayers.map((l) => l.layerId);
  //   const dataToEmit = {
  //     layerIds: newLayerIds,
  //   };
  //   socket.emit("add_layer", dataToEmit);
  // };

  // the left offset and width of the layer depends on the start time and ratio of layer duration to the entire song, respectively
  const computeLayerStyle = (start: number, duration: number) => {
    const layerStyle = {
      width: "50px",
      marginLeft: "0px",
    };

    let durationPerentage = (duration / (sessionData.measures * 0.175)) * 100;
    layerStyle.width = durationPerentage.toString() + "%";

    // the percentage of left offset decreases as the # of columns in our table increases (since columns shrink as more are added)
    let multiplier = 20;
    if (sessionData.measures >= 5 && sessionData.measures < 10) multiplier = 10;
    else if (sessionData.measures >= 10) multiplier = 5;
    const leftOffset = start * multiplier;
    layerStyle.marginLeft = leftOffset.toString() + "%";
    return layerStyle;
  };
  // const loop = async (file:string,loopcount:number)=>{
  //   const crunker = new Crunker();
  //   const arr:AudioBuffer[] = []
  //   for (var i = 0; i < loopcount; i++) {
  //     const temp = await crunker.fetchAudio(file)
  //     arr.push(temp[0])
  //   }
  //   return crunker.concatAudio(arr)
  // }

  const finishSong = async () => {
    // TODO: make backend request to process the finished song (send all of the layers)
    const crunker = new Crunker();
    const buffers: AudioBuffer[] = [];
    const getBuffers = new Promise(() => {
      layers.map(async (layer) => {
        const buffer = await crunker.fetchAudio(layer.file);
        return crunker.padAudio(buffer[0], 0, layer.startTime);
      });
    });
    await getBuffers;

    const t = crunker.mergeAudio(buffers);
    const output = crunker.export(t, "audio/mp3");
    crunker.download(output.blob);
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
              {Array.from(Array(sessionData.measures), (_, i) => (
                <th key={"M_" + i}>M{i}</th>
              ))}
            </tr>
            {(layers?.length ?? 0) !== 0 ? (
              layers.map((layer, i) => {
                return (
                  <tr key={"layer_" + i}>
                    <td colSpan={sessionData.measures}>
                      <audio
                        controls
                        style={computeLayerStyle(
                          layer.startTime,
                          layer.endTime - layer.startTime
                        )}
                        src={
                          (layer?.file?.length ?? 0) === 0
                            ? layer.file
                            : layer.bucketUrl
                        }
                      ></audio>
                      {layer.memberId === member.memberId
                        ? member.firstname[0].toUpperCase() +
                          member.lastname[0].toUpperCase()
                        : partner !== undefined &&
                          partner.firstname[0].toUpperCase() +
                            partner.lastname[0].toUpperCase()}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td key={"first_layer"}>
                  <Button onClick={() => setShowPalette(true)}>
                    Create your first layer!
                  </Button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Drawer
        visible={showPallete}
        onClose={() => setShowPalette(false)}
        placement="right"
      >
        <Drawer.Content>
          <Palette
            genreName={"alt"}
            initials={`${member.firstname[0]}${member.lastname[0]}`}
          />
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
