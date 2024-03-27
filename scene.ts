import * as Sprites from "./sprite.js";

export class Scene {
    #mapData: Map<string, Map<string, Tile>>;

    constructor() {
        this.#mapData = new Map();
    }
    
    setTile(pos: TileCoordinate, collisonRule: number, sprites: Array<Sprites.Sprite>) {
        if(!this.#mapData.has(pos.getY().toString())) {
            this.#mapData.set(pos.getY().toString(), new Map());
        }
        this.#mapData.get(pos.getY().toString())!.set(pos.getX().toString(), new Tile(pos, collisonRule, sprites));
    }

    getTile(x: number, y: number) {
        return this.#mapData.get(y.toString())?.get(x.toString());
    }

    getTiles() {
        return this.#mapData;
    }

    removeTile(pos: TileCoordinate) {
        this.#mapData.get(pos.getY().toString())?.delete(pos.getX().toString());
    }
}

export class Tile {
    #pos: TileCoordinate;
    #collisonRule: number;
    #sprites: Array<Sprites.Sprite>;

    constructor(pos: TileCoordinate, collisonRule: number, sprites: Array<Sprites.Sprite>) {
        this.#pos = pos;
        this.#collisonRule = collisonRule;
        this.#sprites = sprites;
    }

    getPosition() {
        return this.#pos;
    }

    getSprites() {
        return this.#sprites;
    }

    getCollisonRule() {
        return this.#collisonRule;
    }

    setCollisonRule(rule: number) {
        this.#collisonRule = rule;
    }
}

export class TileCoordinate {
    #x: number;
    #y: number;

    constructor(x: number, y: number) {
        this.#x = x;
        this.#y = y;
    }

    getX() {
        return this.#x;
    }

    getY() {
        return this.#y;   
    }
}

/**
 * Turns a Scene object into a json string that can be saved
 */
export function serilizeScene(scene: Scene){
    const object: {
        [key: string]: {
            [key: string]:
                { // Tile class
                    col: number,
                    /* This can be figured out by the 2 keys so this is redudant
                    pos: { // class TileCoordinate serilized
                        x: number,
                        y: number 
                    },
                    */
                    spr: { // sprites list of Sprite classes serilized
                        src: string, // spriteSheetSrc
                        xO: number, // xOffset
                        yO: number, // yOffset
                        zi: number // zindex
                    }[]
                }
            }
        } = {}; // Add index signature
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
                    }
                })
            }
        });
    });
    return JSON.stringify(object);
}


/**
 * Turns a json object of the correct format into a Scnene object
 */
export function deserilizeScene(json: string): Scene {
    const serilizedObject: {
        [key: string]: {
            [key: string]:{ // Tile class
                col: number,
                /* This can be figured out by the 2 keys so this is redudant
                pos: { // class TileCoordinate serilized
                    x: number,
                    y: number 
                },
                */
                spr: { // sprites list of Sprite classes serilized
                    src: string, // spriteSheetSrc
                    xO: number, // xOffset
                    yO: number, // yOffset
                    zi: number // zindex
                }[]
            }
        }
    } = JSON.parse(json);
    let scene = new Scene();
    Object.keys(serilizedObject).forEach((yString) => {
        Object.keys(serilizedObject[yString]).forEach((xString) => {
            // get the pos based on the keys of the dicts inside of each other
            const pos = new TileCoordinate(Number(xString), Number(yString));
            const collisonRule = serilizedObject[yString][xString].col;
            const sprites: Array<Sprites.Sprite> = serilizedObject[yString][xString].spr.map((spriteData, index) => {
                return new Sprites.Sprite(spriteData.src, spriteData.xO, spriteData.yO, spriteData.zi);
            })
            scene.setTile(pos, collisonRule, sprites);
        })
    });
    return scene;
}