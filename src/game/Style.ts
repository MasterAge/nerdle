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

export const highContrast: ColourTheme = {
    colors: {
        correct: '#f17510',
        close: '#339aef',
        incorrect: '#7e7d7d',
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
