import React, { Component } from "react";
import { Button, Drawer, Modal, Text } from "@geist-ui/core";
import Member from "../../interfaces/models/Member";
import SessionInterface from "../../interfaces/models/SessionInterface";
import {
  syncEndSession,
  syncDeleteLayer,
  syncGetSession,
  syncPostLayer,
} from "../../api/Session";
import LayerInterface from "../../interfaces/models/LayerInterface";
import Timeline from "./Timeline";
import SessionInfo from "./SessionInfo";
import SessionOptions from "./SessionOptions";
import Palette from "../palette/Palette";
import { IoIosColorPalette } from "react-icons/io";
import End from "./End";
import Confetti from "react-confetti";
import StagedLayer from "../../interfaces/StagedLayerInterface";
import { v4 as uuidv4 } from 'uuid'
import StagedLayerInterface from "../../interfaces/StagedLayerInterface";
import { deleteAll } from "../helpers/indexedDb";

interface SessionProps {
  member: any,
  socket: any,
}

interface SessionState {
  session: SessionInterface|null,
  partner: Member|null,
  mustReturnHome: boolean,
  stagedLayers: StagedLayer[],
  showPalette: boolean,
  sessionEnded: boolean,
  finalBuffer: any,
  finalBufferDuration: number,
  bpm: number|null,
};

class Session extends Component<SessionProps, SessionState> {
  static socketPullLayerMsg: string = "pull_layer";

  constructor(props: SessionProps) {
    super(props);
    this.state = {
      session: null,
      partner: null,
      mustReturnHome: false,
      stagedLayers: [],
      showPalette: false,
      sessionEnded: false,
      finalBuffer: null,
      finalBufferDuration: 0,
      bpm: null,
    };
    this.setSession = this.setSession.bind(this);
    this.updateSession = this.updateSession.bind(this);

    // staging layers
    this.getStagedLayersFromLocalStorage = this.getStagedLayersFromLocalStorage.bind(this);
    this.setStagedLayersToLocalStorage = this.setStagedLayersToLocalStorage.bind(this);
    this.stageLayer = this.stageLayer.bind(this);
    this.commitStagedLayer = this.commitStagedLayer.bind(this);
    this.deleteStagedLayer = this.deleteStagedLayer.bind(this);
    this.duplicateStagedLayer = this.duplicateStagedLayer.bind(this);

    // comitted layers
    this.deleteComittedLayer = this.deleteComittedLayer.bind(this);
    this.duplicateComittedLayer = this.duplicateComittedLayer.bind(this);

    // helper functions
    this.showPalette = this.showPalette.bind(this);
    this.registerPullLayer = this.registerPullLayer.bind(this);
    this.updateFinalBuffer = this.updateFinalBuffer.bind(this);
    this.tellPartnerToPull = this.tellPartnerToPull.bind(this);
    this.updateBpm = this.updateBpm.bind(this);

    // end session
    this.handleEndSession = this.handleEndSession.bind(this);
    this.cleanUpSession = this.cleanUpSession.bind(this);
  }

  setSession(session: SessionInterface | null) {
    this.setState({
      session: session,
      sessionEnded: session?.endTime ?? null === null ? false : true,
    });
  }

  updateSession() {
    if (this.state.session === null) return;
    syncGetSession(this.state.session.sessionId, this.setSession);
  }

  componentDidMount() {
    if (this.props.socket === undefined || this.props.socket === null || this.props.member === undefined) {
      this.setState({
        mustReturnHome: true,
      });
      return;
    }

    // set up the session
    const sessionId = window.localStorage.getItem("sessionId");
    if (sessionId === null) return;
    syncGetSession(sessionId, this.setSession);

    // join the session if not already joined
    this.props.socket.emit("join_session", { sessionId: sessionId });

    // add socket listener for partner layers
    this.props.socket.on(Session.socketPullLayerMsg, this.registerPullLayer);

    // get staged layer ids from local storage
    this.getStagedLayersFromLocalStorage(sessionId);
  }

  componentDidUpdate(prevProps: SessionProps, prevState: SessionState) {
    if (prevState.session?.sessionId !== this.state.session?.sessionId && this.state.session !== null) {
      this.setState({
        partner:
          this.state.session.member1.memberId !== this.props.member.memberId
            ? this.state.session.member1
            : this.state.session.member2,
      });
    }
    if (prevState.stagedLayers.length !== this.state.stagedLayers.length) {
      this.setStagedLayersToLocalStorage();
    }
  }

  componentWillUnmount() {
    if (this.props.socket !== undefined && this.props.socket !== null) {
      this.props.socket.off(Session.socketPullLayerMsg, this.registerPullLayer);
    }
  }

