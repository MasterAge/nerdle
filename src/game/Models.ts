export const MAX_ATTEMPTS: number = 6;

export enum LetterStates {
    BASE, INCORRECT, CLOSE, CORRECT
}

export class LetterState {
    name: string;
    state: LetterStates;

    constructor(name: string) {
        this.name = name;
        this.state = LetterStates.BASE;
    }
}

export class KeyState extends LetterState {
    onClick: () => void;

    constructor(name: string, onClick: () => void) {
        super(name);
        this.onClick = onClick;
    }
}

interface PlayerData {
    played: number;
    wins: number;
    currentStreak: number;
    maxStreak: number;
    winDistribution: number[];
}

export class PlayerStats implements PlayerData{
    played: number;
    wins: number;
    currentStreak: number;
    maxStreak: number;
    winDistribution: number[];

    constructor(played?: number, wins?: number, currentStreak?: number, maxStreak?: number, winDistribution?: number[]) {
        this.played = played ?? 0;
        this.wins = wins ?? 0;
        this.currentStreak = currentStreak ?? 0;
        this.maxStreak = maxStreak ?? 0;
        this.winDistribution = winDistribution ?? new Array(MAX_ATTEMPTS).fill(0);
    }

    addGame(guesses: number, won: boolean) {
        this.played++;

        if (won) {
            this.wins++;
            this.currentStreak++;
            if (this.currentStreak > this.maxStreak) {
                this.maxStreak = this.currentStreak;
            }

            this.winDistribution[guesses - 1]++;
        } else {
            this.currentStreak = 0;
        }
    }

    getWinPercent() {
        return (this.played > 0) ? Math.round((this.wins / this.played) * 100) : 0;
    }
}


const PLAYER_STATS_KEY = "playerStats";

export function saveStats(stats: PlayerStats) {
    localStorage.setItem(PLAYER_STATS_KEY, JSON.stringify(stats))
}

export function loadStats(): PlayerStats {
    const statsString: string | null = localStorage.getItem(PLAYER_STATS_KEY);

    if (statsString) {
        const {played, wins, currentStreak, maxStreak, winDistribution} = JSON.parse(statsString) as PlayerData;
        return new PlayerStats(played, wins, currentStreak, maxStreak, winDistribution);
    }
    return new PlayerStats();
}
