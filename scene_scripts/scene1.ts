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

        currentScene.addManyScriptedObjects(
            new ScriptedObject(new Pos(-4, -2).multiply(16), ObjectBehaviour.ChangeScene, "assets/test3.json", new Sprite("assets/goli.png", 13, 14, 0)),
            new ScriptedObject(new Pos(-2, -1).multiply(16), ObjectBehaviour.Interactable, "assets/test3.json", new Sprite("assets/goli.png", 13, 14, 0)),
            new ScriptedObject(new Pos(-3, -2).multiply(16), ObjectBehaviour.ChangeScene, "assets/test3.json", new Sprite("assets/goli.png", 13, 14, 0)),
            new ScriptedObject(new Pos(-9, -1).multiply(16), ObjectBehaviour.ConveyorBelt, "d", new Sprite("assets/goli.png", 13, 14, 0)),
            new ScriptedObject(new Pos(-8, -1).multiply(16), ObjectBehaviour.ConveyorBelt, "l", new Sprite("assets/goli.png", 13, 14, 0)),
            new ScriptedObject(new Pos(-9, 1).multiply(16), ObjectBehaviour.ConveyorBelt, "d", new Sprite("assets/goli.png", 13, 14, 0)),
            new ScriptedObject(new Pos(-9, 0).multiply(16), ObjectBehaviour.ConveyorBelt, "d", new Sprite("assets/goli.png", 13, 14, 0)),
            new ScriptedObject(new Pos(-9, 3).multiply(16), ObjectBehaviour.ConveyorBelt, "d", new Sprite("assets/goli.png", 13, 14, 0)),
            new ScriptedObject(new Pos(-9, 2).multiply(16), ObjectBehaviour.ConveyorBelt, "d", new Sprite("assets/goli.png", 13, 14, 0)),
        );

    };
    onExit (game: Game, currentScene: Scene) {

    };
    render(game: Game, currentScene: Scene) {
        
    };
}