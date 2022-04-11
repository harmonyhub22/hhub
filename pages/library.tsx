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
import moment from "moment";

const Library = () => {
  const [songs, setSongs] = useState<SongInterface[]|null>(null);
  const [currentMember, setCurrentMember] = useState<Member|null>(null);
  const [tonePlayers, setTonePlayers] = useState<any>(null);

  const member = useContext(MemberContext);

  const setSongsAndSetTonePlayers = (songs:SongInterface[]|null) => {
    console.log('songs', songs);
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
      console.log('null');
      setTonePlayers(null);
      return;
    }
    const urlMap: any = {};
    songs.map((song:SongInterface) => {
      console.log(song.session);
      if (song.session.bucketUrl !== null) {
        console.log(song.session);
        urlMap[song.songId] = song.session.bucketUrl;
      }
    });
    console.log(urlMap);
    const newTonePlayers = new Tone.Players(
      urlMap,
      onload = () => {
        setTonePlayers(newTonePlayers);
      }
    ).toDestination();
  };

  useEffect(() => {
    if ((member?.memberId ?? null) !== null) {
      setCurrentMember(member);
      syncGetYourSongs(member, setSongsAndSetTonePlayers);
    } else if ((member?.memberId ?? null) === null) {
      syncGetCurrentMember(setCurrentMemberAndGetSongs);
    } else if (currentMember !== null) {
      syncGetYourSongs(currentMember, setSongsAndSetTonePlayers);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePlay = (songId:string) => {
    console.log(tonePlayers);
    if ((tonePlayers?.loaded ?? false) === true) {
      if (tonePlayers.status === "started") tonePlayers.stopAll();
      try {
        tonePlayers.player(songId).start(0);
      } catch (e:any) {
        alert('could not player song right now');
      }
    }
  };

  const handleDelete = (song:SongInterface) => {
    if (confirm(`Are you sure you want to delete ${song.name}`)) {
      syncDeleteSong(song.songId, () => syncGetYourSongs(member || currentMember, setSongsAndSetTonePlayers));
    }
  };

  const fancyTimeFormat = (duration:number) => {   
    // Hours, minutes and seconds
    const hrs = ~~(duration / 3600);
    const mins = ~~((duration % 3600) / 60);
    const secs = ~~duration % 60;
    // Output like "1:01" or "4:03:59" or "123:03:59"
    let ret = "";
    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }
    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
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
        </div>

        {(currentMember !== null && songs !== null) && <Grid.Container gap={2}>
            {songs.map((song:SongInterface) => (
              <Grid key={`song-${song.songId}`}>
                <Fieldset>
                  <Fieldset.Title style={{padding: '20px', width: '100%', justifyContent: 'center'}}>{song.name}</Fieldset.Title>
                  <Fieldset.Subtitle style={{paddingLeft: '20px', paddingRight: '20px', textAlign: 'center'}}>{moment(song.createdAt).format("dddd, MMMM Do YYYY, h:mm a")}</Fieldset.Subtitle>
                  <Fieldset.Content>
                    <div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
                      <span><b>Duration</b></span>
                      <span>{fancyTimeFormat(tonePlayers?.player(song.songId)?.buffer?.duration ?? 0)}</span>
                    </div>
                    <div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
                      <span><b>By</b></span>
                      <span>{currentMember.firstname} {currentMember.lastname}</span>
                    </div>
                    <div style={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
                      <span><b>Featuring</b></span>
                      {song.session.member1.memberId !== currentMember.memberId ? 
                        <span>{song.session.member1.firstname} {song.session.member1.lastname}</span> :
                        <span>{song.session.member2.firstname} {song.session.member2.lastname}</span>
                      }
                    </div>
                  </Fieldset.Content>
                  <Fieldset.Footer>
                    <Button shadow auto scale={1/3} px={0.6} iconRight={<PlayFill />} type="secondary" onClick={() => handlePlay(song.songId)}></Button>
                    <Button shadow auto scale={1/3} px={0.6} iconRight={<Trash />} type="error" onClick={() => handleDelete(song)}></Button>
                  </Fieldset.Footer>
                </Fieldset>
              </Grid>
            ))}
        </Grid.Container>}
      </Page>
    </>
  );
};

export default Library;
