import { Asset, TextAsset } from "./assetloader.js";
import { Game, Pos} from "./game.js";
import * as Sprites from "./sprite.js";
import {fadeIn, fadeOut} from "./init.js";
import { convertWorldPosToCanvasPos, convertWorldPosToTileCoordinate, getSubTileCoordinate } from "./util.js";

/**
 * Represents a scene containing tiles.
 */
export class Scene {
    #sceneScript: SceneScript;
    #mapData: Map<number, Map<number, Tile>>;
    #scriptedObjectData: Array<ScriptedObject>;
    #scriptedBehaviour: Map<String, (game: Game, currentScene: Scene, pos: Pos, data: string) => void>;
    
    constructor() {
        this.#mapData = new Map();
        this.#scriptedObjectData = new Array();
        this.#sceneScript = {
            name: "default",
            onEnter: (prevScene: Scene, game: Game, currentScene: Scene) => {},
            onExit: (game: Game, currentScene: Scene) => {},
            render: (game: Game, currentScene: Scene) => {},
            getStartTile: () => new Map()
        }
        this.#scriptedBehaviour = new Map();        
    }
    
    getScriptName(): string {
        return this.#sceneScript.name;
    }

    /**
     * Sets a tile at the specified position with collision rule and sprites.
     * @param pos - The position of the tile.
     * @param collisonRule - The collision rule for the tile.
     * @param sprites - The array of sprites for the tile.
     */
    setTile(pos: TileCoordinate, collisonRule: number, sprites: Array<Sprites.Sprite>) {
        if(!this.#mapData.has(pos.y)) {
            this.#mapData.set(pos.y, new Map());
        }
        this.#mapData.get(pos.y)!.set(pos.x, new Tile(pos, collisonRule, sprites));
    }

    setSceneScript(sceneScript: SceneScript){
        this.#sceneScript = sceneScript;
    }

    /**
     * Gets the tile at the specified position.
     * @param pos - The position of the tile.
     * @returns The tile at the specified position, or undefined if not found.
     */
    getTile(pos: TileCoordinate) {
        return this.#mapData.get(pos.y)?.get(pos.x);
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
        this.#mapData.get(pos.y)?.delete(pos.x);
    }

    getScriptedObjects(): Array<ScriptedObject>{
        return this.#scriptedObjectData;
    }

    addScriptedObject(scriptedObject: ScriptedObject){
        this.#scriptedObjectData.push(scriptedObject);
    }

    addManyScriptedObjects(...scriptedObjects: ScriptedObject[]){
        this.#scriptedObjectData.push(...scriptedObjects);
    }

    removeScriptedObject(scriptedObject: ScriptedObject){
        const index = this.#scriptedObjectData.indexOf(scriptedObject);
        if(index > -1){
            this.#scriptedObjectData.splice(index, 1);
        }
    }

    onLoad(game: Game, prevScene: Scene) {
        const tileSize = game.getScreen().tileSize;
        prevScene.onExit(game, this);
        this.#sceneScript.onEnter(prevScene, game, this);
        let startPos = this.#sceneScript.getStartTile().get(prevScene.getScriptName())?.toPos(tileSize);
        let defaultPos = this.#sceneScript.getStartTile().get("default")?.toPos(tileSize);
        // new TileCoordinate(-4, -1).toPos(tileSize).add(new Pos(tileSize/2, tileSize/2))
        game.getPlayer().setPos(startPos? startPos : defaultPos? defaultPos : new Pos(0, 0));
    }

    onExit(game: Game, prevScene: Scene) {
        this.#sceneScript.onExit(game, prevScene);
    }

    onRender(game: Game) {
        this.#sceneScript.render(game, this);
    }

    registerBehaviour(name: string, behaviour: (game: Game, currentScene: Scene, pos: Pos, data: string) => void){
        this.#scriptedBehaviour.set(name, behaviour);
    }

    getBehaviour(data: string) {
        return this.#scriptedBehaviour.get(data);
    }
}

export class SceneAsset extends TextAsset implements Asset {
    scene: Scene | undefined;

    constructor(src: string) {
        super(src);
    }

