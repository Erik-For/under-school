export class Input {
    keys: Map<string, boolean>;

    constructor(keyWhitelist: Set<string>) {
        this.keys = new Map();
        window.addEventListener('keydown', (event) => {
            this.keys.set(event.code, true);
        });
        window.addEventListener('keyup', (event) => {
            this.keys.set(event.code, false);
        });
    }
    isKeyDown(key: string) {
        return this.keys.get(key) || false;
    }
}

