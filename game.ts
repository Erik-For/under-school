import { Camera, Pos, Screen } from "./screen.js";
import { InputHandler } from "./input.js";
import { Player } from "./player.js";
import { Scene } from "./scene.js";
import { AssetLoader } from "./sprite.js";

export class Game {
    #scene: Scene;
    #player: Player;
    #camera: Camera;
    #screen: Screen;
    #inputHandler: InputHandler;
    #assetLoader: AssetLoader;

    constructor(scene: Scene, startPos: Pos, screen: Screen, assetLoader: AssetLoader) {
        this.#screen = screen;
        this.#assetLoader = assetLoader;
        this.#scene = scene;
        this.#camera = new Camera(startPos.x, startPos.y);
        this.#inputHandler = new InputHandler();
        this.#player = new Player(startPos.x, startPos.y, this);
    }

    getPlayer():Player {
        return this.#player;
    }

    getScene():Scene {
        return this.#scene;
    }

    getCamera():Camera {
        return this.#camera;
    }

    getScreen():Screen {
        return this.#screen;
    }

    getInputHandler():InputHandler {
        return this.#inputHandler;
    }

    setScene(scene: Scene) {
        this.#scene = scene;
    }

    getAssetLoader():AssetLoader {
        return this.#assetLoader;
    }
}