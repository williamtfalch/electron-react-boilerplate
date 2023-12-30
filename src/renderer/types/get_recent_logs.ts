export type RecentLog = {
  version: number;
  timestamp_ms: number;
  relative_time_ms: number;
  raw: string;
  line_without_time: string;
  action: string;
  player: string;
  steam_id_64_1: string;
  player2: null | string;
  steam_id_64_2: null | string;
  weapon: null | string;
  message: string;
  sub_content: null | string;
};

export type GetRecentLogsDTO = {
  result: {
    logs: RecentLog[];
    players: string[];
    actions: string[];
  };
  command: string;
  arguments: {
    start: number;
    end: number;
    filter_player: null | string;
    filter_action: null | string;
    inclusive_filter: null | string;
  };
  failed: boolean;
  error: null | string;
  forwards_results: null | any; // Adjust the type accordingly
};
