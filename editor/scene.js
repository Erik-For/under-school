export class Scene {
    constructor() {
        this.mapData = new Map();
    }
    setTile(pos, collison, tiles) {
        if (!this.mapData.has(pos.y.toString())) {
            this.mapData.set(pos.y.toString(), new Map());
        }
        this.mapData.get(pos.y.toString()).set(pos.x.toString(), new Tile(pos, collison, tiles));
    }
    getTile(x, y) {
        var _a;
        return (_a = this.mapData.get(y.toString())) === null || _a === void 0 ? void 0 : _a.get(x.toString());
    }
    getTiles() {
        return this.mapData;
    }
}
export class Tile {
    constructor(pos, collison, sprites) {
        this.pos = pos;
        this.collison = collison;
        this.sprites = sprites;
    }
}
export class TileCoordinate {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
