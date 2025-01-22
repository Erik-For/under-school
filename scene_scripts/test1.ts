import { BigSprite, NPCTextAnimation } from "../animate.js";
import { Game, Particle, Pos } from "../game.js";
import { ObjectBehaviour, Scene, SceneScript, ScriptedObject, TileCoordinate } from "../scene.js";
import { CodeSequenceItem, Sequence, SequenceItem } from "../sequence.js";
import { Sprite } from "../sprite.js";

export default class Script implements SceneScript {
    name: string = "test1.js";
    onEnter(prevScene: Scene, game: Game, currentScene: Scene){
    
    };
    onExit (game: Game, currentScene: Scene) {

    };
    render(game: Game, currentScene: Scene) {
        
    };

    getStartTile(): Map<String, [TileCoordinate, (game: Game) => boolean]> {
        return new Map([
            ["default", [new TileCoordinate(-7, 2), (game: Game) => true]]
        ]);
    };
}