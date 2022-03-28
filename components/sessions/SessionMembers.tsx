import { Card, Dot, Text, Collapse, Divider, Code } from "@geist-ui/core";
import React from "react";
import Member from "../../interfaces/models/Member";

interface SessionMembersProps {
  youMemberId: string,
  member1: Member|null,
  member2: Member|null,
  startTime: Date|null,
};

class SessionMembers extends React.Component<SessionMembersProps> {
  constructor(props:SessionMembersProps) {
    super(props);
  }

  render() {
    return (
      <Collapse shadow title="Session Info" className="session-members" subtitle="Session Info">
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
            <Text>Start time<br></br><Code>{this.props.startTime ?? ""}</Code></Text>
          </Card.Content>
        </Card>
      </Collapse>
    );
  }
}

export default SessionMembers;