import { BigSprite, NPCTextAnimation } from "../animate.js";
import { Game, Particle, Pos } from "../game.js";
import { ObjectBehaviour, Scene, SceneScript, ScriptedObject, TileCoordinate } from "../scene.js";
import { CodeSequenceItem, Sequence, SequenceItem } from "../sequence.js";
import { Sprite } from "../sprite.js";

export default class Script implements SceneScript {
    name: string = "dungeon.js";
    onEnter(prevScene: Scene, game: Game, currentScene: Scene){
        currentScene.addManyScriptedObjects(
            new ScriptedObject(new Pos(39, -2).multiply(16), ObjectBehaviour.Sign, "I labyrinten ska du gå, följ stenarna för att målet nå", new Sprite("assets/saker.png", 6, 0, 0)),
            new ScriptedObject(new Pos(-4, -5).multiply(16), ObjectBehaviour.Sign, "I grottan du är, vilket misär", new Sprite("assets/saker.png", 7, 0, 0)),
            new ScriptedObject(new Pos(-2, -5).multiply(16), ObjectBehaviour.Sign, "Dörren är låst, inga nycklar finns att se, med lite list, en uppenbarelse kan ske", new Sprite("assets/saker.png", 7, 0, 0)),
            new ScriptedObject(new Pos(38, -2).multiply(16), ObjectBehaviour.Button
            , "btn", new Sprite("assets/dungeon.png", 0, 1, 0)),
            
        )
        currentScene.registerBehaviour("btn", (game: Game, currentScene: Scene, pos: Pos, data: String) => {
            alert("Du tryckte på knappen");
        })
    };

    onExit(game: Game, currentScene: Scene) {

    };


    render(game: Game, currentScene: Scene) {
        
    };

    getStartTile(): Map<String, TileCoordinate> {
        return new Map([
            ["default", new TileCoordinate(-3, 3)]
        ]);
    };
}