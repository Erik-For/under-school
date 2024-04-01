import { TileCoordinate } from "./scene.js";
import { Pos } from "./game.js";

export class Camera {
    #x: number;
    #y: number;

    /** 
     * 
     */
    constructor(x: number, y: number) {
        this.#x = x;
        this.#y = y;
    }


    /** 
     * @returns the camera position
     */
    getPosition(): Pos {
        return new Pos(this.#x, this.#y);
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