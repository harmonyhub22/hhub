import React, { Component, useEffect } from "react";
import { Button, Drawer, Modal, Text } from "@geist-ui/core";
import SessionInterface from "../../interfaces/models/SessionInterface";
import { config } from "../config";
import Crunker from "./Crunker";



interface EndProps {
  member: any,
  session: SessionInterface|null
  songBuffer: AudioBuffer|null,
}

interface EndState {
  savedToLibrary: boolean,
  downloadedSong: boolean,
  congratsIndex: number,
} 
class End extends Component<EndProps, EndState> {
  static congratulatory: string[] = config.congrats;

  constructor(props: EndProps) {
    super(props);
    this.state = {
      savedToLibrary: false,
      downloadedSong:false,
      congratsIndex: 0,
    };
    this.saveSong = this.saveSong.bind(this);
    this.goHome = this.goHome.bind(this);
    this.downloadSong = this.downloadSong.bind(this);
  }

  componentDidMount() {
    this.setState({
      congratsIndex: Math.floor(Math.random() * (End.congratulatory.length + 1)),
    });
  };
  
  saveSong() {
    // todo
    this.setState({
      savedToLibrary: true,
    });

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
      alert('could not download, please try again');
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
  }



  render(){
    return(
    
    <div className="end-session">
      <Text h1 style={{textAlign: 'center'}}>
        Congrats {this.props.member.firstname}. 
      </Text>
      <Text>{End.congratulatory[this.state.congratsIndex]}</Text>
      {this.state.downloadedSong ? 
        <Button disabled>Download Song</Button>
        :
        <Button onClick={this.downloadSong}>Download Song</Button>
      }
      {this.state.savedToLibrary ?
        <Button disabled>Save Song to Library</Button>
        :
        <Button onClick={this.saveSong}>Save Song to Library</Button>
      }
      <Button onClick={this.goHome}>Go Home</Button>
    </div>
    )
  }
  
}
export default End;