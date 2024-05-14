import { Game, Pos } from "../game.js";
import { ObjectBehaviour, Scene, SceneScript, ScriptedObject, TileCoordinate } from "../scene.js";
import { Sprite } from "../sprite.js";

export default class Script implements SceneScript {
    name: string = "scene3.js";
    onEnter(prevScene: Scene, game: Game, currentScene: Scene){
        currentScene.addManyScriptedObjects(
            new ScriptedObject(new Pos(4, 5).multiply(16), ObjectBehaviour.ChangeScene, "assets/test2.json", new Sprite("assets/saker.png", 8, 0, 0)),
            new ScriptedObject(new Pos(5, 5).multiply(16), ObjectBehaviour.ChangeScene, "assets/test2.json", new Sprite("assets/saker.png", 8, 0, 0)),
        );
    };
    onExit (game: Game, currentScene: Scene) {
        
    };
    render(game: Game, currentScene: Scene) {
    };
    
    getStartTile(): Map<String, TileCoordinate> {
        return new Map([
            ["scene1.js", new TileCoordinate(5, 4.9)],
            ["default", new TileCoordinate(5, 4.9)]
        ]);
    };
}