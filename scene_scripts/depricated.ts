import { BigSprite, NPCTextAnimation } from "../animate.js";
import { Game, Particle, Pos } from "../game.js";
import { ObjectBehaviour, Scene, SceneScript, ScriptedObject, TileCoordinate } from "../scene.js";
import { CodeSequenceItem, Sequence, SequenceItem } from "../sequence.js";
import { Sprite } from "../sprite.js";

export default class Script implements SceneScript {
    name: string = "scene1.js";
    onEnter(prevScene: Scene, game: Game, currentScene: Scene){
    
        //Ännu ett test case TAG BORT SENARE TACKAR!
        // for(let i = 0; i < 1_000; i++){
        //     let velocity = new Pos(2 * (Math.random()-0.5), 2 * (Math.random()-0.5)).normalize().multiply(Math.random()); // Randomize velocity
        //     let lifetime = 120 * Math.random(); // Randomize lifetime
        //     let particle = new Particle(new Pos(-5, 2).multiply(16), velocity, lifetime, game.getAssetLoader().getSpriteSheet("assets/goli.png")!.getSprite(13, 14), true);
        //     game.getParticleManager().addParticle(particle);
        // }

        currentScene.registerBehaviour("test", (object) => {
            let charecter = new BigSprite(
                new Sprite("assets/faces.png", 8, 0, 0),
                new Sprite("assets/faces.png", 9, 0, 0),
                new Sprite("assets/faces.png", 8, 1, 0),
                new Sprite("assets/faces.png", 9, 1, 0)
            );
    
            let sequence = new Sequence([
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
            new ScriptedObject(new Pos(-4, -2).multiply(16), ObjectBehaviour.ChangeScene, "assets/teknik.json", new Sprite("assets/saker.png", 8, 0, 0)),
            new ScriptedObject(new Pos(-3, -2).multiply(16), ObjectBehaviour.ChangeScene, "assets/teknik.json", new Sprite("assets/saker.png", 8, 0, 0)),
            new ScriptedObject(new Pos(-2, -1).multiply(16), ObjectBehaviour.Interactable, "test", new Sprite("assets/goli.png", 15, 15, 0)),
            new ScriptedObject(new Pos(-2, -2).multiply(16), ObjectBehaviour.None, "", new Sprite("assets/goli.png", 15, 14, 0)),
            ...ScriptedObject.constructFamily(3, (i) => new ScriptedObject(new Pos(-5-i,-1).multiply(16), ObjectBehaviour.ConveyorBelt, "l", new Sprite("assets/saker.png", 3, 0, 0))),
            ...ScriptedObject.constructFamily(3, (i) => new ScriptedObject(new Pos(-8, i-1).multiply(16), ObjectBehaviour.ConveyorBelt, "d", new Sprite("assets/saker.png", 2, 0, 0))),
            ...ScriptedObject.constructFamily(3, (i) => new ScriptedObject(new Pos(-5, i).multiply(16), ObjectBehaviour.ConveyorBelt, "u", new Sprite("assets/saker.png", 0, 0, 0))),
        );

        currentScene.addScriptedObject(new ScriptedObject(new Pos(-1, -2).multiply(16), ObjectBehaviour.Sign, "test", new Sprite("assets/goli.png", 11, 0, 0)));
    };
    onExit (game: Game, currentScene: Scene) {

    };
    render(game: Game, currentScene: Scene) {
        
    };
    onInteraction(game: Game, currentScene: Scene, pos: Pos, data: string) {
        
    }
}

/*
 this.#battle = new Battle(this, new Enemy(100, new BigSprite(
            new Sprite("assets/faces.png", 8, 0, 0),
            new Sprite("assets/faces.png", 9, 0, 0),
            new Sprite("assets/faces.png", 8, 1, 0),
            new Sprite("assets/faces.png", 9, 1, 0)
        ), new BigSprite(
            new Sprite("assets/faces.png", 10, 0, 0),
            new Sprite("assets/faces.png", 11, 0, 0),
            new Sprite("assets/faces.png", 10, 1, 0),
            new Sprite("assets/faces.png", 11, 1, 0)
        )), [new Round(new Sequence([]), [new LoopingHomingProjectile(new Pos(50, 50), 10*60, new Sprite("assets/rootSpike.png", 0, 0, 0), 1)]), new Round(new Sequence([
            new SequenceItem(
                new TextAnimationNoInteract("Ajdå du överlevde", 1000*1, 1000*2),
                (item, ctx) => {
                    (item as TextAnimation).render(ctx, this);
                }
            )
        ]),[new LoopingHomingProjectile(new Pos(50, 50), 10*60, new Sprite("assets/rootSpike.png", 0, 0, 0), 1)])]);
*/