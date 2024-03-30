import { Pos, Screen } from "./screen.js";
import { TileCoordinate } from "./scene.js";

// function convertCanvasPosToWorldPos(canvasPos: { x: number, y: number }, cameraPos: { x: number, y: number }, cameraWidth: number, cameraHeight: number): { x: number, y: number } {
//     return {x: canvasPos.x + cameraPos.x - cameraWidth / 2, y: canvasPos.y + cameraPos.y - cameraHeight / 2};
// }
    
// function convertWorldPosToTilePos(worldPos: { x: number, y: number }, screen: {}): { x: number, y: number } {
//     return {x: Math.floor(worldPos.x / this.renderdTileScale), y: Math.floor(worldPos.y / this.renderdTileScale)};
// }
    
// function convertTilePosToWorldPos(tilePos: { x: number, y: number }): { x: number, y: number } {
//     return {x: tilePos.x * this.renderdTileScale, y: tilePos.y * this.renderdTileScale};
// }
    
// function convertWorldPosToCanvasPos(worldPos: { x: number, y: number }, cameraPos: { x: number, y: number }, cameraWidth: number, cameraHeight: number): { x: number, y: number } {
//     return {x: worldPos.x - cameraPos.x + cameraWidth / 2, y: worldPos.y - cameraPos.y + cameraHeight / 2};
// }


export function convertCanvasPosToWorldPos(canvasPos: Pos, cameraPos: Pos, screen: Screen): Pos {
    return canvasPos.minus(new Pos(screen.width / 2, screen.height / 2)).devide(screen.renderScale).add(cameraPos);
}
export function convertWorldPosToCanvasPos(worldPos: Pos, cameraPos: Pos, screen: Screen): Pos {
    return worldPos.minus(new Pos(cameraPos.x, cameraPos.y)).multiply(screen.renderScale).add(new Pos(screen.width / 2, screen.height / 2));
}

export function convertWorldPosToTileCoordinate(worldPos: Pos, screen: Screen): TileCoordinate {
    return new TileCoordinate(Math.floor(worldPos.x / screen.tileSize), Math.floor(worldPos.y / screen.tileSize));
}
export function convertTileCoordinateToWorldPos(tilePos: TileCoordinate, screen: Screen): Pos {
    return new Pos(tilePos.x * screen.tileSize, tilePos.y * screen.tileSize);
}

export function getSubTileCoordinate(worldPos: Pos, screen: Screen): Pos {
    return worldPos.minus(convertWorldPosToTileCoordinate(worldPos, screen).toPos().multiply(screen.tileSize));
}


