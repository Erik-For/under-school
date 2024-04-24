import { Game, Pos } from "../game.js";
import { ObjectBehaviour, Scene, SceneScript, ScriptedObject, TileCoordinate } from "../scene.js";
import { Sprite } from "../sprite.js";

export default class Script implements SceneScript {
    name: string = "scene1.js";
    onEnter(prevScene: Scene, game: Game, currentScene: Scene){
        let tileSize = game.getScreen().tileSize;
        if(prevScene?.getScriptName() === "scene3.js") {
            game.getPlayer().setPos(new TileCoordinate(-4, -1).toPos(tileSize).add(new Pos(tileSize/2, tileSize/2)));
        } else {
            game.getPlayer().setPos(new TileCoordinate(-4, 2).toPos(tileSize).add(new Pos(tileSize/2, tileSize/2)));
        }
        let scriptedObject1 = new ScriptedObject(new Pos(-4, -2).multiply(16), ObjectBehaviour.ChangeScene, "assets/test3.json", new Sprite("assets/goli.png", 13, 14, 0));
        let scriptedObject2 = new ScriptedObject(new Pos(-3, -2).multiply(16), ObjectBehaviour.ChangeScene, "assets/test3.json", new Sprite("assets/goli.png", 13, 14, 0));
        let scriptedObject3 = new ScriptedObject(new Pos(-2, -1).multiply(16), ObjectBehaviour.Interactable, "assets/test3.json", new Sprite("assets/goli.png", 13, 14, 0));
        currentScene.addScriptedObject(scriptedObject1);
        currentScene.addScriptedObject(scriptedObject2);
        currentScene.addScriptedObject(scriptedObject3);
    };
    onExit (game: Game, currentScene: Scene) {

    };
    render(game: Game, currentScene: Scene) {
        
    };
}