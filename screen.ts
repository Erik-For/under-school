import { TileCoordinate } from "./scene.js";
import { Game, Pos } from "./game.js";

export class Camera {
    #x: number;
    #y: number;
    #shakeOffsetX: number = 0;
    #shakeOffsetY: number = 0;
    #cameraOffsetX: number = 0;
    #cameraOffsetY: number = 0;
    #amplitude = 1;
    #rippleEffect: boolean = false;

    /** 
     * 
     */
    constructor(x: number, y: number) {
        this.#x = x;
        this.#y = y;
        this.#shakeOffsetX = 0;
        this.#shakeOffsetY = 0; 
    }

    getCameraOffset(): Pos {
        return new Pos(this.#cameraOffsetX, this.#cameraOffsetY);
    }

    setCameraOffset(offset: Pos) {
        this.#cameraOffsetX = offset.x;
        this.#cameraOffsetY = offset.y;
    }

    setCameraOffsetSmooth(offset: Pos, duration: number) {
        const startOffset = this.getCameraOffset();
        const endOffset = offset;
        const startTime = performance.now();
        const endTime = startTime + duration;
        const interval = setInterval(() => {
        const currentTime = performance.now();
            const progress = (currentTime - startTime) / duration;
            this.setCameraOffset(new Pos(startOffset.x + (endOffset.x - startOffset.x) * progress, startOffset.y + (endOffset.y - startOffset.y) * progress));
        }, 1000 / 60);
        setTimeout(() => {
            clearInterval(interval);
        }, duration);
    }

    /** m
     * @returns the camera position
     */
    getPosition(): Pos {
        if (this.#rippleEffect) {
            const angle = 2 * Math.PI * Math.random();
            this.#shakeOffsetX = this.#amplitude * Math.cos(angle);
            this.#shakeOffsetY = this.#amplitude * Math.sin(angle);
        }
        return new Pos(this.#x + this.#shakeOffsetX + this.#cameraOffsetX, this.#y + this.#shakeOffsetY + this.#cameraOffsetY);
    }

    /** 
     * Setrs the camera by the given amount in the x and y direction
     * // TODO:
     * move the camera by the given amount in the x and y direction prevent the camera from moving if the screen bounds are reached
     * if the camera is at the edge of the screen and the bounds are reached the camera will not move ie this.x and this.y will not change
     */
    setPosition(pos: Pos /*, cameraWidth: number, cameraHeight: number, worldBounds: {minX: number, minY: number, maxX: number, maxY: number} */) {
        this.#x = pos.x;
        this.#y = pos.y;
    }

    /** 
     * Shakes the camera in a random pattern along the unit circle multiplied with the specified amplitude for the specified duration measured in ms.
     * 
     */
    cameraShake(duration: number, amplitude: number, game:Game): void {
        let shakeInterval = setInterval(() => {
            const angle = 2 * Math.PI * Math.random();
            this.#shakeOffsetX = amplitude * Math.cos(angle);
            this.#shakeOffsetY = amplitude * Math.sin(angle);
        }, 1000 / 60);

        setTimeout(() => {
            clearInterval(shakeInterval);
        }, duration)

        game.getAudioManager().playSoundEffect(game.getAssetLoader().getAudioAsset("assets/rumble.wav")!);
    }

    toggleRippleEffect(): void {
        this.#rippleEffect = !this.#rippleEffect;
    }

    
}

export class Screen {
    width: number;
    height: number;
    tileSize: number;
    renderScale: number;
    ctx: CanvasRenderingContext2D;
    fadeAlpha = 0;

    /**
     * Contains information about the screen
     * It is used to calculate rendering
     */
    constructor(width: number, height: number, tileSize: number, ctx: CanvasRenderingContext2D) {
        this.width = width;
        this.height = height;
        this.tileSize = tileSize;
        this.renderScale = 1;
        this.ctx = ctx;
    }
}