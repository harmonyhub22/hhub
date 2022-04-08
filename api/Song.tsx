import { config } from "../components/config";
import Member from "../interfaces/models/Member";
import SongInterface from "../interfaces/models/SongInterface";

export const syncGetYourSongs = (member:Member, setSongsCallback:any) => {
  fetch(
    config.server_url + `api/songs?memberId=${member.memberId}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then((response:any) => {
    if (response.ok) return response.json();
    throw new Error();
  }).then((jsonResponse:SongInterface) => setSongsCallback(jsonResponse))
  .catch(err => {
    console.log(err);
    setSongsCallback(null);
  });
};

export const syncDeleteSong = (songId:string, callback:any) => {
  fetch(
    config.server_url + `api/songs/${songId}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then((response:any) => {
    if (response.ok) return callback();
    throw new Error();
  }).catch(err => {
    console.log(err);
    throw new Error();
  });
};