  registerPullLayer() {
    console.log("heard partner upload layer");
    this.updateSession();
  }

  tellPartnerToPull() {
    if (this.state.session !== null) {
      this.props.socket.emit("pull_layer", {
        sessionId: this.state.session.sessionId,
      });
    }
  }

  // ** staged layer section
  getStagedLayersFromLocalStorage(sessionId:string) {
    const cachedStagedLayerIds = window.localStorage.getItem(`session-${sessionId}-staged-layer-ids`);
    if (cachedStagedLayerIds !== null) { // nothing there yet
      const stagedLayerIds: string[] = JSON.parse(cachedStagedLayerIds);
      const stagedLayers: StagedLayer[] = stagedLayerIds.map((id:string) => {
        const layer: LayerInterface = {
          layerId: id,
          member: this.props.member,
          name: "",
          startTime: 0,
          duration: 0,
          fileName: null,
          bucketUrl: null,
          fadeInDuration: 0,
          fadeOutDuration: 0,
          reversed: false,
          trimmedStartDuration: 0,
          trimmedEndDuration: 0,
          y: 0,
          muted: false
        };
        const stagedLayer: StagedLayer = { layer: layer, recordingBlob: null, recordingId: null };
        return stagedLayer;
      });
      if (stagedLayers.length !== 0) {
        this.setState({
          stagedLayers: stagedLayers,
        });
      }
    } else { // if there's not storage, set it!
      this.setStagedLayersToLocalStorage();
    }
  };

  setStagedLayersToLocalStorage() {
    if (this.state.session === null) return;
    const stagedLayers: StagedLayer[] = this.state.stagedLayers;
    const stagedLayerIds: string[] = stagedLayers.map((stagedLayer:StagedLayer) => stagedLayer.layer.layerId);
    window.localStorage.setItem(`session-${this.state.session.sessionId}-staged-layer-ids`, JSON.stringify(stagedLayerIds));
  };

  stageLayer(stagedLayer: StagedLayer) {
    this.setState({
      stagedLayers: [...this.state.stagedLayers, stagedLayer],
    });
  };

  commitStagedLayer(layerData: LayerInterface, layerBlob: Blob | null) {
    if (this.state.session === null || this.state.session === undefined) return;
    let stagedLayers: StagedLayer[] = this.state.stagedLayers;
    stagedLayers = stagedLayers.filter(e => e.layer.layerId !== layerData.layerId);
    this.setState({
      stagedLayers: stagedLayers,
    });
    syncPostLayer(
      this.state.session.sessionId,
      layerData,
      layerBlob,
      this.updateSession,
      this.tellPartnerToPull
    );
  };

  deleteStagedLayer(layerData: LayerInterface) {
    let stagedLayers: StagedLayer[] = this.state.stagedLayers;
    stagedLayers = stagedLayers.filter(e => e.layer.layerId !== layerData.layerId);
    this.setState({
      stagedLayers: stagedLayers,
    });
  };

  duplicateStagedLayer(stagedLayer: StagedLayer) {
    // add a new id
    const id = uuidv4();
    stagedLayer.layer.layerId = id;
    stagedLayer.layer.name = `layer-${id}`;
    // calculate the start time to be at the end of the duplicated layer
    stagedLayer.layer.startTime = stagedLayer.layer.startTime + stagedLayer.layer.duration -
      stagedLayer.layer.trimmedEndDuration - stagedLayer.layer.trimmedStartDuration;
    this.stageLayer(stagedLayer);
  };
  // ** end staged layer section

  // ** comitted layer section
  deleteComittedLayer(layerData: LayerInterface) {
    if (this.state.session !== null) {
      syncDeleteLayer(
        this.state.session.sessionId,
        layerData.layerId,
        this.updateSession,
        this.tellPartnerToPull
      );
    }
  }

  duplicateComittedLayer(layerData: StagedLayerInterface) {
    const id = uuidv4();
    layerData.layer.layerId = id;
    layerData.layer.name = `layer-${id}`;
    layerData.layer.startTime = layerData.layer.startTime + layerData.layer.duration -
      layerData.layer.trimmedEndDuration - layerData.layer.trimmedStartDuration;

    this.stageLayer(layerData);
  }
  // ** end comitted layer section

  showPalette(show: boolean) {
    this.setState({
      showPalette: show,
    });
  };

  // ** end session section
  handleEndSession() {
    this.cleanUpSession();
    this.setState({
      sessionEnded: true,
    });
  };

