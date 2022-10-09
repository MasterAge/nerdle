import {Settings} from "./Main";

export const MAX_ATTEMPTS: number = 6;

export enum LetterStates {
    BASE, INCORRECT, CLOSE, CORRECT
}

export class LetterState {
    name: string;
    state: LetterStates;

    constructor(name: string, state?: LetterStates) {
        this.name = name;
        this.state = state ?? LetterStates.BASE;
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
const SETTINGS_KEY = "settings";
const GUESSES_KEY = "guesses"

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

export function saveSettings(settings: Settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function loadSettings(): Settings {
    const settingsString: string | null = localStorage.getItem(SETTINGS_KEY);
    const defaultSettings = {hardMode: false, darkMode: false, highContrastMode: false, dailyNerdle: false, wordleWordlist: false};

    if (settingsString) {
        return {...defaultSettings, ...JSON.parse(settingsString)};
    }
    return defaultSettings;
}

export interface GuessStorage {
    guesses: Array<Array<LetterState>>;
    wordListIndex: number;
}

export function saveGuesses(guesses: Array<Array<LetterState>>, wordListIndex: number) {
    const guessStorage: GuessStorage = {guesses, wordListIndex}
    localStorage.setItem(GUESSES_KEY, JSON.stringify(guessStorage))
}

export function loadGuesses(): [Array<Array<LetterState>>, number] | undefined {
    const guessesString: string | null = localStorage.getItem(GUESSES_KEY);

    if (guessesString) {
        const guessStorage = JSON.parse(guessesString) as GuessStorage;

        return [guessStorage.guesses, guessStorage.wordListIndex];
    }
    return undefined;
}

export function clearGuesses() {
    localStorage.removeItem(GUESSES_KEY)
}
