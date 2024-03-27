export class InputHandler {
    constructor() {
        this.relaventKeys = new Set();
        this.keys = new Map();
        this.keyClick = new Map();
        this.keyHeld = new Map();
        window.addEventListener('keydown', (event) => {
            if (!this.relaventKeys.has(event.code)) {
                return;
            }
            this.keys.set(event.code, true);
            if (this.keyClick.has(event.code)) {
                this.keyClick.get(event.code)();
            }
        });
        window.addEventListener('keyup', (event) => {
            if (!this.relaventKeys.has(event.code)) {
                return;
            }
            this.keys.set(event.code, false);
        });
    }
    isKeyDown(key) {
        return this.keys.get(key) || false;
    }
    /**
     * update is a function that should be called once per frame
     * it will call the functions that are set to be called when a key is held
     * this is meant to be run in a game loop
     */
    update() {
        this.keys.forEach((value, key) => {
            if (value && this.keyHeld.has(key)) {
                this.keyHeld.get(key)();
            }
        });
    }
    /**
     * onClick is a function that takes a key and a function that should be called when the key is clicked
     * onClick is run once per click
     */
    onClick(key, func) {
        if (!this.relaventKeys.has(key)) {
            this.relaventKeys.add(key);
        }
        this.keyClick.set(key, func);
    }
    /**
     * onHold is a function that takes a key and a function that should be called when the key is held
     * onHold is run once per frame
     */
    onHold(key, func) {
        if (!this.relaventKeys.has(key)) {
            this.relaventKeys.add(key);
        }
        this.keyHeld.set(key, func);
    }
}
