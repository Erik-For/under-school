import { BigSprite, NPCTextAnimation, TextAnimationNoInteract } from "../animate.js";
import { Battle } from "../battle.js";
import { Game, Particle, Snow, Pos, Mode } from "../game.js";
import { fadeOut, ObjectBehaviour, Scene, SceneScript, ScriptedObject, TileCoordinate } from "../scene.js";
import { CodeSequenceItem, Sequence, SequenceItem, WaitSequenceItem } from "../sequence.js";
import { Sprite } from "../sprite.js";

export default class Script implements SceneScript {
    name: string = "sodexo.js";
    async onEnter(prevScene: Scene, game: Game, currentScene: Scene){
        switch(prevScene.getScriptName()){
            case "snow3.js":
                game.getPlayer().setPos(new Pos(27, 84).multiply(16));
                game.getPlayer().setDirection("down");
                break;
            default:
                game.getPlayer().setPos(new Pos(0, 0).multiply(16));
                game.getPlayer().setDirection("down");
                break;
        }

        game.getAudioManager().playBackgroundMusic(game.getAssetLoader().getAudioAsset("assets/Unknown.wav")!);
        //game.getCamera().toggleRippleEffect();

        if(prevScene.getScriptName() == "snow3.js"){
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
                    new TextAnimationNoInteract("Det luktar ruttet i hela lokalen...", 1000, 2000),
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
            game.getSequenceExecutor().setSequence(sequence);
        }
        currentScene.addManyScriptedObjects(
            ...ScriptedObject.constructFamily(3, (i) => new ScriptedObject(new Pos(24-i,69).multiply(16), ObjectBehaviour.ConveyorBelt, "l", new Sprite("assets/saker.png", 3, 0, 0))),
            ...ScriptedObject.constructFamily(20, (i) => new ScriptedObject(new Pos(21, 69 - i).multiply(16), ObjectBehaviour.ConveyorBelt, "u", new Sprite("assets/saker.png", 0, 0, 0))),
            ...ScriptedObject.constructFamily(15, (i) => new ScriptedObject(new Pos(21 + i, 49).multiply(16), ObjectBehaviour.ConveyorBelt, "r", new Sprite("assets/saker.png", 1, 0, 0))),
            ...ScriptedObject.constructFamily(14, (i) => new ScriptedObject(new Pos(36, 49 - i).multiply(16), ObjectBehaviour.ConveyorBelt, "u", new Sprite("assets/saker.png", 0, 0, 0))),
            ...ScriptedObject.constructFamily(12, (i) => new ScriptedObject(new Pos(36-i,35).multiply(16), ObjectBehaviour.ConveyorBelt, "l", new Sprite("assets/saker.png", 3, 0, 0))),
            ...ScriptedObject.constructFamily(19, (i) => new ScriptedObject(new Pos(24, 35 - i).multiply(16), ObjectBehaviour.ConveyorBelt, "u", new Sprite("assets/saker.png", 0, 0, 0))),
            ...ScriptedObject.constructFamily(24, (i) => new ScriptedObject(new Pos(24-i,16).multiply(16), ObjectBehaviour.ConveyorBelt, "l", new Sprite("assets/saker.png", 3, 0, 0))),
            ...ScriptedObject.constructFamily(12, (i) => new ScriptedObject(new Pos(0, 16 - i).multiply(16), ObjectBehaviour.ConveyorBelt, "u", new Sprite("assets/saker.png", 0, 0, 0))),
            new ScriptedObject(new Pos(0, 4).multiply(16), ObjectBehaviour.Walkable, "battle", new Sprite("assets/dungeon.png", 0, 0, 0)),
            new ScriptedObject(new Pos(8, -8).multiply(16), ObjectBehaviour.ChangeScene, "assets/cred.json", new Sprite("assets/dungeon.png", 0, 0, 0)),
        );

        let jens = {
            top: new Sprite("assets/people.png", 6, 0, 10),
            bottom: new Sprite("assets/people.png", 6, 1, 10),
            bigsprite: new BigSprite(
                new Sprite("assets/faces.png", 26, 0, 0),
                new Sprite("assets/faces.png", 27, 0, 0),
                new Sprite("assets/faces.png", 26, 1, 0),
                new Sprite("assets/faces.png", 27, 1, 0)
            )
        }
        currentScene.registerBehaviour("battle", (game, currentScene, pos, data) => {
            if(game.getGameState().hasStartedBattle) return;
            game.getGameState().hasStartedBattle = true;
            let sequence = new Sequence([
                new SequenceItem(new CodeSequenceItem(() => {
                    game.getPlayer().freezeMovment();
                    game.getInputHandler().preventInteraction();
                }), (item, ctx) => {
                    (item as CodeSequenceItem).run();
                }),
                new SequenceItem(new WaitSequenceItem(100), (item, ctx) => {
                    (item as WaitSequenceItem).run();
                }),
                new SequenceItem(new NPCTextAnimation(jens.bigsprite, "Du har hittat mig i min elev-köttfabrik", 2000, game.getInputHandler()), (item, ctx) => {
                    (item as NPCTextAnimation).render(ctx, game);
                }),
                new SequenceItem(new NPCTextAnimation(jens.bigsprite, "Därför måste du malas ner hahahahha", 2000, game.getInputHandler()), (item, ctx) => {
                    (item as NPCTextAnimation).render(ctx, game);
                }),
                new SequenceItem(new WaitSequenceItem(1000), (item, ctx) => {
                    (item as WaitSequenceItem).run();
                }),
                new SequenceItem(new CodeSequenceItem(() => {
                    game.getAudioManager().playBackgroundMusic(game.getAssetLoader().getAudioAsset("assets/DaftPunkalovania.mp3")!)
                }), (item, ctx) => {
                    (item as CodeSequenceItem).run();
                }),
                new SequenceItem(game.getBattle()!, (item, ctx) => {
                    game.setMode(Mode.Battle);
                    (item as Battle).activate();
                }),
            ]);
            game.getSequenceExecutor().setSequence(sequence);
        });
    };

    onExit(game: Game, currentScene: Scene) {
    };


    render(game: Game, currentScene: Scene) {
        
    };

}