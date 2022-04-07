import Navbar from "../components/Navbar";
import { Card, Divider, Dot, Page, Text, User } from "@geist-ui/core";
import Member from "../interfaces/models/Member";
import { syncGetCurrentMember } from "../api/Helper";
import { useContext, useEffect, useState } from "react";
import { MemberContext } from "../context/member";

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
          <Card width="400px">
          <Card.Content>
            <User src="/images/profile-avatar.webp" name={`${currentMember.firstname} ${currentMember.lastname}`}>
            </User>
          </Card.Content>
          <Divider h="1px" my={0} />
          <Card.Content>
            <Text><b>Email</b> {currentMember.email}</Text>
            <Text><b>First Name</b> {currentMember.firstname}</Text>
            <Text><b>Last Name</b> {currentMember.lastname}</Text>
            <Text><b>Online</b> {currentMember.isOnline ?  <Dot style={{ marginLeft: '15px' }} type="success"/> : <Dot style={{ marginLeft: '15px' }} />}</Text>
            <Text><b>Id</b> {currentMember.memberId}</Text>
          </Card.Content>
          </Card>
        </div>}
      </Page>
    </>
  );
};

export default Profile;
