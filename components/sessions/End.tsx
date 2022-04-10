import React, { Component } from "react";
import { Button, Spinner, Text } from "@geist-ui/core";
import SessionInterface from "../../interfaces/models/SessionInterface";
import { config } from "../config";
import Crunker from "./Crunker";
import { syncSaveSong } from "../../api/Session";
import { BookOpen, Check, Download, Save } from "@geist-ui/icons";

interface EndProps {
  member: any,
  session: SessionInterface|null,
  songBuffer: AudioBuffer|null,
}

interface EndState {
  savedToLibrary: boolean,
  downloadedSong: boolean,
  congratsIndex: number,
  loading: boolean,
} 

class End extends Component<EndProps, EndState> {
  static congratulatory: string[] = config.congrats;

  constructor(props: EndProps) {
    super(props);
    this.state = {
      savedToLibrary: false,
      downloadedSong:false,
      congratsIndex: 0,
      loading: false,
    };
    this.saveSong = this.saveSong.bind(this);
    this.goHome = this.goHome.bind(this);
    this.downloadSong = this.downloadSong.bind(this);
    this.setSavedToLibrary = this.setSavedToLibrary.bind(this);
    this.goToLibrary = this.goToLibrary.bind(this);
  }

  componentDidMount() {
    const cachedState: string|null = window.localStorage.getItem('end-state');
    if (cachedState === null) {
      this.setState({
        congratsIndex: Math.floor(Math.random() * (End.congratulatory.length + 1)),
      });
    } else {
      const jsonCachedState: EndState = JSON.parse(cachedState);
      this.setState({
        savedToLibrary: jsonCachedState.savedToLibrary,
        downloadedSong: jsonCachedState.downloadedSong,
        congratsIndex: jsonCachedState.congratsIndex,
        loading: jsonCachedState.loading,
      });
    }
    window.onbeforeunload = () => {
      window.localStorage.removeItem('end-state');
    };
  };

  componentDidUpdate(prevProps:EndProps, prevState:EndState) {
    if (JSON.stringify(prevState) !== JSON.stringify(this.state)) {
      window.localStorage.setItem('end-state', JSON.stringify(this.state));
    }
  }
  
  saveSong() {
    if (this.props.session) {
      this.setState({
        loading: true,
      });
      syncSaveSong(this.props.session, this.props.songBuffer, this.setSavedToLibrary);
    }
  }

  setSavedToLibrary(saved:boolean) {
    this.setState({
      savedToLibrary: saved,
      loading: false,
    });
    if (saved === false) {
      alert('Could not save your song at this time.');
    }
  }
  
  downloadSong(){
    console.log(this.props.songBuffer);
    if (this.props.songBuffer !== null && this.props.session !== null) {
      const crunker = new Crunker();
      const blob = crunker.export(this.props.songBuffer, 'audio/mpeg');
      crunker.download(blob.blob, `session-${this.props.session.sessionId}`);
      this.setState({
        downloadedSong: true,
      });
    } else {
      alert('We cannot download your song at this time.');
    }
  }

  goHome() {
    if (!this.state.downloadedSong || !this.state.savedToLibrary) {
      let str = "Are you sure you want to leave without";
      if (!this.state.downloadedSong) {
        str += this.state.savedToLibrary ? " downloading?" : " downloading or";
      }
      if (!this.state.savedToLibrary) {
        str += " saving this to your library?";
      }
      if (confirm(str)) {
        window.location.assign("/");
      }
    } else {
      window.location.assign("/");
    }
  };

  goToLibrary() {
    window.location.assign("/library");
  };

  render() {
    return(
      <div className="end-session">
        <Text h1 style={{textAlign: 'center'}}>
          Congrats {this.props.member.firstname}!
        </Text>
        <Text>{End.congratulatory[this.state.congratsIndex]}</Text>
        <div style={{display: 'flex', justifyContent: "center", width: '100%'}}>
          <Button style={{marginRight: '20px'}} type="success" auto icon={this.state.downloadedSong ? <Check/> : <Download/>}
            onClick={this.downloadSong} disabled={this.state.loading}>
            Download Song
          </Button>
          <Button type="warning" auto ghost={this.state.savedToLibrary} icon={this.state.downloadedSong ? <BookOpen/> : <Save/>}
            onClick={() => {this.state.savedToLibrary ? this.goToLibrary() : this.saveSong()}} disabled={this.state.loading}>
            {this.state.savedToLibrary ? "Go to your Library" : "Save Song to Library"}
            {this.state.loading && <Spinner />}
          </Button>
        </div>
        <Button style={{marginTop: '20px'}} type="abort" onClick={this.goHome}>Go Home</Button>
      </div>
    )
  }
}
export default End;