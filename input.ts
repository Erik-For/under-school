import { Pos } from "./game.js";

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
    mouseClicked: boolean = false;
    #gamepads: Map<number, Gamepad>;
    #gamepadAxisState: Map<string, boolean>;

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
        this.#gamepadAxisState = new Map();

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
        this.#updateGamepads();
        
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

    #updateGamepads() {
        // Get the latest gamepad states
        const gamepads = navigator.getGamepads();
        
        for (const gamepad of gamepads) {
            if (!gamepad) continue;

            // Update axes (typically left stick)
            this.#handleGamepadAxis(gamepad);
            
            // Update buttons
            this.#handleGamepadButtons(gamepad);
        }
    }

    #handleGamepadAxis(gamepad: Gamepad) {
        // Handle left stick
        const horizontalAxis = gamepad.axes[0];
        const verticalAxis = gamepad.axes[1];

        // Map to WASD keys based on axis values
        if (Math.abs(horizontalAxis) > GAMEPAD_AXIS_THRESHOLD) {
            if (horizontalAxis > 0) {
                this.keys.set('KeyD', true);
                this.keys.set('KeyA', false);
            } else {
                this.keys.set('KeyA', true);
                this.keys.set('KeyD', false);
            }
        } else {
            this.keys.set('KeyA', false);
            this.keys.set('KeyD', false);
        }

        if (Math.abs(verticalAxis) > GAMEPAD_AXIS_THRESHOLD) {
            if (verticalAxis > 0) {
                this.keys.set('KeyS', true);
                this.keys.set('KeyW', false);
            } else {
                this.keys.set('KeyW', true);
                this.keys.set('KeyS', false);
            }
        } else {
            this.keys.set('KeyW', false);
            this.keys.set('KeyS', false);
        }
    }

    #handleGamepadButtons(gamepad: Gamepad) {
        // Map gamepad buttons to keyboard keys
        const buttonMappings: { [key: number]: string } = {
            0: 'KeyK', // A button -> Interact
            1: 'KeyL', // B button -> Skip Text
        };

        gamepad.buttons.forEach((button, index) => {
            const mappedKey = buttonMappings[index];
            if (!mappedKey) return;

            if (button.pressed) {
                if (!this.keys.get(mappedKey)) {
                    this.keys.set(mappedKey, true);
                    if (this.keyClick.has(mappedKey)) {
                        this.keyClick.get(mappedKey)!.forEach((func) => {
                            if (!func.ignoreInteractionPrevention && this.#preventInteraction) {
                                return;
                            }
                            func.func();
                        });
                    }
                }
            } else if (this.keys.get(mappedKey)) {
                this.keys.set(mappedKey, false);
                if (this.keyRelease.has(mappedKey)) {
                    this.keyRelease.get(mappedKey)!.forEach((func) => {
                        if (!func.ignoreInteractionPrevention && this.#preventInteraction) {
                            return;
                        }
                        func.func();
                    });
                }
            }
        });
    }
}