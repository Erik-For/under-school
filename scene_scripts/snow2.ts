import { BigSprite, NPCTextAnimation } from "../animate.js";
import { Game, Particle, Snow, Pos } from "../game.js";
import { Player } from "../player.js";
import { ObjectBehaviour, Scene, SceneScript, ScriptedObject, TileCoordinate } from "../scene.js";
import { CodeSequenceItem, Sequence, SequenceItem } from "../sequence.js";
import { Sprite } from "../sprite.js";

export default class Script implements SceneScript {
    name: string = "snow2.js";
    #buttons: ScriptedObject[] = [

    ]
    onEnter(prevScene: Scene, game: Game, currentScene: Scene){
        currentScene.addManyScriptedObjects(
            new ScriptedObject(new Pos(6, -10).multiply(16), ObjectBehaviour.Sign, "^ Norra Bergstoppen ^", new Sprite("assets/saker.png", 6, 0, 0)),
            new ScriptedObject(new Pos(30, -6).multiply(16), ObjectBehaviour.Sign, "Varning för halka", new Sprite("assets/saker.png", 7, 0, 0)),
            new ScriptedObject(new Pos(88, -5).multiply(16), ObjectBehaviour.Sign, "Börja här: Ö Ö N V N V S Ö S", new Sprite("assets/saker.png", 6, 0, 0)),
            new ScriptedObject(new Pos(92, 25).multiply(16), ObjectBehaviour.Sign, "Vid berget där man halka, en öppning börja nalka(s)", new Sprite("assets/saker.png", 6, 0, 0)),
        );
    };

    onExit(game: Game, currentScene: Scene) {

    };


    render(game: Game, currentScene: Scene) {
        if (Date.now() % 2 == 0) {
            const screenWidth = window.innerWidth;
            const randomX = Math.floor((Math.random() - 0.5) * screenWidth);
            const position = new Pos(randomX, game.getPlayer().getPos().y-225);
        
            game.getParticleManager().addParticle(new Snow(position, 2000, game.getAssetLoader().getSpriteSheet("assets/snowset.png")!.getSprite(2, 3)));
        }
    };
}