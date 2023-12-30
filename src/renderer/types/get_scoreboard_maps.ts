import type { PlayerStats } from './get_map_scoreboard';

export type GameMetadata = {
  just_name: string;
  long_name: string;
  id: number;
  creation_time: string;
  start: string;
  end: string;
  server_number: number;
  map_name: string;
  player_stats: PlayerStats[]; // Define PlayerStats type accordingly
};

export type GetScoreboardMapsDTO = {
  result: {
    page: number;
    page_size: number;
    total: number;
    maps: GameMetadata[];
  };
  command: string;
  arguments: null;
  failed: boolean;
  error: null | string;
  forwards_results: null;
};

export type ScoreboardMaps = GetScoreboardMapsDTO['result'];
