import { TileCoordinate } from "./scene.js";
import { Pos } from "./game.js";

export class Camera {
    #x: number;
    #y: number;
    #offsetX: number = 0;
    #offsetY: number = 0;
    #amplitude = 1;
    #rippleEffect: boolean = false;

    /** 
     * 
     */
    constructor(x: number, y: number) {
        this.#x = x;
        this.#y = y;
    }


    /** m
     * @returns the camera position
     */
    getPosition(): Pos {
        if (this.#rippleEffect) {
            const angle = 2 * Math.PI * Math.random();
            this.#offsetX = this.#amplitude * Math.cos(angle);
            this.#offsetY = this.#amplitude * Math.sin(angle);
        }
        return new Pos(this.#x + this.#offsetX, this.#y + this.#offsetY);
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
    cameraShake(duration: number, amplitude: number): void {
        let shakeInterval = setInterval(() => {
            const angle = 2 * Math.PI * Math.random();
            this.#offsetX = amplitude * Math.cos(angle);
            this.#offsetY = amplitude * Math.sin(angle);
        }, 1000 / 60);

        setTimeout(() => {
            clearInterval(shakeInterval);
        }, duration)
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

    /**
     * Contains information about the screen
     * It is used to calculate rendering
     */
    constructor(width: number, height: number, tileSize: number) {
        this.width = width;
        this.height = height;
        this.tileSize = tileSize;
        this.renderScale = 1;
    }
}