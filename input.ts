import { Pos } from "./screen.js";

export class InputHandler {
    keys: Map<string, boolean>;
    /**
     * keyClick is a map of keycodes to functions that should be called when the key is clicked
    */
    keyClick: Map<string, (() => any)[]>;
    /**
     * keyClick is a map of keycodes to functions that should be called when the update method is called and the key is held
    */
    keyHeld: Map<string, (() => any)[]>;
    /**
     * keyRelease is a map of keycodes to functions that should be called when the key is released
     */
    keyRelease: Map<string, (() => any)[]>;

    #mousePos: Pos;

    constructor() {
        this.keys = new Map();
        this.keyClick = new Map();
        this.keyHeld = new Map();
        this.keyRelease = new Map();
        this.#mousePos = new Pos(0, 0);
        
        window.addEventListener('keydown', (event) => {
            this.keys.set(event.code, true);
            if (this.keyClick.has(event.code)) {
                this.keyClick.get(event.code)!.forEach((func) => func());
            }
        });
        window.addEventListener('keyup', (event) => {
            this.keys.set(event.code, false);
            if (this.keyRelease.has(event.code)) {
                this.keyRelease.get(event.code)!.forEach((func) => func());
            }
        });
        window.addEventListener('mousemove', (event) => {
            this.#mousePos = new Pos(event.clientX, event.clientY);
        });
        setInterval(() => {
            this.update();
        }, Math.round(1000/60));
    }

    isKeyDown(key: string): boolean {
        return this.keys.get(key) || false;
    }

    getMousePos(): Pos {
        return this.#mousePos;
    }

    /**
     * update is a function that should be called once per frame
     * it will call the functions that are set to be called when a key is held
     * this is meant to be run in a game loop
     */
    update() {
        this.keys.forEach((value, key) => {
            if (value && this.keyHeld.has(key)) {
                this.keyHeld.get(key)!.forEach((func) => func());
            }
        });
    }
    
    /**
     * onClick is a function that takes a key and a function that should be called when the key is clicked
     * onClick is run once per click
     */
    onClick(key: string, func: () => any) {
        if(!this.keyClick.has(key)) {
            this.keyClick.set(key, [func]);
            return;
        }
        this.keyClick.get(key)!.push(func);
    }

    /**
     *  
     */
    onRelease(key: string, func: () => any) {
        if(!this.keyRelease.has(key)) {
            this.keyRelease.set(key, [func]);
            return;
        }
        this.keyRelease.get(key)!.push(func);
    }

    /**
     * onHold is a function that takes a key and a function that should be called when the key is held
     * onHold is run once per frame
     */
    onHold(key: string, func: () => any) {
        if(!this.keyHeld.has(key)) {
            this.keyHeld.set(key, [func]);
            return;
        }
        this.keyHeld.get(key)!.push(func);
    }
}
