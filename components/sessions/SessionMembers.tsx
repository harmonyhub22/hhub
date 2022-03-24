import { Card, Dot } from "@geist-ui/core";
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
      <Card className="session-members">
        {this.props.member1 !== null && this.props.member2 !== null && 
        (this.props.member1.memberId === this.props.youMemberId ?
          <>
            <Dot type="success">(You){' '}{this.props.member1.firstname}{' '}{this.props.member1.lastname}</Dot>
            <br></br>
            <Dot type="warning">{this.props.member2.firstname}{' '}{this.props.member2.lastname}</Dot>
          </> :
          <>
            <Dot type="success">(You){' '}{this.props.member2.firstname}{' '}{this.props.member2.lastname}</Dot>
            <br></br>
            <Dot type="warning">{this.props.member1.firstname}{' '}{this.props.member1.lastname}</Dot>
          </>
        )}
        
      </Card>
    );
  }
}

export default SessionMembers;