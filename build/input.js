var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _InputHandler_relaventKeys;
export class InputHandler {
    constructor() {
        _InputHandler_relaventKeys.set(this, void 0);
        __classPrivateFieldSet(this, _InputHandler_relaventKeys, new Set(), "f");
        this.keys = new Map();
        this.keyClick = new Map();
        this.keyHeld = new Map();
        window.addEventListener('keydown', (event) => {
            if (!__classPrivateFieldGet(this, _InputHandler_relaventKeys, "f").has(event.code)) {
                return;
            }
            this.keys.set(event.code, true);
            if (this.keyClick.has(event.code)) {
                this.keyClick.get(event.code)();
            }
        });
        window.addEventListener('keyup', (event) => {
            if (!__classPrivateFieldGet(this, _InputHandler_relaventKeys, "f").has(event.code)) {
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
        if (!__classPrivateFieldGet(this, _InputHandler_relaventKeys, "f").has(key)) {
            __classPrivateFieldGet(this, _InputHandler_relaventKeys, "f").add(key);
        }
        this.keyClick.set(key, func);
    }
    /**
     * onHold is a function that takes a key and a function that should be called when the key is held
     * onHold is run once per frame
     */
    onHold(key, func) {
        if (!__classPrivateFieldGet(this, _InputHandler_relaventKeys, "f").has(key)) {
            __classPrivateFieldGet(this, _InputHandler_relaventKeys, "f").add(key);
        }
        this.keyHeld.set(key, func);
    }
    /**
     * trackKey trackes the key so isKeyDown is callable with the key
     */
    trackKey(key) {
        __classPrivateFieldGet(this, _InputHandler_relaventKeys, "f").add(key);
    }
}
_InputHandler_relaventKeys = new WeakMap();
