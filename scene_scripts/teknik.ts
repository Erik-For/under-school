import { Game, Pos } from "../game.js";
import { ObjectBehaviour, Scene, SceneScript, ScriptedObject, TileCoordinate } from "../scene.js";
import { Sprite } from "../sprite.js";

export default class Script implements SceneScript {
    name: string = "teknik.js";
    onEnter(prevScene: Scene, game: Game, currentScene: Scene){
        game.getAudioManager().playBackgroundMusic(game.getAssetLoader().getAudioAsset("assets/test.mp3")!);
        currentScene.addManyScriptedObjects(
            new ScriptedObject(new Pos(4, 5).multiply(16), ObjectBehaviour.ChangeScene, "assets/intro.json", new Sprite("assets/saker.png", 8, 0, 0)),
            new ScriptedObject(new Pos(5, 5).multiply(16), ObjectBehaviour.ChangeScene, "assets/intro.json", new Sprite("assets/saker.png", 8, 0, 0)),
        );
    };
    onExit (game: Game, currentScene: Scene) {
        
    };
    render(game: Game, currentScene: Scene) {
    };
    
    getStartTile(): Map<String, TileCoordinate> {
        return new Map([
            ["intro.js", new TileCoordinate(5, 4.9)],
            ["default", new TileCoordinate(5, 4.9)]
        ]);
    };
}