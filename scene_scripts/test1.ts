import { BigSprite, NPCTextAnimation } from "../animate.js";
import { Game, Particle, Pos } from "../game.js";
import { ObjectBehaviour, Scene, SceneScript, ScriptedObject, TileCoordinate } from "../scene.js";
import { CodeSequenceItem, Sequence, SequenceItem } from "../sequence.js";
import { Sprite } from "../sprite.js";

export default class Script implements SceneScript {
    name: string = "test1.js";
    onEnter(prevScene: Scene, game: Game, currentScene: Scene){
        game.getPlayer().setPos(new Pos(-7, 2).multiply(16));
    };
    onExit (game: Game, currentScene: Scene) {

    };
    render(game: Game, currentScene: Scene) {
        
    };
}