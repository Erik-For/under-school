import { Sprite } from "./sprite";

export class Scene {
    mapData: Map<string, Map<string, Tile>>;

    constructor() {
        this.mapData = new Map();
    }
    
    setTile(pos: { x: number, y: number }, collison: number, tiles: Array<Sprite>) {
        if(!this.mapData.has(pos.y.toString())) {
            this.mapData.set(pos.y.toString(), new Map());
        }
        this.mapData.get(pos.y.toString())!.set(pos.x.toString(), new Tile(pos, collison, tiles));
    }

    getTile(x: number, y: number) {
        return this.mapData.get(y.toString())?.get(x.toString());
    }

    getTiles() {
        return this.mapData;
    }
}

export class Tile {
    pos: TileCoordinate;
    collison: number;
    sprites: Array<Sprite>;

    constructor(pos: TileCoordinate, collison: number, sprites: Array<Sprite>) {
        this.pos = pos;
        this.collison = collison;
        this.sprites = sprites;
    }
}

export class TileCoordinate {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}