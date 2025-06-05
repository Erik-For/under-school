import { Pos } from "./game.js";
import { Action, getAction, getKey } from "./keys.js";

class InputCallback {
    func: () => any;
    ignoreInteractionPrevention: boolean;

    constructor(func: () => any, ignoreInteractionPrevention: boolean) {
        this.func = func;
        this.ignoreInteractionPrevention = ignoreInteractionPrevention;
    }
}

// Add these constants at the top of the file
const GAMEPAD_DEADZONE = 0.2;
const GAMEPAD_AXIS_THRESHOLD = 0.5;

/**
 * Represents an input handler for handling keyboard and mouse input.
 */
export class InputHandler {
    keys: Map<Action, boolean>;
    /**
     * keyClick is a map of keycodes to functions that should be called when the key is clicked
     */
    keyClick: Map<Action, InputCallback[]>;
    /**
     * keyClick is a map of keycodes to functions that should be called when the update method is called and the key is held
     */
    keyHeld: Map<Action, InputCallback[]>;
    /**
     * keyRelease is a map of keycodes to functions that should be called when the key is released
     */
    keyRelease: Map<Action, InputCallback[]>;
    #preventInteraction: boolean = false;
    #mousePos: Pos;
    mouseClicked: boolean = false;
    #gamepads: Map<number, Gamepad>;

    /**
     * Creates an instance of InputHandler.
     */
    constructor() {
        this.keys = new Map();
        this.keyClick = new Map();
        this.keyHeld = new Map();
        this.keyRelease = new Map();
        this.#mousePos = new Pos(0, 0);
        this.#gamepads = new Map();

        window.addEventListener('keydown', (event) => {
            const action: Action | undefined = getAction(event.code);
            if(action == undefined) return;
            this.keys.set(action, true);
            if (this.keyClick.has(action)) {
                this.keyClick.get(action)!.forEach((func) => {
                    if (!func.ignoreInteractionPrevention && this.#preventInteraction) {
                        return;
                    }
                    func.func()
                });
            }
        });
        window.addEventListener('keyup', (event) => {
            const action: Action | undefined = getAction(event.code);
            if(action == undefined) return;
            this.keys.set(action, false);
            if (this.keyRelease.has(action)){
                this.keyRelease.get(action)!.forEach((func) => {
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
        window.addEventListener('mousedown', () => {
            this.mouseClicked = true;
        });
        window.addEventListener('mouseup', () => {
            this.mouseClicked = false;
        });

        // Add gamepad connection/disconnection handlers
        window.addEventListener("gamepadconnected", (e) => {
            this.#gamepads.set(e.gamepad.index, e.gamepad);
            console.log("Gamepad connected:", e.gamepad);
        });
        
        window.addEventListener("gamepaddisconnected", (e) => {
            this.#gamepads.delete(e.gamepad.index);
            console.log("Gamepad disconnected:", e.gamepad);
        });
    }

    /**
     * Checks if a specific key is currently being held down.
     * @param key - The key to check.
     * @returns A boolean indicating whether the key is currently being held down.
     */
    isKeyDown(action: Action): boolean {
        return this.keys.get(action) || false;
    }

    /**
     * Gets the current position of the mouse.
     * @returns The current position of the mouse.
     */
    getMousePos(): Pos {
        return this.#mousePos;
    }

    isMouseClicked() {
        let clicked = this.mouseClicked;
        this.mouseClicked = false;
        return clicked;
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
    onClick(action: Action, func: () => any, ignoreInteractionPrevention: boolean = false) {
        if (!this.keyClick.has(action)) {
            this.keyClick.set(action, [new InputCallback(func, ignoreInteractionPrevention)]);
            return;
        }
        this.keyClick.get(action)!.push(new InputCallback(func, ignoreInteractionPrevention));
    }

    /**
     * Sets a function to be called when a specific key is released.
     * @param key - The key to listen for.
     * @param func - The function to be called when the key is released.
     */
    onRelease(action: Action, func: () => any, ignoreInteractionPrevention: boolean = false) {
        if (!this.keyRelease.has(action)) {
            this.keyRelease.set(action, [new InputCallback(func, ignoreInteractionPrevention)]);
            return;
        }
        this.keyRelease.get(action)!.push(new InputCallback(func, ignoreInteractionPrevention));
    }

    /**
     * Sets a function to be called when a specific key is held.
     * @param key - The key to listen for.
     * @param func - The function to be called when the key is held.
     */
    onHold(action: Action, func: () => any, ignoreInteractionPrevention: boolean = false) {
        if (!this.keyHeld.has(action)) {
            this.keyHeld.set(action, [new InputCallback(func, ignoreInteractionPrevention)]);
            return;
        }
        this.keyHeld.get(action)!.push(new InputCallback(func, ignoreInteractionPrevention));
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