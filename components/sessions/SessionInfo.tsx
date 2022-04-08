import { Card, Dot, Text, Collapse, Divider, Code, Toggle, Select } from "@geist-ui/core";
import { ToggleEvent } from "@geist-ui/core/esm/toggle";
import React from "react";
import Member from "../../interfaces/models/Member";
import Draggable from "react-draggable";
import moment from "moment";

interface SessionInfoProps {
  youMemberId: string,
  member1: Member|null,
  member2: Member|null,
  startTime: Date|null,
  bpm: number|null,
  updateBpm: any,
};

interface SessionInfoState {
  offset: number,
}

class SessionInfo extends React.Component<SessionInfoProps, SessionInfoState> {
  constructor(props:SessionInfoProps) {
    super(props);
    this.state = {
      offset: -90,
    };
    this.setBpm = this.setBpm.bind(this);
    this.handleDragStop = this.handleDragStop.bind(this);
  }

  componentDidMount() {
    const offset: string|null = window.localStorage.getItem('session-info-offset');
    if (offset !== null && offset !== undefined) {
      this.setState({
        offset: parseInt(offset),
      });
    }
  }

  setBpm(val: any) {
    this.props.updateBpm(val === null ? null : parseInt(val));
  }

  handleDragStop = (event:any, info:any) => {
    this.setState({
      offset: info.x,
    });
    window.localStorage.setItem('session-info-offset', info.x.toString());
  };

  render() {
    return (
      <div className="session-info-container">
        <Draggable
          key={this.state.offset}
          bounds=".session-info-container" // "parent"
          handle=".session-info"
          cancel=".session-info .title svg"
          defaultPosition={{x: this.state.offset, y: 0}}
          onStop={this.handleDragStop}
        >
        <Collapse shadow title="This Hub" className="session-info" subtitle="Session Info">
          <Card style={{backgroundColor: "white"}}>
            <Card.Content>
              Members<br></br>
              {this.props.member1 !== null && this.props.member2 !== null && 
              (this.props.member1.memberId === this.props.youMemberId ?
                <>
                  <Dot type="default"><Text small>(You){' '}{this.props.member1.firstname}{' '}{this.props.member1.lastname}</Text></Dot>
                  <br></br>
                  <Dot type="warning"><Text small>{this.props.member2.firstname}{' '}{this.props.member2.lastname}</Text></Dot>
                </> :
                <>
                  <Dot type="default"><Text small>(You){' '}{this.props.member2.firstname}{' '}{this.props.member2.lastname}</Text></Dot>
                  <br></br>
                  <Dot type="warning"><Text small>{this.props.member1.firstname}{' '}{this.props.member1.lastname}</Text></Dot>
                </>
              )}
            </Card.Content>
            <Divider h="1px" my={0} />
            <Card.Content>
              <Text>Started At<br></br><Code>{this.props.startTime !== null ? moment(this.props.startTime).format("dddd, MMMM Do YYYY, h:mm a") : ""}</Code></Text>
            </Card.Content>
            <Divider h="1px" my={0} />
            <Card.Content>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <span>bpm (enable snapping)</span>
                <Toggle type="secondary" initialChecked={this.props.bpm !== null}
                  onChange={(e:ToggleEvent) => this.setBpm(e.target.checked ? 120 : null)} />
              </div>
              <Select placeholder="Choose bpm..." 
                initialValue="120" style={{height: '30px', marginTop: '5px'}}
                disabled={this.props.bpm === null ? true : false}
                onChange={this.setBpm}>
                <Select.Option value="100">100</Select.Option>
                <Select.Option value="110">110</Select.Option>
                <Select.Option value="120">120</Select.Option>
                <Select.Option value="130">130</Select.Option>
                <Select.Option value="140">140</Select.Option>
              </Select>
            </Card.Content>
          </Card>
        </Collapse>
        </Draggable>
      </div>
    );
  }
}

export default SessionInfo;