import { TileCoordinate } from "./scene.js";

export class Camera {
    #x: number;
    #y: number;

    constructor(x: number, y: number) {
        this.#x = x;
        this.#y = y;
    }


    getPosition(): Pos {
        return new Pos(this.#x, this.#y);
    }

    /** 
     * 
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

    constructor(width: number, height: number, tileSize: number) {
        this.width = width;
        this.height = height;
        this.tileSize = tileSize;
        this.renderScale = 1;
    }
}
export class Pos {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(pos: Pos): Pos {
        return new Pos(this.x + pos.x, this.y + pos.y);
    }
    minus(pos: Pos): Pos {
        return new Pos(this.x - pos.x, this.y - pos.y);
    }
    multiply(scalar: number): Pos {
        return new Pos(this.x * scalar, this.y * scalar);
    }
    devide(scalar: number) {
        return new Pos(this.x / scalar, this.y / scalar);
    }
    toTileCoordinate():TileCoordinate {
        return new TileCoordinate(this.x, this.y);
    }
    round(): Pos {
        return new Pos(Math.round(this.x), Math.round(this.y));
    }
    abs(): Pos {
        return new Pos(Math.abs(this.x), Math.abs(this.y));
    }
}