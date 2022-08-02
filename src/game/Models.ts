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