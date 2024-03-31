import { Camera, Pos, Screen } from "./screen.js";
import { InputHandler } from "./input.js";
import { Player } from "./player.js";
import { Scene } from "./scene.js";
import { AssetLoader } from "./sprite.js";

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
}