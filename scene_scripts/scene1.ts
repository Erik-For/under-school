import { NPCTalkingSprite, NPCTextAnimation } from "../animate.js";
import { Game, Pos } from "../game.js";
import { ObjectBehaviour, Scene, SceneScript, ScriptedObject, TileCoordinate } from "../scene.js";
import { CodeSequenceItem, Sequence, SequenceItem } from "../sequence.js";
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
        
        currentScene.registerBehaviour("test", (object) => {
            let charecter = new NPCTalkingSprite(
                new Sprite("assets/goli.png", 13, 14, 0),
                new Sprite("assets/goli.png", 14, 14, 0),
                new Sprite("assets/goli.png", 13, 15, 0),
                new Sprite("assets/goli.png", 14, 15, 0)
            );
    
            let sequence = new Sequence([
                new SequenceItem(
                    new CodeSequenceItem(() => {
                        game.getPlayer().freezeMovment();
                        game.getInputHandler().preventInteraction()
                    }),
                    (item, ctx) => {
                        (item as CodeSequenceItem).run();
                    }    
                ),
                new SequenceItem(
                    new NPCTextAnimation(charecter, "Hej jag heter Göran, men du kan kalla mig GOLI...", 3000, game.getInputHandler()),
                    (item, ctx) => {
                        (item as NPCTextAnimation).render(ctx, game);
                    }
                ),
                new SequenceItem(
                    new NPCTextAnimation(charecter, "Jag är lärare i DAODAC, DVS Arduinokunskap.", 3000, game.getInputHandler()),
                    (item, ctx) => {
                        (item as NPCTextAnimation).render(ctx, game);
                    }
                ),
                new SequenceItem(
                    new NPCTextAnimation(charecter, "Själv gillar jag att se på itläraren.se du vet, skåningen, och köra lastbil... Vet du vad....", 3000, game.getInputHandler()),
                    (item, ctx) => {
                        (item as NPCTextAnimation).render(ctx, game);
                    }
                ),
                new SequenceItem(
                    new NPCTextAnimation(charecter, "Kom till it support i bibblan 9:30 - 10:15 eller något så kan jag fixa din dator.... Eller din arduino uno eller router eller skrivare eller... Ja, jag kan visst fixa allting.", 5000, game.getInputHandler()),
                    (item, ctx) => {
                        (item as NPCTextAnimation).render(ctx, game);
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
            sequence.reset();
            game.getSequenceExecutor().setSequence(sequence);
        });
        currentScene.addManyScriptedObjects(
            new ScriptedObject(new Pos(-4, -2).multiply(16), ObjectBehaviour.ChangeScene, "assets/test3.json", new Sprite("assets/saker.png", 8, 0, 0)),
            new ScriptedObject(new Pos(-3, -2).multiply(16), ObjectBehaviour.ChangeScene, "assets/test3.json", new Sprite("assets/saker.png", 8, 0, 0)),
            new ScriptedObject(new Pos(-2, -1).multiply(16), ObjectBehaviour.Interactable, "test", new Sprite("assets/goli.png", 13, 14, 0)),
            new ScriptedObject(new Pos(-8, -1).multiply(16), ObjectBehaviour.ConveyorBelt, "l", new Sprite("assets/saker.png", 3, 0, 0)),
            ...ScriptedObject.constructFamily(20, (i) => new ScriptedObject(new Pos(-9, i-1).multiply(16), ObjectBehaviour.ConveyorBelt, "d", new Sprite("assets/saker.png", 2, 0, 0))),
        );
    };
    onExit (game: Game, currentScene: Scene) {

    };
    render(game: Game, currentScene: Scene) {
        
    };
}