export type Player = {
  id: number;
  steam_id_64: string;
  created: string;
  names: {
    id: number;
    name: string;
    steam_id_64: string;
    created: string;
    last_seen: string;
  }[];
  sessions: never[]; // Assuming sessions is an array, but it's empty in the provided data
  sessions_count: number;
  total_playtime_seconds: number;
  current_playtime_seconds: number;
  received_actions: never[]; // Assuming received_actions is an array, but it's empty in the provided data
  penalty_count: {
    KICK: number;
    PERMABAN: number;
    PUNISH: number;
    TEMPBAN: number;
  };
  blacklist: null;
  flags: string[];
  watchlist: null;
  steaminfo: {
    id: number;
    created: string;
    updated: string | null;
    profile: {
      avatar: string;
      steamid: string;
      avatarfull: string;
      avatarhash: string;
      profileurl: string;
      personaname: string;
      timecreated: number;
      avatarmedium: string;
      personastate: number;
      profilestate: number;
      primaryclanid: string;
      loccountrycode: string;
      personastateflags: number;
      communityvisibilitystate: number;
    };
    country: string | null;
    bans: null;
  } | null;
  names_by_match: string[];
  first_seen_timestamp_ms: number;
  last_seen_timestamp_ms: number;
  vip_expiration: null;
};

export type PlayersHistoryDTO = {
  result: {
    total: number;
    players: Player[];
    page: number;
    page_size: number;
  };
  command: string;
  arguments: {
    page_size: string;
  };
  failed: boolean;
};

export type PlayersHistory = PlayersHistoryDTO['result'];
