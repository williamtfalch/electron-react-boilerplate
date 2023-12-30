export type Session = {
  id: number;
  steam_id_64: string;
  start: string;
  end: string;
  created: string;
};

export type PenaltyCount = {
  KICK: number;
  PERMABAN: number;
  PUNISH: number;
  TEMPBAN: number;
};

export type PlayerName = {
  id: number;
  name: string;
  steam_id_64: string;
  created: string;
  last_seen: string;
};

export type PlayerInfo = {
  id: number;
  steam_id_64: string;
  created: string;
  names: PlayerName[];
  sessions: Session[];
  sessions_count: number;
  total_playtime_seconds: number;
  current_playtime_seconds: number;
  received_actions: any[]; // Define the structure for received actions
  penalty_count: PenaltyCount;
  blacklist: any | null; // Define the structure for blacklist
  flags: string[];
  watchlist: any | null; // Define the structure for watchlist
  steaminfo: any | null; // Define the structure for steaminfo
};

export type PlayerDTO = {
  result: PlayerInfo;
  command: string;
  arguments: {
    steam_id_64: string;
  };
  failed: boolean;
};
