var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Scene_mapData, _Tile_pos, _Tile_collisonRule, _Tile_sprites, _TileCoordinate_x, _TileCoordinate_y;
import * as Sprites from "./sprite.js";
export class Scene {
    constructor() {
        _Scene_mapData.set(this, void 0);
        __classPrivateFieldSet(this, _Scene_mapData, new Map(), "f");
    }
    setTile(pos, collisonRule, sprites) {
        if (!__classPrivateFieldGet(this, _Scene_mapData, "f").has(pos.getY().toString())) {
            __classPrivateFieldGet(this, _Scene_mapData, "f").set(pos.getY().toString(), new Map());
        }
        __classPrivateFieldGet(this, _Scene_mapData, "f").get(pos.getY().toString()).set(pos.getX().toString(), new Tile(pos, collisonRule, sprites));
    }
    getTile(x, y) {
        var _a;
        return (_a = __classPrivateFieldGet(this, _Scene_mapData, "f").get(y.toString())) === null || _a === void 0 ? void 0 : _a.get(x.toString());
    }
    getTiles() {
        return __classPrivateFieldGet(this, _Scene_mapData, "f");
    }
    removeTile(pos) {
        var _a;
        (_a = __classPrivateFieldGet(this, _Scene_mapData, "f").get(pos.getY().toString())) === null || _a === void 0 ? void 0 : _a.delete(pos.getX().toString());
    }
}
_Scene_mapData = new WeakMap();
export class Tile {
    constructor(pos, collisonRule, sprites) {
        _Tile_pos.set(this, void 0);
        _Tile_collisonRule.set(this, void 0);
        _Tile_sprites.set(this, void 0);
        __classPrivateFieldSet(this, _Tile_pos, pos, "f");
        __classPrivateFieldSet(this, _Tile_collisonRule, collisonRule, "f");
        __classPrivateFieldSet(this, _Tile_sprites, sprites, "f");
    }
    getPosition() {
        return __classPrivateFieldGet(this, _Tile_pos, "f");
    }
    getSprites() {
        return __classPrivateFieldGet(this, _Tile_sprites, "f");
    }
    getCollisonRule() {
        return __classPrivateFieldGet(this, _Tile_collisonRule, "f");
    }
    setCollisonRule(rule) {
        __classPrivateFieldSet(this, _Tile_collisonRule, rule, "f");
    }
}
_Tile_pos = new WeakMap(), _Tile_collisonRule = new WeakMap(), _Tile_sprites = new WeakMap();
export class TileCoordinate {
    constructor(x, y) {
        _TileCoordinate_x.set(this, void 0);
        _TileCoordinate_y.set(this, void 0);
        __classPrivateFieldSet(this, _TileCoordinate_x, x, "f");
        __classPrivateFieldSet(this, _TileCoordinate_y, y, "f");
    }
    getX() {
        return __classPrivateFieldGet(this, _TileCoordinate_x, "f");
    }
    getY() {
        return __classPrivateFieldGet(this, _TileCoordinate_y, "f");
    }
}
_TileCoordinate_x = new WeakMap(), _TileCoordinate_y = new WeakMap();
/**
 * Turns a Scene object into a json string that can be saved
 */
export function serilizeScene(scene) {
    const object = {}; // Add index signature
    scene.getTiles().forEach((row, ys) => {
        object[ys] = {};
        row.forEach((tile, xs) => {
            object[ys][xs] = {
                col: tile.getCollisonRule(),
                /* This can be figured out by the 2 keys so this is redudant
                pos: {
                    x: tile.getPosition().getX(),
                    y: tile.getPosition().getY()
                },
                */
                spr: tile.getSprites().map((sprite) => {
                    return {
                        src: sprite.spriteSheetSrc,
                        xO: sprite.xOffset,
                        yO: sprite.yOffset,
                        zi: sprite.zindex
                    };
                })
            };
        });
    });
    return JSON.stringify(object);
}
/**
 * Turns a json object of the correct format into a Scnene object
 */
export function deserilizeScene(json) {
    const serilizedObject = JSON.parse(json);
    let scene = new Scene();
    Object.keys(serilizedObject).forEach((yString) => {
        Object.keys(serilizedObject[yString]).forEach((xString) => {
            // get the pos based on the keys of the dicts inside of each other
            const pos = new TileCoordinate(Number(xString), Number(yString));
            const collisonRule = serilizedObject[yString][xString].col;
            const sprites = serilizedObject[yString][xString].spr.map((spriteData, index) => {
                return new Sprites.Sprite(spriteData.src, spriteData.xO, spriteData.yO, spriteData.zi);
            });
            scene.setTile(pos, collisonRule, sprites);
        });
    });
    return scene;
}
