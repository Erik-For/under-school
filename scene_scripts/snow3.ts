import { BigSprite, NPCTextAnimation } from "../animate.js";
import { Game, Particle, Snow, Pos } from "../game.js";
import { Player } from "../player.js";
import { ObjectBehaviour, Scene, SceneScript, ScriptedObject, TileCoordinate } from "../scene.js";
import { CodeSequenceItem, Sequence, SequenceItem } from "../sequence.js";
import { Sprite } from "../sprite.js";

export default class Script implements SceneScript {
    name: string = "snow3.js";

    onEnter(prevScene: Scene, game: Game, currentScene: Scene){

        switch(prevScene.getScriptName()){
            default:
            case "snow2.js":
                game.getPlayer().setPos(new Pos(34, -30).multiply(16));
                game.getPlayer().setDirection("down");
                break;
        }

        currentScene.addManyScriptedObjects(
            //man ska kunna prata med kim på berget nere, samma pos som i snow2 fast nu npc med dialog
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