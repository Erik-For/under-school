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
}

export function setKey(key: KeyName, value: string) {
    // Set a specific key to a new value
    if (Keys.hasOwnProperty(key)) {
        Keys[key] = value;
    } else {
        console.warn(`Key ${key} does not exist in Keys.`);
    }
}


export default Keys;