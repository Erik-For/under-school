export class Input {
    constructor(keyWhitelist) {
        this.keys = new Map();
        window.addEventListener('keydown', (event) => {
            this.keys.set(event.code, true);
        });
        window.addEventListener('keyup', (event) => {
            this.keys.set(event.code, false);
        });
    }
    isKeyDown(key) {
        return this.keys.get(key) || false;
    }
}
