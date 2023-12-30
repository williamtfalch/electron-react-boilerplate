type SteamBans = {
  CommunityBanned: boolean;
  VACBanned: boolean;
  NumberOfVACBans: number;
  DaysSinceLastBan: number;
  NumberOfGameBans: number;
  EconomyBan: string;
  has_bans: boolean;
};

type PlayerInfo = {
  name: string;
  steam_id_64: string;
  country: string | null; // You can replace 'string' with the actual type of country if available
  steam_bans: SteamBans;
};

export type GetPlayersFastDTO = {
  result: PlayerInfo[];
  command: string;
  arguments: Record<string, any>;
  failed: boolean;
  error: string;
  forward_results: any | null; // Replace 'any' with a specific type if needed
};

export type GetPlayersFast = GetPlayersFastDTO['result'];
