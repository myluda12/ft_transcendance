import p5 from 'p5';


interface GameState {
    // Game variables
    width: number;
    height: number;
    aspectRatio: number;

    ball_x: number;
    ball_y: number;
    ball_direction_x: number;
    ball_direction_y: number;
    ball_radius: number;
    ball_speed: number;

    fr_paddle_x: number;
    fr_paddle_y: number;
  
    sec_paddle_x: number;
    sec_paddle_y: number;
  
    paddle_width: number;
    paddle_height: number;

    game_mode : number;
    state: string; // "waiting" | "play" | "scored" | "endGame"
    players : Array<string>;
    players_avatar : Array<string>;
    players_names : Array<string>;

    users: Array<string>;
    users_names: Array<string>;


    spectators: Array<string>;

    scores: Array<number>;
    score_limit : number;
    winner : string;
    winner_name: string;
    lastscored: string;
}

export type {GameState};

interface GameCount {
    count: number;
}

export type {GameCount}