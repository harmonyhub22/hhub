import Navbar from "../components/Navbar";
import { Button, Card, Divider, Dot, Page, Text, User } from "@geist-ui/core";
import Member from "../interfaces/models/Member";
import { syncGetCurrentMember } from "../api/Helper";
import { useContext, useEffect, useState } from "react";
import { MemberContext } from "../context/member";
import { Edit } from "@geist-ui/icons";

const Profile = () => {
  const [currentMember, setCurrentMember] = useState<Member|null>(null);

  const member = useContext(MemberContext);

  useEffect(() => {
    if ((member?.memberId ?? null) === null) {
      syncGetCurrentMember(setCurrentMember);
    } else {
      setCurrentMember(member);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Navbar />
      <Page style={{textAlign: 'center'}}>
        <div style={{display: 'flex', width: '100%', justifyContent: "center", flexDirection: 'column'}}>
          <Text h1>You</Text>
          <Text h4>Future Drake loading...</Text>
        </div>
        {currentMember !== null && 
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <Card width="600px">
          <Card.Content style={{position: 'relative'}}>
            <User src="/images/profile-avatar.webp" name={`${currentMember.firstname} ${currentMember.lastname}`}>
            </User>
            <div style={{position: 'absolute', right: '5px', bottom: '15px'}}>
              <Button iconRight={<Edit />} auto scale={2/3} px={0.6} />
            </div>
          </Card.Content>
          <Divider h="1px" my={0} />
          <Card.Content>
            <div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
              <span><b>Email</b></span>
              <span>{currentMember.email}</span>
            </div>
            <div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
              <span><b>First Name</b></span>
              <span>{currentMember.firstname}</span>
            </div>
            <div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
              <span><b>Last Name</b></span> 
              <span>{currentMember.lastname}</span>
            </div>
            <div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
              <span><b>Online</b></span> 
              <span>{currentMember.isOnline ?  <Dot style={{ marginLeft: '15px' }} type="success"/> : <Dot style={{ marginLeft: '15px' }} />}</span>
            </div>
            <div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
              <span><b>Id</b></span>
              <span>{currentMember.memberId}</span>
            </div>
          </Card.Content>
          </Card>
        </div>}
      </Page>
    </>
  );
};

export default Profile;