  cleanUpSession() {
    const sessionId: string|null = window.localStorage.getItem('sessionId');
    if (sessionId === null) return;

    // clean up any staged layers
    let cachedStagedLayerIds: string|null = window.localStorage.getItem(`session-${sessionId}-staged-layer-ids`);
    if (cachedStagedLayerIds !== null) {
      const stagedLayerIds: string[] = JSON.parse(cachedStagedLayerIds);
      stagedLayerIds.forEach((layerId:string) => {
        window.localStorage.removeItem(`staged-layer-${layerId}`);
      });
    }
    window.localStorage.removeItem(`session-${sessionId}-staged-layer-ids`);
    this.setState({
      stagedLayers: [],
    });

    // clean up indexed db
    deleteAll(Palette.db_name, Palette.db_obj_store_name);

    // leave the socket room
    if (this.props.socket !== null && this.props.socket !== undefined)
      this.props.socket.leave(`session-${sessionId}`);

    // clean up palette data
    window.localStorage.removeItem('palette-staging-layer');
  };

  updateFinalBuffer(buffer: AudioBuffer|null, duration:number) {
    this.setState({
      finalBuffer: buffer,
      finalBufferDuration: duration,
    });
    if (this.state.session !== null)
      syncEndSession(this.state.session.sessionId, (succeeded:boolean) => {});
  };
  // ** end end session section

  updateBpm(bpm: number | null) {
    this.setState({
      bpm: bpm,
    });
  };

  render() {
    return (
      <>
        {this.state.sessionEnded && (
          <Confetti
            tweenDuration={500}
            numberOfPieces={150}
            drawShape={(ctx: any) => {
              ctx.beginPath();
              for (let i = 0; i < 22; i++) {
                const angle = 0.35 * i;
                const x = (0.2 + 1.5 * angle) * Math.cos(angle);
                const y = (0.2 + 1.5 * angle) * Math.sin(angle);
                ctx.lineTo(x, y);
              }
              ctx.stroke();
              ctx.closePath();
            }}
          ></Confetti>
        )}

        <Modal
          width="35rem"
          visible={this.state.mustReturnHome}
          disableBackdropClick
        >
          <Modal.Title>Return to Home Page</Modal.Title>
          <Modal.Content style={{ textAlign: "center" }}>
            <p>To rejoin your session please return home</p>
            <Button
              onClick={() => {
                window.location.assign("/");
              }}
            >
              Return Home
            </Button>
          </Modal.Content>
        </Modal>

        <Modal
          width="35rem"
          visible={this.state.finalBuffer !== null}
          disableBackdropClick
        >
          <Modal.Title>Session Complete</Modal.Title>
          <Modal.Content style={{ textAlign: "center" }}>
            <End
              member={this.props.member}
              session={this.state.session}
              songBuffer={this.state.finalBuffer} 
              bufferDuration={this.state.finalBufferDuration}              
            />
          </Modal.Content>
        </Modal>

        <SessionInfo
          youMemberId={this.props.member.memberId}
          member1={this.state.session?.member1 ?? null}
          member2={this.state.session?.member2 ?? null}
          startTime={this.state.session?.startTime ?? null}
          bpm={this.state.bpm}
          updateBpm={this.updateBpm}
        />

        <div className="session-content">
          <Timeline
            comittedLayers={this.state.session?.layers ?? []}
            stagedLayers={this.state.stagedLayers}
            sessionEnded={this.state.sessionEnded}
            bpm={this.state.bpm}
            commitStagedLayer={this.commitStagedLayer}
            duplicateStagedLayer={this.duplicateStagedLayer}
            deleteStagedLayer={this.deleteStagedLayer}
            stageLayer={this.stageLayer}
            deleteComittedLayer={this.deleteComittedLayer}
            duplicateComittedLayer={this.duplicateComittedLayer}
            updateFinalBuffer={this.updateFinalBuffer}
          />
        </div>

        <SessionOptions
          socket={this.props.socket}
          sessionId={this.state.session?.sessionId ?? null}
          partnerFirstname={this.state.partner?.firstname ?? ""}
          endSession={this.handleEndSession}
        />

        <div className="palette-open-button">
          <Button
            type="secondary-light"
            style={{ borderRadius: "6px 6px 0px 0px" }}
            onClick={() => this.showPalette(true)}
            icon={<IoIosColorPalette />}
          >
            Open Palette
          </Button>
        </div>

        <Drawer
          visible={this.state.showPalette}
          onClose={() => this.showPalette(false)}
          placement="right"
        >
          <Drawer.Content style={{height: '100vh', maxHeight: '100vh'}}>
            <Palette
              stageLayer={this.stageLayer}
              showPalette={this.showPalette}
              member={this.props.member}
            />
          </Drawer.Content>
        </Drawer>
      </>
    );
  }
}

export default Session;
