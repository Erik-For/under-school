import { Game, Pos } from "../game.js";
import { ObjectBehaviour, Scene, SceneScript, ScriptedObject, TileCoordinate } from "../scene.js";
import { Sprite } from "../sprite.js";

export default class Script implements SceneScript {
    name: string = "scene3.js";
    onEnter(prevScene: Scene, game: Game, currentScene: Scene){
        let scripedObject = new ScriptedObject(new Pos(-5, -3).multiply(16), ObjectBehaviour.ChangeScene, "assets/test2.json", new Sprite("assets/goli.png", 13, 14, 0));
        currentScene.addScriptedObject(scripedObject);
    };
    onExit (game: Game, currentScene: Scene) {

    };
    render(game: Game, currentScene: Scene) {
    };
}