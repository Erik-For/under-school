import { BigSprite, NPCTextAnimation } from "../animate.js";
import { Game, Pos } from "../game.js";
import { fadeOut, ObjectBehaviour, Scene, SceneScript, ScriptedObject, TileCoordinate } from "../scene.js";
import { CodeSequenceItem, Sequence, SequenceItem, WaitSequenceItem } from "../sequence.js";
import { Sprite } from "../sprite.js";

export default class Script implements SceneScript {
    name: string = "teknik.js";
    async onEnter(prevScene: Scene, game: Game, currentScene: Scene){
        switch(prevScene.getScriptName()){
            case "intro.js":
                if(game.getGameState().hasPlayedJohannesLektionCutScene) break;
                game.getPlayer().setPos(new Pos(-1, -6).multiply(16)); // byt ut kordinaterna
                break;
            
        }

        currentScene.addManyScriptedObjects(
            new ScriptedObject(new Pos(4, 5).multiply(16), ObjectBehaviour.ChangeScene, "assets/intro.json", new Sprite("assets/saker.png", 8, 0, 0)),
            new ScriptedObject(new Pos(5, 5).multiply(16), ObjectBehaviour.ChangeScene, "assets/intro.json", new Sprite("assets/saker.png", 8, 0, 0)),
        );

        const johannes = {
            bigsprite: new BigSprite (
                new Sprite("assets/faces.png", 16, 0, 0),
                new Sprite("assets/faces.png", 17, 0, 0),
                new Sprite("assets/faces.png", 16, 1, 0),
                new Sprite("assets/faces.png", 17, 1, 0),
            )
        }
        const jens = {
            bigsprite: new BigSprite (
                new Sprite("assets/faces.png", 24, 0, 0),
                new Sprite("assets/faces.png", 25, 0, 0),
                new Sprite("assets/faces.png", 24, 1, 0),
                new Sprite("assets/faces.png", 25, 1, 0),
            )
        }

        const tom = {
            bigsprite: new BigSprite (
                new Sprite("assets/faces.png", 20, 0, 0),
                new Sprite("assets/faces.png", 21, 0, 0),
                new Sprite("assets/faces.png", 20, 1, 0),
                new Sprite("assets/faces.png", 21, 1, 0),
            )
        }



        if(true){ // möjlighet för att ändra lite vad man göra beroende på vart man är i spelet
            currentScene.addManyScriptedObjects(
                new ScriptedObject(new Pos(7, -10).multiply(16), ObjectBehaviour.Interactable, "johannes", new Sprite("assets/saker.png", 8, 0, 0)),
                new ScriptedObject(new Pos(7, -11).multiply(16), ObjectBehaviour.Interactable, "johannes", new Sprite("assets/saker.png", 8, 0, 0)),
                new ScriptedObject(new Pos(4, -13).multiply(16), ObjectBehaviour.Interactable, "jens", new Sprite("assets/saker.png", 8, 0, 0)),
                new ScriptedObject(new Pos(4, -10).multiply(16), ObjectBehaviour.Interactable, "tom", new Sprite("assets/saker.png", 8, 0, 0)),
            );

            currentScene.registerBehaviour("johannes", (game: Game, currentScene: Scene, pos: Pos, data: string) => {
                let sequence = new Sequence([
                    new SequenceItem(new CodeSequenceItem(() => {
                        game.getPlayer().freezeMovment();
                        game.getInputHandler().preventInteraction();
                    }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                    new SequenceItem(new NPCTextAnimation(johannes.bigsprite, "Hej, du är nya elever, vad heter du?", 1500, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                    new SequenceItem(new CodeSequenceItem(() => {
                        game.getPlayer().unfreezeMovment();
                        game.getInputHandler().allowInteraction();
                    }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                ]);

                game.getSequenceExecutor().setSequence(sequence);
            });

            currentScene.registerBehaviour("jens", (game: Game, currentScene: Scene, pos: Pos, data: string) => {
                let sequence = new Sequence([
                    new SequenceItem(new CodeSequenceItem(() => {
                        game.getPlayer().freezeMovment();
                        game.getInputHandler().preventInteraction();
                    }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                    new SequenceItem(new NPCTextAnimation(jens.bigsprite, "Jag missbrukar kebab på en daglig basis. de kallar mig för kebabmissbrukaren", 3000, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                    new SequenceItem(new NPCTextAnimation(jens.bigsprite, "Vad kallas du?", 1000, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                    new SequenceItem(new CodeSequenceItem(() => {
                        game.getPlayer().unfreezeMovment();
                        game.getInputHandler().allowInteraction();
                    }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                ]);

                game.getSequenceExecutor().setSequence(sequence);	
            });

            currentScene.registerBehaviour("tom", (game: Game, currentScene: Scene, pos: Pos, data: string) => {
                let sequence = new Sequence([
                    new SequenceItem(new CodeSequenceItem(() => {
                        game.getPlayer().freezeMovment();
                        game.getInputHandler().preventInteraction();
                    }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                    new SequenceItem(new NPCTextAnimation(tom.bigsprite, "Jag är Tom, alltså jag är inte tom, jag heter TOM, men du kan kalla mig TOMBAA", 3500, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                    new SequenceItem(new CodeSequenceItem(() => {
                        game.getPlayer().unfreezeMovment();
                        game.getInputHandler().allowInteraction();
                    }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                ]);

                game.getSequenceExecutor().setSequence(sequence);	
            });
        }
        console.log(game.getGameState().hasPlayedJohannesLektionCutScene);
        
        if(!game.getGameState().hasPlayedJohannesLektionCutScene){ 
            game.getGameState().hasPlayedJohannesLektionCutScene = true;
            game.getPlayer().freezeMovment();
            game.getPlayer().setDirection("right");
            game.getInputHandler().preventInteraction();
            game.getPlayer().setPos(new Pos(4.5, -6.5).multiply(16));
            game.getCamera().setCameraOffset(new Pos(3*16, -4*16));
            
            await fadeOut(game, 4000);
            let sequence = new Sequence([
                new SequenceItem(new WaitSequenceItem(10), (item, ctx) => { (item as WaitSequenceItem).run(); }),
                new SequenceItem(new CodeSequenceItem(() => {
                    game.getPlayer().freezeMovment();
                    game.getPlayer().setDirection("right");
                    game.getInputHandler().preventInteraction();
                    game.getPlayer().setPos(new Pos(4.5, -6.5).multiply(16));
                    game.getPlayer().setDirection("right");
                }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                new SequenceItem(new WaitSequenceItem(1000), (item, ctx) => { (item as WaitSequenceItem).run(); }),
                new SequenceItem(new NPCTextAnimation(johannes.bigsprite, "Hej allihopa, för er som är nya så heter jag Johannes.", 3000, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                new SequenceItem(new NPCTextAnimation(johannes.bigsprite, "Idag ska vi prata lite om kedjeregeln.", 2500, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                new SequenceItem(new NPCTextAnimation(johannes.bigsprite, "När jag var liten så fanns det ett populärt tv program som hette Pimp my ride på Mtv.", 4000, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                new SequenceItem(new NPCTextAnimation(johannes.bigsprite, "och i programet så finns det vissa catchphrases.", 2500, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                new SequenceItem(new NPCTextAnimation(johannes.bigsprite, "En av dessa är 'Yo dawg, I heard you like X, so we put a X in your car...' så här är min version:", 4000, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                new SequenceItem(new NPCTextAnimation(johannes.bigsprite, "Yo dawg, i heard you like functions", 2000, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                new SequenceItem(new NPCTextAnimation(johannes.bigsprite, "so i put a function in your function!", 2000, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                new SequenceItem(new NPCTextAnimation(johannes.bigsprite, "Fattar ni........... Kedjeregeln gäller för funktioner i funktioner", 4000, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                new SequenceItem(new NPCTextAnimation(johannes.bigsprite, "...... Jag tycker den är rolig i varje fall.", 3500, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                new SequenceItem(new NPCTextAnimation(johannes.bigsprite, "Men jag tänker att ni ska räkna lite på egen hand på sidorna 78-79.", 4000, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                new SequenceItem(new CodeSequenceItem(() => {
                    game.getCamera().setCameraOffsetSmooth(new Pos(0, 0), 1000);
                }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                new SequenceItem(new WaitSequenceItem(1000), (item, ctx) => { (item as WaitSequenceItem).run(); }),
                new SequenceItem(new CodeSequenceItem(() => {
                    game.getPlayer().unfreezeMovment();
                    game.getInputHandler().allowInteraction();
                }), (item, ctx) => { (item as CodeSequenceItem).run(); }),

            ])

            game.getSequenceExecutor().setSequence(sequence);
        }
    };
    onExit (game: Game, currentScene: Scene) {
    };
    render(game: Game, currentScene: Scene) {

    };
}