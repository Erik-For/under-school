import { Pos } from "./screen.js";
import * as Sprites from "./sprite.js";

/**
 * Represents a scene containing tiles.
 */
export class Scene {
    #mapData: Map<string, Map<string, Tile>>;

    constructor() {
        this.#mapData = new Map();
    }
    
    /**
     * Sets a tile at the specified position with collision rule and sprites.
     * @param pos - The position of the tile.
     * @param collisonRule - The collision rule for the tile.
     * @param sprites - The array of sprites for the tile.
     */
    setTile(pos: TileCoordinate, collisonRule: number, sprites: Array<Sprites.Sprite>) {
        if(!this.#mapData.has(pos.y.toString())) {
            this.#mapData.set(pos.y.toString(), new Map());
        }
        this.#mapData.get(pos.y.toString())!.set(pos.x.toString(), new Tile(pos, collisonRule, sprites));
    }

    /**
     * Gets the tile at the specified position.
     * @param pos - The position of the tile.
     * @returns The tile at the specified position, or undefined if not found.
     */
    getTile(pos: TileCoordinate) {
        return this.#mapData.get(pos.y.toString())?.get(pos.x.toString());
    }

    /**
     * Gets all the tiles in the scene.
     * @returns The map of tiles in the scene.
     */
    getTiles() {
        return this.#mapData;
    }

    /**
     * Removes the tile at the specified position.
     * @param pos - The position of the tile to remove.
     */
    removeTile(pos: TileCoordinate) {
        this.#mapData.get(pos.y.toString())?.delete(pos.x.toString());
    }
}

/**
 * Represents a tile in the scene.
 */
export class Tile {
    #pos: TileCoordinate;
    #collisonRule: CollisionRule;
    #sprites: Array<Sprites.Sprite>;

    constructor(pos: TileCoordinate, collisonRule: number, sprites: Array<Sprites.Sprite>) {
        this.#pos = pos;
        this.#collisonRule = collisonRule;
        this.#sprites = sprites;
    }

    /**
     * Gets the position of the tile.
     * @returns The position of the tile.
     */
    getPosition() {
        return this.#pos;
    }

    /**
     * Gets the sprites of the tile.
     * @returns The array of sprites for the tile.
     */
    getSprites() {
        return this.#sprites;
    }

    /**
     * Gets the collision rule of the tile.
     * @returns The collision rule for the tile.
     * Collision rules is a number that represents the type of collision that the tile has.
     * 0 - No collision
     * 1 - Solid
     * 2 - Center 8x8 solid
     * 3 - Left half solid
     * 4 - Right half solid
     * 5 - Top half solid
     * 6 - Bottom half solid
     * 7 - Top left corner solid
     * 8 - Top right corner solid
     * 9 - Bottom left corner solid
     * 10 - Bottom right corner solid
     */
    getCollisonRule(): CollisionRule {
        return this.#collisonRule;
    }

    /**
     * Sets the collision rule of the tile.
     * @param rule The collision rule for the tile.
     * Collision rules is a number that represents the type of collision that the tile has.
     * 0 - No collision
     * 1 - Solid
     * 2 - Center 8x8 solid
     * 3 - Left half solid
     * 4 - Right half solid
     * 5 - Top half solid
     * 6 - Bottom half solid
     * 7 - Top left corner solid
     * 8 - Top right corner solid
     * 9 - Bottom left corner solid
     * 10 - Bottom right corner solid
     */
    setCollisonRule(rule: CollisionRule) {
        this.#collisonRule = rule;
    }
}

/**
 * Represents the collision rules for tiles.
 * Collision rules is a number that represents the type of collision that the tile has.
 */
export enum CollisionRule {
    None = 0,
    Solid = 1,
    Center = 2,
    LeftHalf = 3,
    RightHalf = 4,
    TopHalf = 5,
    BottomHalf = 6,
    TopLeftCorner = 7,
    TopRightCorner = 8,
    BottomLeftCorner = 9,
    BottomRightCorner = 10
}

/**
 * Represents the coordinates of a tile.
 */
export class TileCoordinate {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Adds the specified position to the current position.
     * @param pos - The position to add.
     * @returns The new position after addition.
     */
    add(pos: TileCoordinate): TileCoordinate {
        return new TileCoordinate(this.x + pos.x, this.y + pos.y);
    }

    /**
     * Subtracts the specified position from the current position.
     * @param pos - The position to subtract.
     * @returns The new position after subtraction.
     */
    subtract(pos: TileCoordinate): TileCoordinate {
        return new TileCoordinate(this.x - pos.x, this.y - pos.y);
    }

    /**
     * Multiplies the current position by the specified scalar value.
     * @param scalar - The scalar value to multiply.
     * @returns The new position after multiplication.
     */
    multiply(scalar: number): TileCoordinate {
        return new TileCoordinate(this.x * scalar, this.y * scalar);
    }

    /**
     * Converts the tile coordinates to pos type.
     * @param tileSize - The size of a tile.
     * @returns The screen coordinates representing the tile coordinates.
     */
    toPos(tileSize: number): Pos {
        return new Pos(this.x * tileSize, this.y * tileSize);
    }
}

/**
 * Serializes the scene object into a JSON string.
 * @param scene - The scene object to be serialized.
 * @returns A JSON string representing the serialized scene.
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
                    x: tile.getPosition().x,
                    y: tile.getPosition().y
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
 * Deserializes a JSON string into a Scene object.
 * @param json - The JSON string to be deserialized.
 * @returns The deserialized Scene object.
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