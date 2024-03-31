import { TileCoordinate } from "./scene.js";

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

export class Pos {
    x: number;
    y: number;

    /**
     * Contains information about the position
     * @param x - the x position
     * @param y - the y position
     */
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Adds the given position to this position
     * @param pos - the position to add
     * @returns the new position
     */
    add(pos: Pos): Pos {
        return new Pos(this.x + pos.x, this.y + pos.y);
    }

    /**
     * Subtracts the given position from this position
     * @param pos - the position to subtract
     * @returns the new position
     */
    minus(pos: Pos): Pos {
        return new Pos(this.x - pos.x, this.y - pos.y);
    }

    /**
     * Multiplies this position by the given scalar value
     * @param scalar - the scalar value to multiply by
     * @returns the new position
     */
    multiply(scalar: number): Pos {
        return new Pos(this.x * scalar, this.y * scalar);
    }

    /**
     * Divides this position by the given scalar value
     * @param scalar - the scalar value to divide by
     * @returns the new position
     */
    divide(scalar: number): Pos {
        return new Pos(this.x / scalar, this.y / scalar);
    }

    /**
     * Converts this position to a TileCoordinate
     * @returns the new TileCoordinate
     */
    toTileCoordinate(): TileCoordinate {
        return new TileCoordinate(this.x, this.y);
    }

    /**
     * Rounds the x and y values of this position to the nearest integer
     * @returns the new position
     */
    round(): Pos {
        return new Pos(Math.round(this.x), Math.round(this.y));
    }

    /**
     * Returns a new position with the absolute values of the x and y values of this position
     * @returns the new position
     */
    abs(): Pos {
        return new Pos(Math.abs(this.x), Math.abs(this.y));
    }
}