    load(): Promise<string> {
        return new Promise(async (resolve, reject) => {
            let data = await super.load()
            this.scene =  await deserilizeScene(data)
            resolve(this.src)
        })
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

export interface SceneScript {
    name: string;
    onEnter: (prevScene: Scene ,game: Game, currentScene: Scene) => void;
    onExit: (game: Game, currentScene: Scene) => void;
    render: (game: Game, currentScene: Scene) => void;
    getStartTile: () => Map<String, TileCoordinate>;
}

export enum ObjectBehaviour {
    None,
    ChangeScene, // when the player walks into this object they are transported to a new scene
    Interactable, // when the player is facing that tile and presses the interact key (z) they will open the chest
    Movable, // when waling into this object the player will be able to push it
    ConveyorBelt, // when the player is standing on this tile they will be moved in the direction of the arrow
}

const behaivourImplementations: Record<ObjectBehaviour, (game: Game, currentScene: Scene, pos: Pos, data: string) => void> = {
    [ObjectBehaviour.ChangeScene]: async (game, scene, pos, data) => {

        let newScene = await deserilizeScene(game.getAssetLoader().getTextAsset(data)!.data!);
        game.getPlayer().denyCollisions();
        game.getPlayer().freezeMovment();
        const fadeToBlack = fadeIn(game);
        fadeToBlack.then(() => {
            game.setScene(newScene);
            newScene.onLoad(game, scene);
            const fade = fadeOut(game);
            fade.then(() => {
                game.getPlayer().allowCollisions();
                game.getPlayer().unfreezeMovment();
            });
        });
    },
    [ObjectBehaviour.Interactable]: function (game: Game, currentScene: Scene, pos: Pos, data: string): void {
        currentScene.getBehaviour(data)?.(game, currentScene, pos, data);
    },
    [ObjectBehaviour.Movable]: function (game: Game, currentScene: Scene, pos: Pos, data: string): void {
        throw new Error("Function not implemented.");
    },
    [ObjectBehaviour.ConveyorBelt]: function (game: Game, currentScene: Scene, pos: Pos, data: string): void {
        game.getPlayer().freezeMovment();
        let playerPos = game.getPlayer().getPos();
        let playerSubPos = getSubTileCoordinate(playerPos, game.getScreen());
        switch (data) {
            case "u": // up
                if (playerSubPos.x > 0 && playerSubPos.x < 7) {
                    playerPos.x += 1;
                } else if (playerSubPos.x > 8) {
                    playerPos.x -= 1;
                }
                playerPos.y -= 1;
                break;
            case "d": // down
                if (playerSubPos.x > 0 && playerSubPos.x < 7) {
                    playerPos.x += 1;
                } else if (playerSubPos.x > 8) {
                    playerPos.x -= 1;
                }
                playerPos.y += 1;
                break;
            case "l": // left
                if (playerSubPos.y > 0 && playerSubPos.y < 7) {
                    playerPos.y += 1;
                } else if (playerSubPos.y > 8) {
                    playerPos.y -= 1;
                }
                playerPos.x -= 1;
                break;
            case "r": // right
                if (playerSubPos.y > 0 && playerSubPos.y < 7) {
                    playerPos.y += 1;
                } else if (playerSubPos.y > 8) {
                    playerPos.y -= 1;
                }
                playerPos.x += 1;
                break;
        }

        let tilePos = convertWorldPosToTileCoordinate(playerPos, game.getScreen());
        let moveObj = game.getScene().getScriptedObjects().find((scriptedObject) => scriptedObject.pos.equals(tilePos.toPos(game.getScreen().tileSize)));

        if (moveObj?.type != ObjectBehaviour.ConveyorBelt) {
            game.getPlayer().unfreezeMovment();
            return;
        }
        game.getPlayer().setPos(playerPos);
    },
    [ObjectBehaviour.None]: function (game: Game, currentScene: Scene, pos: Pos, data: string): void {
    }
};

export function executeBehaviour(game: Game, currentScene: Scene, pos: Pos, type: ObjectBehaviour, data: string): void {
    behaivourImplementations[type](game, currentScene, pos, data);
}

/**
 * Represents a scene object with extended functionality compared to normal tiles
 */
export class ScriptedObject {
    pos: Pos;
    type: ObjectBehaviour;
    behaviourData: string;
    sprite: Sprites.Sprite;
    
    constructor(pos: Pos, type: ObjectBehaviour, behaviourData: string,  sprite: Sprites.Sprite) {
        this.pos = pos;
        this.type = type;
        this.behaviourData = behaviourData;
        this.sprite = sprite;
    }

    static constructFamily(itterations: number, constructor: (itteration: number) => ScriptedObject): ScriptedObject[] {
        let family: ScriptedObject[] = [];
        for(let i = 0; i < itterations; i++) {
            family.push(constructor(i));
        }
        return family;
    }
}

/**
 * Serializes the scene object into a JSON string.
 * @param scene - The scene object to be serialized.
 * @returns A JSON string representing the serialized scene.
*/
export function serilizeScene(scene: Scene){
    const object: {
        sceneScriptName: string,
        tileData: {
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
    }
} = {
        tileData: {},
        sceneScriptName: scene.getScriptName()
    }; // Add index signature
    scene.getTiles().forEach((row, ys) => {
        object.tileData[ys] = {};

        row.forEach((tile, xs) => {
            object.tileData[ys][xs] = {
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
export function deserilizeScene(json: string): Promise<Scene> {
    return new Promise(async (resolve, reject) => {
        const serilizedObject: {
            sceneScriptName: string,
            tileData: {
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
            }
        } = JSON.parse(json);
        let scene = new Scene();
        const module = await import(`./scene_scripts/${serilizedObject.sceneScriptName}`)
        const script = new module.default();
        scene.setSceneScript(script as SceneScript);
       
        // Load tile data
        Object.keys(serilizedObject.tileData).forEach((yString) => {
            Object.keys(serilizedObject.tileData[yString]).forEach((xString) => {
                // get the pos based on the keys of the dicts inside of each other
                const pos = new TileCoordinate(Number(xString), Number(yString));
                const collisonRule = serilizedObject.tileData[yString][xString].col;
                const sprites: Array<Sprites.Sprite> = serilizedObject.tileData[yString][xString].spr.map((spriteData, index) => {
                    return new Sprites.Sprite(spriteData.src, spriteData.xO, spriteData.yO, spriteData.zi);
                })
                scene.setTile(pos, collisonRule, sprites);
            })
        });
        resolve(scene);
    })
}
