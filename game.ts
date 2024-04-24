import { Camera, Screen } from "./screen.js";
import { InputHandler } from "./input.js";
import { Player } from "./player.js";
import { Scene, TileCoordinate, executeBehaviour } from "./scene.js";
import { AssetLoader } from "./assetloader.js";
import { SequenceExecutor } from "./sequence.js";
import * as Util from "./util.js";

/**
 * Represents a game.
 */
export class Game {
    #scene: Scene;
    #player: Player;
    #camera: Camera;
    #screen: Screen;
    #inputHandler: InputHandler;
    #assetLoader: AssetLoader;
    #sequenceExecutor: SequenceExecutor;

    /**
     * Creates a new instance of the Game class.
     * @param scene The inital scene of the game.
     * @param startPos The starting position of the player.
     * @param screen The screen for rendering the game.
     * @param assetLoader The asset loader of the game.
     */
    constructor(scene: Scene, startPos: Pos, screen: Screen, assetLoader: AssetLoader) {
        this.#screen = screen;
        this.#assetLoader = assetLoader;
        this.#scene = scene;
        this.#camera = new Camera(startPos.x, startPos.y);
        this.#inputHandler = new InputHandler();
        this.#player = new Player(startPos.x, startPos.y, this);
        this.#sequenceExecutor = new SequenceExecutor();

        setInterval(() => { // Game ticks
            this.#inputHandler.update();
            // check if the player is in a scripted object
            const playerTilePos = Util.convertWorldPosToTileCoordinate(this.getPlayer().getPosition(), this.getScreen());
            
            let scriptedObject = this.#scene.getScriptedObjects().find((scriptedObject) => scriptedObject.pos.equals(playerTilePos.toPos(16)));            
            if(scriptedObject){
                executeBehaviour(this, this.#scene, scriptedObject.pos, scriptedObject.type, scriptedObject.behaviourData);
            }
        }, Math.round(1000 / 60));
    }

    /**
     * Gets the player of the game.
     * @returns The player object.
     */
    getPlayer(): Player {
        return this.#player;
    }

    /**
     * Gets the scene of the game.
     * @returns The scene object.
     */
    getScene(): Scene {
        return this.#scene;
    }

    /**
     * Gets the camera of the game.
     * @returns The camera object.
     */
    getCamera(): Camera {
        return this.#camera;
    }

    /**
     * Gets the screen of the game.
     * @returns The screen object.
     */
    getScreen(): Screen {
        return this.#screen;
    }

    /**
     * Gets the input handler of the game.
     * @returns The input handler object.
     */
    getInputHandler(): InputHandler {
        return this.#inputHandler;
    }

    /**
     * Sets the scene of the game.
     * @param scene The new scene object.
     */
    setScene(scene: Scene) {
        this.#scene = scene;
    }

    /**
     * Gets the asset loader of the game.
     * @returns The asset loader object.
     */
    getAssetLoader(): AssetLoader {
        return this.#assetLoader;
    }

    getSequenceExecutor(): SequenceExecutor {
        return this.#sequenceExecutor;
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

    equals(pos: Pos): boolean {
        return this.x == pos.x && this.y == pos.y;
    }
}
