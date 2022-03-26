import React, { Component } from "react";
import { Button, Drawer, Modal, Text } from "@geist-ui/core";
import SessionInterface from "../../interfaces/models/SessionInterface";
import { config } from "../config";
import Router from "next/router";


interface EndProps {
  member: any,
  session: SessionInterface|null
  // songBuffer:any, TBD maybe
}

interface EndState {
  savedToLibrary: boolean,
  downloadedSong: boolean,
  congratsIndex:number
} 
class End extends Component<EndProps, EndState> {
  static congratulatory: string[] = config.congrats;

  constructor(props: EndProps) {
    super(props);
    this.state = {
      savedToLibrary: false,
      downloadedSong:false,
      congratsIndex:0
    };
    this.saveSong = this.saveSong.bind(this);
    // this.downloadSong = this.downloadSong.bind(this);
    //this.Leave = this.Leave.bind(this);
  }
  componentDidMount(){
    // this.setState({
    //   congratsIndex: Math.floor(Math.random() * (End.congratulatory.length + 1)),
    // )};
  }
  async saveSong(){
    this.setState({
      savedToLibrary: true,
    })
  }
  async downloadSong(){
    this.setState({
      downloadedSong: true,
    })
  }
  async Leave(){
    Router.push({
      pathname: "index"
    })
  }
  render(){
    return(
      
    <div className="end-session">
    
      <Text h1 style={{textAlign: 'center'}}>
        Congrats {this.props.member.firstname}. 
      </Text>
      <Text>{End.congratulatory[this.state.congratsIndex]}</Text>
      <Button onClick={this.downloadSong}>Download the Song?</Button>
      <Button onClick={this.saveSong}>Save the Song?</Button>
      <Button onClick={this.Leave}>Leave?</Button>
    </div>
    )
  }
  
}
export default End;