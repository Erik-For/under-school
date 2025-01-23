import { BigSprite, NPCTextAnimation, TextAnimationNoInteract } from "../animate.js";
import { Game, Particle, Snow, Pos } from "../game.js";
import { fadeOut, ObjectBehaviour, Scene, SceneScript, ScriptedObject, TileCoordinate } from "../scene.js";
import { CodeSequenceItem, Sequence, SequenceItem, WaitSequenceItem } from "../sequence.js";
import { Sprite } from "../sprite.js";

export default class Script implements SceneScript {
    name: string = "snow1.js";
    async onEnter(prevScene: Scene, game: Game, currentScene: Scene){
        switch(prevScene.getScriptName()){
            //default:
            case "dungeon.js":
                game.getPlayer().setPos(new Pos(-1, -4).multiply(16)); // byt ut kordinaterna
                game.getPlayer().setDirection("down");
                break;
            case "snow2.js":
                game.getPlayer().setPos(new Pos(-1.5, 5.5).multiply(16));
                game.getPlayer().setDirection("up");
                break;
        }

        if(prevScene.getScriptName() == "dungeon.js"){
            let sequence = new Sequence([
                new SequenceItem(
                    new WaitSequenceItem(50),
                    (item, ctx) => {
                        (item as WaitSequenceItem).run();
                    }
                ),
                new SequenceItem(
                    new CodeSequenceItem(() => {
                        game.getPlayer().freezeMovment();
                        game.getInputHandler().preventInteraction();
                    }),
                    (item, ctx) => {
                        (item as CodeSequenceItem).run();
                    }    
                ),
                new SequenceItem(
                    new TextAnimationNoInteract("Dörren låser sig bakom dig", 1000, 1000),
                    (item, ctx) => {
                        (item as TextAnimationNoInteract).render(ctx, game);
                    }
                ),
                new SequenceItem(
                    new CodeSequenceItem(() => {
                        game.getPlayer().unfreezeMovment();
                        game.getInputHandler().allowInteraction();
                    }),
                    (item, ctx) => {
                        (item as CodeSequenceItem).run();
                    }
                )
            ]);
            
            await fadeOut(game, 4000);
            game.getSequenceExecutor().setSequence(sequence);
        }
        currentScene.addManyScriptedObjects(
            new ScriptedObject(new Pos(-2, -6).multiply(16), ObjectBehaviour.Sign, "Dörren är låst...", new Sprite("assets/saker.png", 8, 0, 0)),
            new ScriptedObject(new Pos(-1, -6).multiply(16), ObjectBehaviour.Sign, "Dörren är låst...", new Sprite("assets/saker.png", 8, 0, 0)),
            new ScriptedObject(new Pos(-2, 7).multiply(16), ObjectBehaviour.ChangeScene, "assets/snow2.json", new Sprite("assets/dungeon.png", 0, 0, 0)),
        );

        game.getAudioManager().playBackgroundMusic(game.getAssetLoader().getAudioAsset("assets/Whispersofsnow.wav")!);
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

}