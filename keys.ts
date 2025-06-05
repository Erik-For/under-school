export enum Action {
    Interact = "Interact",
    SkipText = "SkipText",
    MoveUp = "MoveUp",
    MoveDown = "MoveDown",
    MoveLeft = "MoveLeft",
    MoveRight = "MoveRight",
    Debug = "Debug",
    Debug2 = "Debug2",
    Debug3 = "Debug3",
    Escape = "Escape",
    EditorUpArrow = "EditorUpArrow",
    EditorDownArrow = "EditorDownArrow",
    EditorE = "EditorE",
    EditorR = "EditorR",
    EditorC = "EditorC",
    EditorV = "EditorV",
    EditorX = "EditorX",
    EditorY = "EditorY",
    EditorZ = "EditorZ",
    EditorF = "EditorF",
    EditorG = "EditorG",
    EditorH = "EditorH",
    EditorT = "EditorT",
    EditorShiftLeft = "EditorShiftLeft",
}

const Keys = {
    Interact: "KeyK",
    SkipText: "KeyL",
    MoveUp: "KeyW",
    MoveDown: "KeyS",
    MoveLeft: "KeyA",
    MoveRight: "KeyD",
    Debug: "KeyP",
    Debug2: "KeyO",
    Debug3: "KeyI",
    Escape: "Escape",
    EditorUpArrow: "ArrowUp",
    EditorDownArrow: "ArrowDown",
    EditorE: "KeyE",
    EditorR: "KeyR", 
    EditorC: "KeyC",
    EditorV: "KeyV",
    EditorX: "KeyX",
    EditorY: "KeyY",
    EditorZ: "KeyZ",
    EditorF: "KeyF",
    EditorG: "KeyG",
    EditorH: "KeyH",
    EditorT: "KeyT",
    EditorShiftLeft: "ShiftLeft",
};

type KeyName = keyof typeof Keys;

export function resetKeys() {
    // Reset keys to their default values
    Keys.Interact = "KeyK";
    Keys.SkipText = "KeyL";
    Keys.MoveUp = "KeyW";
    Keys.MoveDown = "KeyS";
    Keys.MoveLeft = "KeyA";
    Keys.MoveRight = "KeyD";
    Keys.Debug = "KeyP";
    Keys.Debug2 = "KeyO";
    Keys.Debug3 = "KeyI";
    Keys.Escape = "Escape";
    Keys.EditorUpArrow = "ArrowUp";
    Keys.EditorDownArrow = "ArrowDown";
    Keys.EditorE = "KeyE";
    Keys.EditorR = "KeyR";
    Keys.EditorC = "KeyC";
    Keys.EditorV = "KeyV";
    Keys.EditorX = "KeyX";
    Keys.EditorY = "KeyY";
    Keys.EditorZ = "KeyZ";
    Keys.EditorF = "KeyF";
    Keys.EditorG = "KeyG";
    Keys.EditorH = "KeyH";
    Keys.EditorT = "KeyT";
    Keys.EditorShiftLeft = "ShiftLeft";
}

export function setKey(key: KeyName, value: string) {
    // Set a specific key to a new value
    if (Keys.hasOwnProperty(key)) {
        Keys[key] = value;
    } else {
        console.warn(`Key ${key} does not exist in Keys.`);
    }
}

export function getKey(action: Action): string | undefined {
    // Get the key associated with a specific action
    switch (action) {
        case Action.Interact:
            return Keys.Interact;
        case Action.SkipText:
            return Keys.SkipText;
        case Action.MoveUp:
            return Keys.MoveUp;
        case Action.MoveDown:
            return Keys.MoveDown;
        case Action.MoveLeft:
            return Keys.MoveLeft;
        case Action.MoveRight:
            return Keys.MoveRight;
        case Action.Debug:
            return Keys.Debug;
        case Action.Debug2:
            return Keys.Debug2;
        case Action.Debug3:
            return Keys.Debug3;
        default:
            console.warn(`Action ${action} does not have a corresponding key.`);
            return undefined;
    }
}

export function isKeyUsed(key: string): boolean {
    // Check if a specific key is currently used by any action
    const entries = Object.entries(Keys) as [Action, string][];
    for (const [action, keyValue] of entries) {
        if (keyValue === key) {
            return true;
        }
    }
    return false;
}

export function getAction(key: string): Action | undefined {
    // Get the action associated with a specific key
    const entries = Object.entries(Keys) as [Action, string][];
    for (const [action, keyValue] of entries) {
        if (keyValue === key) {
            return action;
        }
    }
    console.warn(`Key ${key} does not correspond to any action.`);
    return undefined;
}

export default Keys;