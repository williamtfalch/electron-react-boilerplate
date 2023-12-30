export type HistoricalLog = {
  id: number;
  version: number;
  creation_time: string;
  event_time: number;
  type: string;
  player_name: string;
  player1_id: number;
  player2_name: string;
  player2_id: number;
  raw: string;
  content: string;
  server: string;
  weapon: string;
};

export type GetHistoricalLogsDTO = {
  result: HistoricalLog[];
  command: string;
  arguments: {
    limit: number;
    player_name: string | null;
    action: string | null;
  };
  failed: boolean;
  error: string | null;
  forwards_results: null;
};

export type HistoricalLogs = GetHistoricalLogsDTO['result'];
