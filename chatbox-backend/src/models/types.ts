export interface Auth<T> {
    token: string;
    message: T;
}

export interface Player {
    user_id: number;
    nickname: string;
}

export interface ChatMessage extends Player {
    id: number;
    time: Date;
    message: string;
}

export interface HighScore extends Player {
    id: number;
    time: Date;
    score: number;
}