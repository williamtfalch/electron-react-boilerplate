export type GetGamestateDTO = {
  result: {
    num_allied_players: number;
    num_axis_players: number;
    allied_score: number;
    axis_score: number;
    time_remaining: string;
    raw_time_remaining: string;
    current_map: string;
    next_map: string;
  };
  command: string;
  arguments: Record<string, any>;
  failed: boolean;
  error: string;
  forward_results: null | any;
};

export type Gamestate = GetGamestateDTO['result'];
