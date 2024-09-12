import { Screen } from "./screen.js";
import { TileCoordinate } from "./scene.js";
import { Pos } from "./game.js";
import { AssetLoader } from "./assetloader.js";
import { render, Sprite } from "./sprite.js";

/**
 * Converts the canvas position to world position.
 * @param {Pos} canvasPos - The canvas position.
 * @param {Pos} cameraPos - The camera position.
 * @param {Screen} screen - The screen object.
 * @returns {Pos} The world position.
 */
export function convertCanvasPosToWorldPos(canvasPos: Pos, cameraPos: Pos, screen: Screen): Pos {
    return canvasPos.minus(new Pos(screen.width / 2, screen.height / 2)).divide(screen.renderScale).add(cameraPos);
}

/**
 * Converts the world position to canvas position.
 * @param {Pos} worldPos - The world position.
 * @param {Pos} cameraPos - The camera position.
 * @param {Screen} screen - The screen object.
 * @returns {Pos} The canvas position.
 */
export function convertWorldPosToCanvasPos(worldPos: Pos, cameraPos: Pos, screen: Screen): Pos {
    return worldPos.minus(new Pos(cameraPos.x, cameraPos.y)).multiply(screen.renderScale).add(new Pos(screen.width / 2, screen.height / 2));
}

/**
 * Converts the world position to tile coordinate.
 * @param {Pos} worldPos - The world position.
 * @param {Screen} screen - The screen object.
 * @returns {TileCoordinate} The tile coordinate.
 */
export function convertWorldPosToTileCoordinate(worldPos: Pos, screen: Screen): TileCoordinate {
    return new TileCoordinate(Math.floor(worldPos.x / screen.tileSize), Math.floor(worldPos.y / screen.tileSize));
}

/**
 * Converts the tile coordinate to world position.
 * @param {TileCoordinate} tilePos - The tile coordinate.
 * @param {Screen} screen - The screen object.
 * @returns {Pos} The world position.
 */
export function convertTileCoordinateToWorldPos(tilePos: TileCoordinate, screen: Screen): Pos {
    return new Pos(tilePos.x * screen.tileSize, tilePos.y * screen.tileSize);
}

/**
 * Gets the sub tile coordinate.
 * @param {Pos} worldPos - The world position.
 * @param {Screen} screen - The screen object.
 * @returns {Pos} The sub tile coordinate.
 */
export function getSubTileCoordinate(worldPos: Pos, screen: Screen): Pos {
    return worldPos.minus(convertWorldPosToTileCoordinate(worldPos, screen).toPos(screen.tileSize));
}

export function drawImageRot(ctx: CanvasRenderingContext2D, image: ImageBitmap, pos: Pos , width: number ,height: number, rad: number){
    // Store the current context state (i.e. rotation, translation etc..)
    ctx.save()
    const x = pos.x;
    const y = pos.y;

    //Set the origin to the center of the image
    ctx.translate(x + width / 2, y + height / 2);

    //Rotate the canvas around the origin
    ctx.rotate(rad);

    //draw the image    
    ctx.drawImage(image ,width / 2 * (-1),height / 2 * (-1),width,height);

    // Restore canvas state as saved from above
    ctx.restore();
}

export function drawSprigeRot(ctx: CanvasRenderingContext2D, assetLoader: AssetLoader, sprite: Sprite, x: number, y: number , width: number ,height: number, rad: number){
    // Store the current context state (i.e. rotation, translation etc..)
    ctx.save()

    //Set the origin to the center of the image
    ctx.translate(x + width / 2, y + height / 2);

    //Rotate the canvas around the origin
    ctx.rotate(rad);

    //draw the image    
    
    render(ctx, assetLoader, sprite, width / 2 * (-1), height / 2 * (-1), width, height);

    // Restore canvas state as saved from above
    ctx.restore();
}