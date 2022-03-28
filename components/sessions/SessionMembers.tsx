import { Card, Dot, Text, Collapse, Divider } from "@geist-ui/core";
import React from "react";
import Member from "../../interfaces/models/Member";

interface SessionMembersProps {
  youMemberId: string,
  member1: Member|null,
  member2: Member|null,
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
        </Card>
      </Collapse>
    );
  }
}

export default SessionMembers;