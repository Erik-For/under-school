import { BigSprite, NPCTextAnimation } from "../animate.js";
import { Game, Particle, Snow, Pos } from "../game.js";
import { ObjectBehaviour, Scene, SceneScript, ScriptedObject, TileCoordinate } from "../scene.js";
import { CodeSequenceItem, Sequence, SequenceItem } from "../sequence.js";
import { Sprite } from "../sprite.js";

export default class Script implements SceneScript {
    name: string = "snow1.js";
    onEnter(prevScene: Scene, game: Game, currentScene: Scene){
        currentScene.addManyScriptedObjects(
            new ScriptedObject(new Pos(-2, -6).multiply(16), ObjectBehaviour.Sign, "Dörren är låst...", new Sprite("assets/saker.png", 8, 0, 0)),
            new ScriptedObject(new Pos(-1, -6).multiply(16), ObjectBehaviour.Sign, "Dörren är låst...", new Sprite("assets/saker.png", 8, 0, 0)),
        );
    };

    onExit(game: Game, currentScene: Scene) {

    };


    render(game: Game, currentScene: Scene) {
        if (Date.now() % 2 == 0) {
            const screenWidth = window.innerWidth;
            const randomX = Math.floor((Math.random() - 0.5) * screenWidth);
            const position = new Pos(randomX, -225);
        
            game.getParticleManager().addParticle(new Snow(position, 2000, game.getAssetLoader().getSpriteSheet("assets/snowset.png")!.getSprite(2, 3)));
        }
    };

    getStartTile(): Map<String, [TileCoordinate, (game: Game) => boolean]> {
        return new Map([
            ["snow1.js", [new TileCoordinate(3, 5), (game: Game) => true]]
        ]);
    };
}