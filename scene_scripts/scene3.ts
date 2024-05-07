import { Game, Pos } from "../game.js";
import { ObjectBehaviour, Scene, SceneScript, ScriptedObject, TileCoordinate } from "../scene.js";
import { Sprite } from "../sprite.js";

export default class Script implements SceneScript {
    name: string = "scene3.js";
    onEnter(prevScene: Scene, game: Game, currentScene: Scene){

    };
    onExit (game: Game, currentScene: Scene) {

    };
    render(game: Game, currentScene: Scene) {
    };
}