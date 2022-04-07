import { Button, Fieldset, Grid, Page, Text } from "@geist-ui/core";
import { useContext, useEffect, useState } from "react";
import { syncGetYourSongs } from "../api/Song";
import { syncGetCurrentMember } from "../api/Helper";
import Navbar from "../components/Navbar";
import { MemberContext } from "../context/member";
import Member from "../interfaces/models/Member";
import SongInterface from "../interfaces/models/SongInterface";
import { PlayFill } from "@geist-ui/icons";

const Library = () => {
  const [songs, setSongs] = useState<SongInterface[]|null>(null);
  const [currentMember, setCurrentMember] = useState<Member|null>(null);

  const member = useContext(MemberContext);

  const setCurrentMemberAndGetSongs = (currentMember:Member|null) => {
    if (currentMember !== null) {
      setCurrentMember(currentMember);
      syncGetYourSongs(currentMember, setSongs);
    }
  };

  useEffect(() => {
    if ((member?.memberId ?? null) === null) {
      syncGetCurrentMember(setCurrentMemberAndGetSongs);
    } else if (currentMember !== null) {
      syncGetYourSongs(currentMember, setSongs);
    } else {
      syncGetYourSongs(member, setSongs);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Navbar />
      <Page>
        <Text h1>Your Library</Text>
        <Text h4>Listen to the pieces you created!</Text>

        {(songs?.length ?? 0) === 0 && <Text>No songs yet... Go Create!</Text>}

        <Grid.Container gap={2} justify="center">
          <Grid xs={12}>
            {songs?.map((song:SongInterface) => {
              <Fieldset key={`song-${song.songId}`}>
                <Fieldset.Title>{song.name}</Fieldset.Title>
                <Fieldset.Subtitle>{song.createdAt}</Fieldset.Subtitle>
                <Fieldset.Footer>
                  <Button auto scale={1/3} iconRight={<PlayFill />} px={0.6}></Button>
                  <Text type="error">An error has occurred.</Text>
                  <Button auto scale={1/3} type="error" font="12px">Delete</Button>
                </Fieldset.Footer>
              </Fieldset>
            })}
          </Grid>
        </Grid.Container>

      </Page>
    </>
  );
};

export default Library;
