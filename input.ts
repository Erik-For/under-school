import { Pos } from "./game.js";

class InputCallback {
    func: () => any;
    ignoreInteractionPrevention: boolean;

    constructor(func: () => any, ignoreInteractionPrevention: boolean) {
        this.func = func;
        this.ignoreInteractionPrevention = ignoreInteractionPrevention;
    }
}

/**
 * Represents an input handler for handling keyboard and mouse input.
 */
export class InputHandler {
    keys: Map<string, boolean>;
    /**
     * keyClick is a map of keycodes to functions that should be called when the key is clicked
     */
    keyClick: Map<string, InputCallback[]>;
    /**
     * keyClick is a map of keycodes to functions that should be called when the update method is called and the key is held
     */
    keyHeld: Map<string, InputCallback[]>;
    /**
     * keyRelease is a map of keycodes to functions that should be called when the key is released
     */
    keyRelease: Map<string, InputCallback[]>;
    #preventInteraction: boolean = false;
    #mousePos: Pos;

    /**
     * Creates an instance of InputHandler.
     */
    constructor() {
        this.keys = new Map();
        this.keyClick = new Map();
        this.keyHeld = new Map();
        this.keyRelease = new Map();
        this.#mousePos = new Pos(0, 0);

        window.addEventListener('keydown', (event) => {
            this.keys.set(event.code, true);
            if (this.keyClick.has(event.code)) {
                this.keyClick.get(event.code)!.forEach((func) => {
                    if (!func.ignoreInteractionPrevention && this.#preventInteraction) {
                        return;
                    }
                    func.func()
                });
            }
        });
        window.addEventListener('keyup', (event) => {
            this.keys.set(event.code, false);
            if (this.keyRelease.has(event.code)){
                this.keyRelease.get(event.code)!.forEach((func) => {
                    if (!func.ignoreInteractionPrevention && this.#preventInteraction) {
                        return;
                    }
                    func.func()
                });
            }
        });
        window.addEventListener('mousemove', (event) => {
            this.#mousePos = new Pos(event.clientX, event.clientY);
        });
    }

    /**
     * Checks if a specific key is currently being held down.
     * @param key - The key to check.
     * @returns A boolean indicating whether the key is currently being held down.
     */
    isKeyDown(key: string): boolean {
        return this.keys.get(key) || false;
    }

    /**
     * Gets the current position of the mouse.
     * @returns The current position of the mouse.
     */
    getMousePos(): Pos {
        return this.#mousePos;
    }

    /**
     * Updates the input state. This method should be called once per frame.
     * It will call the functions that are set to be called when a key is held.
     * This method is meant to be run in a game loop.
     */
    update() {
        this.keys.forEach((value, key) => {
            if (value && this.keyHeld.has(key)) {
                this.keyHeld.get(key)!.forEach((func) => func.func());
            }
        });
    }

    /**
     * Sets a function to be called when a specific key is clicked.
     * @param key - The key to listen for.
     * @param func - The function to be called when the key is clicked.
     */
    onClick(key: string, func: () => any, ignoreInteractionPrevention: boolean = false) {
        if (!this.keyClick.has(key)) {
            this.keyClick.set(key, [new InputCallback(func, ignoreInteractionPrevention)]);
            return;
        }
        this.keyClick.get(key)!.push(new InputCallback(func, ignoreInteractionPrevention));
    }

    /**
     * Sets a function to be called when a specific key is released.
     * @param key - The key to listen for.
     * @param func - The function to be called when the key is released.
     */
    onRelease(key: string, func: () => any, ignoreInteractionPrevention: boolean = false) {
        if (!this.keyRelease.has(key)) {
            this.keyRelease.set(key, [new InputCallback(func, ignoreInteractionPrevention)]);
            return;
        }
        this.keyRelease.get(key)!.push(new InputCallback(func, ignoreInteractionPrevention));
    }

    /**
     * Sets a function to be called when a specific key is held.
     * @param key - The key to listen for.
     * @param func - The function to be called when the key is held.
     */
    onHold(key: string, func: () => any, ignoreInteractionPrevention: boolean = false) {
        if (!this.keyHeld.has(key)) {
            this.keyHeld.set(key, [new InputCallback(func, ignoreInteractionPrevention)]);
            return;
        }
        this.keyHeld.get(key)!.push(new InputCallback(func, ignoreInteractionPrevention));
    }

    /**
     * Prevents the player from interacting with the game.
     */
    preventInteraction() {
        this.#preventInteraction = true;
    }

    /**
     * Allows the player to interact with the game.
     */
    allowInteraction() {
        this.#preventInteraction = false;
    }

    /**
     * Returns whether the player is allowed to interact with the game.
     * @returns True if the player is allowed to interact, false otherwise.
     */
    isInteractionAllowed(): boolean {
        return !this.#preventInteraction;
    }
}