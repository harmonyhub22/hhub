import { Button, Fieldset, Grid, Link, Page, Text } from "@geist-ui/core";
import { useContext, useEffect, useState } from "react";
import { syncDeleteSong, syncGetYourSongs } from "../api/Song";
import { syncGetCurrentMember } from "../api/Helper";
import Navbar from "../components/Navbar";
import { MemberContext } from "../context/member";
import Member from "../interfaces/models/Member";
import SongInterface from "../interfaces/models/SongInterface";
import { PlayFill, Trash } from "@geist-ui/icons";
import * as Tone from "tone";

const Library = () => {
  const [songs, setSongs] = useState<SongInterface[]|null>(null);
  const [currentMember, setCurrentMember] = useState<Member|null>(null);
  const [tonePlayers, setTonePlayers] = useState<any>(null);

  const member = useContext(MemberContext);

  const setSongsAndSetTonePlayers = (songs:SongInterface[]|null) => {
    setSongs(songs);
    createPlayer(songs);
  };

  const setCurrentMemberAndGetSongs = (currentMember:Member|null) => {
    if (currentMember !== null) {
      setCurrentMember(currentMember);
      syncGetYourSongs(currentMember, setSongsAndSetTonePlayers);
    }
  };

  const createPlayer = (songs:SongInterface[]|null) => {
    if (tonePlayers !== null) {
      if (tonePlayers.state === "started") tonePlayers.stopAll();
      try {
        tonePlayers.dispose();
      } catch (e) {
        /* do nothing */
      }
    }
    if (songs === null) {
      setTonePlayers(null);
      return;
    }
    const newTonePlayers = new Tone.Players().toDestination();
    songs.map((song:SongInterface) => {
      if (song.session.bucketUrl === null) {
        newTonePlayers.add(song.songId, song.session.bucketUrl);
      }
    });
    setTonePlayers(tonePlayers);
  };

  useEffect(() => {
    if ((member?.memberId ?? null) === null) {
      syncGetCurrentMember(setCurrentMemberAndGetSongs);
    } else if (currentMember !== null) {
      syncGetYourSongs(currentMember, setSongsAndSetTonePlayers);
    } else {
      syncGetYourSongs(member, setSongsAndSetTonePlayers);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePlay = (songId:string) => {
    if (tonePlayers.loaded) {
      if (tonePlayers.status === "started") tonePlayers.stopAll();
      const player = tonePlayers.get(songId);
      if (player !== null) {
        player.start(0);
      }
    }
  };

  const handleDelete = (song:SongInterface) => {
    if (confirm(`Are you sure you want to delete ${song.name}`)) {
      syncDeleteSong(song.songId, () => syncGetYourSongs(member || currentMember, setSongsAndSetTonePlayers));
    }
  };

  return (
    <>
      <Navbar />
      <Page>
        <div style={{display: 'flex', width: '100%', justifyContent: "center", flexDirection: 'column', textAlign: 'center'}}>
          <Text h1>Your Library</Text>
          <Text h4>Listen to the pieces you created!</Text>
        </div>

        <div style={{width: '100%', justifyContent: 'center', display: 'fex', textAlign: 'center'}}>
        {((songs?.length ?? 0) === 0 && (member !== null || currentMember !== null)) && <p><span>No songs yet...</span> <Link href="/queue" color>Go Create!</Link></p>}

        <Grid.Container gap={2} justify="center">
          <Grid xs={12}>
            {songs?.map((song:SongInterface) => {
              <Fieldset key={`song-${song.songId}`}>
                <Fieldset.Title>{song.name}</Fieldset.Title>
                <Fieldset.Subtitle>{song.createdAt}</Fieldset.Subtitle>
                <Fieldset.Footer>
                  <Button shadow auto scale={1/3} px={0.6} iconRight={<PlayFill />} type="secondary" onClick={() => handlePlay(song.songId)}></Button>
                  <Button shadow auto scale={1/3} px={0.6} iconRight={<Trash />} type="error" onClick={() => handleDelete(song)}></Button>
                </Fieldset.Footer>
              </Fieldset>
            })}
          </Grid>
        </Grid.Container>
        </div>
      </Page>
    </>
  );
};

export default Library;
