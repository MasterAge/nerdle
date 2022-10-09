import {LetterStates} from "./Models";
import {Theme} from "@emotion/react";

export interface ColourTheme extends Theme {
    colors: {
        correct: string;
        close: string;
        incorrect: string;
    }
}

export const defaultTheme: ColourTheme = {
    colors: {
        correct: '#4af34a',
        close: '#eedd20',
        incorrect: '#7e7d7d',
    }
}

export const defaultDarkTheme: ColourTheme = {
    colors: {
        correct: '#538d4e',
        close: '#b59f3b',
        incorrect: '#3a3a3c',
    }
}

export const highContrast: ColourTheme = {
    colors: {
        correct: '#f17510',
        close: '#339aef',
        incorrect: '#7e7d7d',
    }
}

export const highContrastDark: ColourTheme = {
    colors: {
        correct: highContrast.colors.correct,
        close: highContrast.colors.close,
        incorrect: '#3a3a3c',
    }
}

export class GameTheme implements Theme {
    isHighContrast: boolean;
    colourTheme: ColourTheme;
    background: string;
    accents: string
    text: string;


    constructor(isHighContrast: boolean = false, background: string, text: string, accents: string) {
        // This exists to make switching themes easier
        this.colourTheme = defaultTheme;
        this.isHighContrast = isHighContrast;
        this.background = background;
        this.text = text;
        this.accents = accents;
    }
}

export class LightTheme extends GameTheme {
    constructor(isHighContrast: boolean = false) {
        super(isHighContrast, "white", "black", "lightgrey");
        this.colourTheme = (isHighContrast) ? highContrast : defaultTheme;
    }
}

export class DarkTheme extends GameTheme {
    constructor(isHighContrast: boolean = false) {
        super(isHighContrast, "#121213", "white", "#6c6c6c");
        this.colourTheme = (isHighContrast) ? highContrastDark : defaultDarkTheme;
    }
}

export function getColour(state: LetterStates, theme: ColourTheme): string {
    switch (state) {
        case LetterStates.INCORRECT:
            return theme.colors.incorrect;
        case LetterStates.CLOSE:
            return theme.colors.close;
        case LetterStates.CORRECT:
            return theme.colors.correct;
        default:
            return "";
    }
}
