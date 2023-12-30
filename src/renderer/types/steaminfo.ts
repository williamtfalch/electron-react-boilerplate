export type SteamInfo = {
  id: number;
  created: string;
  updated: string;
  profile: {
    avatar: string;
    steamid: string;
    realname: string;
    avatarfull: string;
    avatarhash: string;
    profileurl: string;
    personaname: string;
    timecreated: number;
    avatarmedium: string;
    personastate: number;
    profilestate: number;
    primaryclanid: string;
    personastateflags: number;
    communityvisibilitystate: number;
  };
  country: string | null;
  bans: any | null; // Define the structure for bans
};
