const martin = {
    bigsprite: new BigSprite (
        new Sprite("assets/faces.png", 4, 0, 0),
        new Sprite("assets/faces.png", 5, 0, 0),
        new Sprite("assets/faces.png", 4, 1, 0),
        new Sprite("assets/faces.png", 5, 1, 0),
    )
}

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

const alexander = {
    bigsprite: new BigSprite (
        new Sprite("assets/faces.png", 28, 0, 0),
        new Sprite("assets/faces.png", 29, 0, 0),
        new Sprite("assets/faces.png", 28, 1, 0),
        new Sprite("assets/faces.png", 29, 1, 0),
    )
}

const jesper = {
    bigsprite: new BigSprite (
        new Sprite("assets/faces.png", 32, 0, 0),
        new Sprite("assets/faces.png", 33, 0, 0),
        new Sprite("assets/faces.png", 32, 1, 0),
        new Sprite("assets/faces.png", 33, 1, 0),
    )
}

const daniel = {
    bigsprite: new BigSprite (
        new Sprite("assets/faces.png", 36, 0, 0),
        new Sprite("assets/faces.png", 37, 0, 0),
        new Sprite("assets/faces.png", 36, 1, 0),
        new Sprite("assets/faces.png", 37, 1, 0),
    )
}

const goli = {
    bigsprite: new BigSprite (
        new Sprite("assets/faces.png", 10, 0, 0),
        new Sprite("assets/faces.png", 11, 0, 0),
        new Sprite("assets/faces.png", 10, 1, 0),
        new Sprite("assets/faces.png", 11, 1, 0),
    )
}

import { BigSprite, NPCTextAnimation, TextAnimation, TextAnimationNoInteract } from "../animate.js";
import { Game, Pos } from "../game.js";
import { CollisionRule, fadeIn, fadeOut, ObjectBehaviour, Scene, SceneScript, ScriptedObject, Tile, TileCoordinate } from "../scene.js";
import { CodeSequenceItem, Sequence, SequenceItem, WaitSequenceItem } from "../sequence.js";
import { Sprite } from "../sprite.js";

export default class Script implements SceneScript {
    name: string = "teknik.js";
    async onEnter(prevScene: Scene, game: Game, currentScene: Scene){
        
        switch(prevScene.getScriptName()){
            default: 
                game.getPlayer().setPos(new Pos(-18.5, -21.5).multiply(16)); //tag bort default när test är klar
                game.getPlayer().setDirection("up");
                break;
            case "intro.js":
                if(!game.getGameState().hasPlayedJohannesLektionCutScene) break;
                game.getPlayer().setPos(new Pos(5, 4).multiply(16));
                game.getPlayer().setDirection("up");
                break;
            case "minigame.js":
                game.getPlayer().setPos(new Pos(-18.5, -21.5).multiply(16));
                game.getPlayer().setDirection("up");
                break;
            
        }
        currentScene.addManyScriptedObjects(
            new ScriptedObject(new Pos(4, 5).multiply(16), ObjectBehaviour.ChangeScene, "assets/intro.json", new Sprite("assets/saker.png", 8, 0, 0)),
            new ScriptedObject(new Pos(5, 5).multiply(16), ObjectBehaviour.ChangeScene, "assets/intro.json", new Sprite("assets/saker.png", 8, 0, 0)),
            new ScriptedObject(new Pos(3, 5).multiply(16), ObjectBehaviour.ChangeScene, "assets/intro.json", new Sprite("assets/saker.png", 8, 0, 0)),
            new ScriptedObject(new Pos(6, 5).multiply(16), ObjectBehaviour.ChangeScene, "assets/intro.json", new Sprite("assets/saker.png", 8, 0, 0)),
            new ScriptedObject(new Pos(-9, -24).multiply(16), ObjectBehaviour.Interactable, "locked", new Sprite("assets/saker.png", 8, 0, 0)),
            new ScriptedObject(new Pos(-12, -24).multiply(16), ObjectBehaviour.Interactable, "locked", new Sprite("assets/saker.png", 8, 0, 0)),
            new ScriptedObject(new Pos(-6, -24).multiply(16), ObjectBehaviour.Interactable, "teacher", new Sprite("assets/saker.png", 8, 0, 0)),
            new ScriptedObject(new Pos(-19, -24).multiply(16), ObjectBehaviour.Interactable, "arcade", new Sprite("assets/teknik.png", 9, 4, 0)),
            new ScriptedObject(new Pos(-19, -23).multiply(16), ObjectBehaviour.Interactable, "arcade", new Sprite("assets/teknik.png", 9, 5, 0)),
        );

        if(!game.getGameState().hasRecievedKey){currentScene.addManyScriptedObjects(
            new ScriptedObject(new Pos(-20, -24).multiply(16), ObjectBehaviour.Interactable, "goli2", new Sprite("assets/people.png", 0, 0, 0)),
            new ScriptedObject(new Pos(-20, -23).multiply(16), ObjectBehaviour.Interactable, "goli2", new Sprite("assets/people.png", 0, 1, 0)),
        );
        }

        currentScene.addManyScriptedObjects(
            new ScriptedObject(new Pos(7, -10).multiply(16), ObjectBehaviour.Interactable, "johannes", new Sprite("assets/saker.png", 8, 0, 0)),
            new ScriptedObject(new Pos(7, -11).multiply(16), ObjectBehaviour.Interactable, "johannes", new Sprite("assets/saker.png", 8, 0, 0)),
            new ScriptedObject(new Pos(4, -13).multiply(16), ObjectBehaviour.Interactable, "jens", new Sprite("assets/saker.png", 8, 0, 0)),
            new ScriptedObject(new Pos(4, -10).multiply(16), ObjectBehaviour.Interactable, "tom", new Sprite("assets/saker.png", 8, 0, 0)),
            new ScriptedObject(new Pos(2, -13).multiply(16), ObjectBehaviour.Interactable, "other", new Sprite("assets/saker.png", 8, 0, 0)),
            new ScriptedObject(new Pos(2, -14).multiply(16), ObjectBehaviour.Interactable, "other", new Sprite("assets/saker.png", 8, 0, 0)),
            new ScriptedObject(new Pos(-1, -13).multiply(16), ObjectBehaviour.Interactable, "other", new Sprite("assets/saker.png", 8, 0, 0)),
            new ScriptedObject(new Pos(-1, -14).multiply(16), ObjectBehaviour.Interactable, "other", new Sprite("assets/saker.png", 8, 0, 0)),
            new ScriptedObject(new Pos(-1, -10).multiply(16), ObjectBehaviour.Interactable, "other", new Sprite("assets/saker.png", 8, 0, 0)),
            new ScriptedObject(new Pos(-1, -11).multiply(16), ObjectBehaviour.Interactable, "other", new Sprite("assets/saker.png", 8, 0, 0)),
            new ScriptedObject(new Pos(2, -10).multiply(16), ObjectBehaviour.Interactable, "alexander", new Sprite("assets/saker.png", 8, 0, 0)),
            new ScriptedObject(new Pos(2, -11).multiply(16), ObjectBehaviour.Interactable, "alexander", new Sprite("assets/saker.png", 8, 0, 0)),
            new ScriptedObject(new Pos(-32, -9).multiply(16), ObjectBehaviour.Interactable, "jesper", new Sprite("assets/saker.png", 8, 0, 0)),
            new ScriptedObject(new Pos(-32, -22).multiply(16), ObjectBehaviour.Interactable, "daniel", new Sprite("assets/saker.png", 8, 0, 0)),
        );


        currentScene.registerBehaviour("locked", (game: Game, currentScene: Scene, pos: Pos, data: string) => {
            let sequence = new Sequence([
                new SequenceItem(new CodeSequenceItem(() => {
                    game.getPlayer().freezeMovment();
                    game.getInputHandler().preventInteraction();
                }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                new SequenceItem(new TextAnimation("*Dörren är låst*", 1500, game.getInputHandler()), (item, ctx) => { (item as TextAnimation).render(ctx, game); }),
                new SequenceItem(new CodeSequenceItem(() => {
                    game.getPlayer().unfreezeMovment();
                    game.getInputHandler().allowInteraction();
                }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
            ]);
            game.getSequenceExecutor().setSequence(sequence);
        });

        currentScene.registerBehaviour("teacher", (game: Game, currentScene: Scene, pos: Pos, data: string) => {
            if(!game.getGameState().hasTalkedToTeacherRoomMartin && game.getGameState().hasPlayedJohannesLektionCutScene){
                game.getGameState().hasTalkedToTeacherRoomMartin = true;
                let sequence = new Sequence([
                    new SequenceItem(new CodeSequenceItem(async () => {
                        game.getPlayer().freezeMovment();
                        game.getInputHandler().preventInteraction();
                    }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                    new SequenceItem(new CodeSequenceItem(async () => {
                        let bottom = currentScene.getTile(new TileCoordinate(-6, -24));
                        let top = currentScene.getTile(new TileCoordinate(-6, -25));
                        game.getPlayer().setPos(new TileCoordinate(-5.5, -21.5).toPos(16)); 
                        bottom!.getSprites().length = 0;
                        top!.getSprites().length = 0;
                        bottom?.getSprites().push(new Sprite("assets/teknik.png", 1, 4, 0));
                        top?.getSprites().push(new Sprite("assets/teknik.png", 1, 4, 0));

                        top?.getSprites().push(new Sprite("assets/people.png", 3, 0, 2));
                        bottom?.getSprites().push(new Sprite("assets/people.png", 3, 1, 2));
                    }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                    new SequenceItem(new NPCTextAnimation(martin.bigsprite, "Hej, välkommen till teknikhallen, jag heter Martin och jag är din mentor.", 2500, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                    new SequenceItem(new NPCTextAnimation(martin.bigsprite, "Jag har din skoldator här. Om du har några problem med att logga in så kan du fråga Göran.", 3500, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                    new SequenceItem(new NPCTextAnimation(martin.bigsprite, "Klassen borde ha gått på lunch nu, gå ut ur teknikhallen där borde du hitta Tom och Jens, de kan hjälpa dig hitta till lunchen", 3500, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                    new SequenceItem(new NPCTextAnimation(martin.bigsprite, "Gå inte under några omständigheter ner för trappoorna utanför teknikhallen, det är förbjudet!", 3500, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                    new SequenceItem(new CodeSequenceItem(() => {
                        removePeople(game, currentScene);
                        game.getAudioManager().playBackgroundMusic(game.getAssetLoader().getAudioAsset("assets/slappin_bass.wav")!);
                    }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                    new SequenceItem(new WaitSequenceItem(1000), (item, ctx) => { (item as WaitSequenceItem).run(); }),
                    new SequenceItem(new CodeSequenceItem(() => {
                        let top = currentScene.getTile(new TileCoordinate(-6, -25));
                        let bottom = currentScene.getTile(new TileCoordinate(-6, -24));
                        top!.getSprites().length = 0;
                        bottom!.getSprites().length = 0;
                        top?.getSprites().push(new Sprite("assets/teknik.png", 2, 2, 0));
                        bottom?.getSprites().push(new Sprite("assets/teknik.png", 2, 3, 0));
                    }), (item, ctx) => {
                        (item as CodeSequenceItem).run();
                    }),
                    new SequenceItem(new CodeSequenceItem(() => {
                        game.getPlayer().unfreezeMovment();
                        game.getInputHandler().allowInteraction();
                    }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                ]);
                game.getSequenceExecutor().setSequence(sequence);
            } else {
                let sequence = new Sequence([
                    new SequenceItem(new CodeSequenceItem(() => {
                        game.getPlayer().freezeMovment();
                        game.getInputHandler().preventInteraction();
                    }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                    new SequenceItem(new TextAnimation("*Dörren är låst*", 1500, game.getInputHandler()), (item, ctx) => { (item as TextAnimation).render(ctx, game); }),
                    new SequenceItem(new CodeSequenceItem(() => {
                        game.getPlayer().unfreezeMovment();
                        game.getInputHandler().allowInteraction();
                    }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                ]);
                game.getSequenceExecutor().setSequence(sequence);
            }
        });


        if(!game.getGameState().hasPlayedJohannesLektionCutScene){ // möjlighet för att ändra lite vad man göra beroende på vart man är i spelet
            game.getAudioManager().playBackgroundMusic(game.getAssetLoader().getAudioAsset("assets/Intro.wav")!);
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
                }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                new SequenceItem(new WaitSequenceItem(1000), (item, ctx) => { (item as WaitSequenceItem).run(); }),
                new SequenceItem(new NPCTextAnimation(johannes.bigsprite, "Hej allihopa! För er som är nya, så heter jag Johannes.", 3000, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                new SequenceItem(new NPCTextAnimation(johannes.bigsprite, "Idag ska vi prata lite om kedjeregeln.", 2500, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                new SequenceItem(new NPCTextAnimation(johannes.bigsprite, "När jag var liten så fanns det ett populärt tv program som hette Pimp my ride på MTV.", 4000, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                new SequenceItem(new NPCTextAnimation(johannes.bigsprite, "Och i programet så finns det vissa catchphrases.", 2500, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                new SequenceItem(new NPCTextAnimation(johannes.bigsprite, "En av dessa var 'Yo dawg, I heard you like X, so we put a X in your car...' så här är min version... Är ni redo?", 4000, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                new SequenceItem(new NPCTextAnimation(johannes.bigsprite, "Yo dawg, i heard you like functions", 2000, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                new SequenceItem(new NPCTextAnimation(johannes.bigsprite, "so i put a function in your function!", 2000, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                new SequenceItem(new NPCTextAnimation(johannes.bigsprite, "Fattar ni........... Kedjeregeln gäller för funktioner i funktioner", 4000, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                new SequenceItem(new NPCTextAnimation(johannes.bigsprite, "...... Jag tycker den är rolig i varje fall.", 3500, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                new SequenceItem(new NPCTextAnimation(johannes.bigsprite, "Hur som helst... Idag tänker jag att ni ska räkna lite på egen hand på sidorna 78-79.", 4000, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                //HÄR PAUSAS MUSIKEN OBJS OBS OVBS!
                new SequenceItem(new TextAnimationNoInteract("* Du borde nog prata med din lärare *", 1000, 2000), (item, ctx) => { (item as TextAnimationNoInteract).render(ctx, game); game.getAudioManager().pauseBackgroundMusic();}),
                // Hej!
                new SequenceItem(new CodeSequenceItem(() => {
                    game.getCamera().setCameraOffsetSmooth(new Pos(0, 0), 1000);
                }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                new SequenceItem(new WaitSequenceItem(1000), (item, ctx) => { (item as WaitSequenceItem).run(); }),
                new SequenceItem(new CodeSequenceItem(() => {
                    game.getPlayer().unfreezeMovment();
                    game.getInputHandler().allowInteraction();
                }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
            ]);
        
            game.getSequenceExecutor().setSequence(sequence);
        }
        if(game.getGameState().hasTalkedToTeacherRoomMartin){
            removePeople(game, currentScene);
        }

        if(game.getGameState().hasWonMinigame && prevScene.getScriptName() === "minigame.js" && !game.getGameState().hasRecievedKey) {
            if(game.getGameState().hasReachedHighScoreThreshold){
                game.getPlayer().freezeMovment();
            game.getPlayer().setDirection("up");
            game.getInputHandler().preventInteraction();
            game.getPlayer().setPos(new Pos(-19.5, -21.5).multiply(16));
            await fadeOut(game, 4000);

            let sequence = new Sequence([
                new SequenceItem(new WaitSequenceItem(10), (item, ctx) => { (item as WaitSequenceItem).run(); }),
                new SequenceItem(new CodeSequenceItem(() => {
                    game.getPlayer().freezeMovment();
                    game.getPlayer().setDirection("up");
                    game.getInputHandler().preventInteraction();
                    game.getPlayer().setPos(new Pos(-19.5, -21.5).multiply(16));
                    game.getGameState().hasRecievedKey = true;
                }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                new SequenceItem(new WaitSequenceItem(500), (item, ctx) => { (item as WaitSequenceItem).run(); }),
                new SequenceItem(new NPCTextAnimation(goli.bigsprite, "Snyggt jobbat! Jag har aldrig sett någon få ett sådant högt highscore förut", 3750, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                new SequenceItem(new TextAnimationNoInteract("* GOLI ger dig en nyckel *", 1000, 2000), (item, ctx) => { (item as TextAnimationNoInteract).render(ctx, game); game.getAudioManager().pauseBackgroundMusic();}),
                new SequenceItem(new NPCTextAnimation(goli.bigsprite, "Se om du kan lista ut vart vilken dörr nyckeln leder till... Jag hittade den utanför biblioteket...", 3000, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                new SequenceItem(new NPCTextAnimation(goli.bigsprite, "Lycka till...", 1000, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                new SequenceItem(new NPCTextAnimation(goli.bigsprite, "GOLI OUT!", 1000, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),


                new SequenceItem(new CodeSequenceItem(() => {
                    fadeIn(game, 2500);
                }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                new SequenceItem(new WaitSequenceItem(1000), (item, ctx) => { (item as WaitSequenceItem).run(); }),
                new SequenceItem(new CodeSequenceItem(() => {
                    game.getPlayer().unfreezeMovment();
                    game.getInputHandler().allowInteraction();
                    currentScene.getScriptedObjects().filter(obj => obj.behaviourData === "goli2").forEach(obj => {
                        currentScene.removeScriptedObject(obj);
                    });
                    currentScene.getTile(new TileCoordinate(-20, -23))!.setCollisonRule(CollisionRule.None);
                    fadeOut(game, 2500);
                }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
            ]);
        
            game.getSequenceExecutor().setSequence(sequence);
            }else if(!game.getGameState().goliCutScene1){
                game.getGameState().goliCutScene1 = true;
                game.getPlayer().freezeMovment();
                game.getPlayer().setDirection("up");
                game.getInputHandler().preventInteraction();
                game.getPlayer().setPos(new Pos(-19.5, -21.5).multiply(16));
                await fadeOut(game, 4000);

                let sequence = new Sequence([
                    new SequenceItem(new WaitSequenceItem(10), (item, ctx) => { (item as WaitSequenceItem).run(); }),
                    new SequenceItem(new CodeSequenceItem(() => {
                        game.getPlayer().freezeMovment();
                        game.getPlayer().setDirection("up");
                        game.getInputHandler().preventInteraction();
                        game.getPlayer().setPos(new Pos(-19.5, -21.5).multiply(16));
                    }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                    new SequenceItem(new WaitSequenceItem(500), (item, ctx) => { (item as WaitSequenceItem).run(); }),
                    new SequenceItem(new NPCTextAnimation(goli.bigsprite, "Bra jobbat! Du klarade spelet...", 1000, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                    new SequenceItem(new NPCTextAnimation(goli.bigsprite, "Jag tror du kan nå ett högre highscore om du försöker igen...", 2500, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                    new SequenceItem(new NPCTextAnimation(goli.bigsprite, "Jag har aldrig sett någon få högre än 2500 poäng...", 1750, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                    new SequenceItem(new NPCTextAnimation(goli.bigsprite, "Se om du kan slå 2500 poäng, så ska du få något...", 1350, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),

                    new SequenceItem(new CodeSequenceItem(() => {
                        game.getPlayer().unfreezeMovment();
                        game.getInputHandler().allowInteraction();
                        currentScene.getTile(new TileCoordinate(-20, -23))!.setCollisonRule(CollisionRule.None);
                    }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                ]);
            
                game.getSequenceExecutor().setSequence(sequence);
            }
            
        }

        currentScene.registerBehaviour("alexander", (game: Game, currentScene: Scene, pos: Pos, data: string) => {
            let sequence = new Sequence([
                new SequenceItem(new CodeSequenceItem(() => {
                    game.getPlayer().freezeMovment();
                    game.getInputHandler().preventInteraction();
                }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                new SequenceItem(new NPCTextAnimation(alexander.bigsprite, "Hej, jag heter Alexander, skaka gärna hand med mig!", 2500, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                new SequenceItem(new CodeSequenceItem(() => {
                    game.getPlayer().unfreezeMovment();
                    game.getInputHandler().allowInteraction();
                }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
            ]);
            game.getSequenceExecutor().setSequence(sequence);
        });

        currentScene.registerBehaviour("goli2", (game: Game, currentScene: Scene, pos: Pos, data: string) => {
            if(!game.getGameState().hasPlayedMinigame)
            {
                            let sequence = new Sequence([
                new SequenceItem(new CodeSequenceItem(() => {
                    game.getPlayer().freezeMovment();
                    game.getInputHandler().preventInteraction();
                }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                new SequenceItem(new NPCTextAnimation(goli.bigsprite, "Yo dawg! Goli in the house!", 750, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                new SequenceItem(new NPCTextAnimation(goli.bigsprite, "Provspela gärna det här spelet som två av våra elever på teknikprogrammet har skapat i kursen programmering 1", 4000, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                new SequenceItem(new NPCTextAnimation(goli.bigsprite, "Du kan spela det på arkadmaskinen här brevid", 1000, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),

                new SequenceItem(new CodeSequenceItem(() => {
                    game.getPlayer().unfreezeMovment();
                    game.getInputHandler().allowInteraction();
                }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
            ]);
            game.getSequenceExecutor().setSequence(sequence);

            }
            else if(game.getGameState().hasPlayedMinigame && !game.getGameState().hasWonMinigame) {
                            let sequence = new Sequence([
                new SequenceItem(new CodeSequenceItem(() => {
                    game.getPlayer().freezeMovment();
                    game.getInputHandler().preventInteraction();
                }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                new SequenceItem(new NPCTextAnimation(goli.bigsprite, "Imponerande spel, eller hur? Det har alltså två av våra elever skapat...", 2250, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                new SequenceItem(new NPCTextAnimation(goli.bigsprite, "Men du, försök gärna igen.... du kan alltid försöka igen, komma lite längre...", 2650, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                new SequenceItem(new NPCTextAnimation(goli.bigsprite, "Det kanske finns ett slut på spelet...", 1000, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),

                new SequenceItem(new CodeSequenceItem(() => {
                    game.getPlayer().unfreezeMovment();
                    game.getInputHandler().allowInteraction();
                }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
            ]);
            game.getSequenceExecutor().setSequence(sequence);

            }
            else {
                            let sequence = new Sequence([
                new SequenceItem(new CodeSequenceItem(() => {
                    game.getPlayer().freezeMovment();
                    game.getInputHandler().preventInteraction();
                }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                new SequenceItem(new NPCTextAnimation(goli.bigsprite, "Snyggt att du klarade spelet...", 1000, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                new SequenceItem(new NPCTextAnimation(goli.bigsprite, "Jag har dock sett ett par högre highscores...", 1250, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                new SequenceItem(new NPCTextAnimation(goli.bigsprite, "Jag tror inte jag har sett någon få fler poäng än 2500...", 2000, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                new SequenceItem(new NPCTextAnimation(goli.bigsprite, "Se om du kan slå det. I så fall har jag någonting åt dig...", 2000, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),

                new SequenceItem(new CodeSequenceItem(() => {
                    game.getPlayer().unfreezeMovment();
                    game.getInputHandler().allowInteraction();
                }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
            ]);
            game.getSequenceExecutor().setSequence(sequence);

            }
        });

        currentScene.registerBehaviour("arcade", (game: Game, currentScene: Scene, pos: Pos, data: String) => {
            let sequence = new Sequence([
                new SequenceItem(new CodeSequenceItem(() => {
                    game.getPlayer().freezeMovment();
                    game.getInputHandler().preventInteraction();
                }), (item, ctx) => {
                    (item as CodeSequenceItem).run();
                }),
                new SequenceItem(new TextAnimation("Du slår på maskinen och startar spelet (*whaaaat?? ett spel i ett spel?? hur crazy är inte det... Tryck på ESC eller L för att avsluta spelet tidigt) ", 4000, game.getInputHandler()), (item, ctx) => {
                    (item as TextAnimation).render(ctx, game);
                }),
                new SequenceItem(new CodeSequenceItem(() => {
                    currentScene.addScriptedObject(new ScriptedObject(new Pos(-19, -22).multiply(16), ObjectBehaviour.ChangeScene, "assets/minigame.json", new Sprite("assets/dungeon.png", 0, 0, 0)));
                }), (item, ctx) => {
                    (item as CodeSequenceItem).run();
                }),
            ]);
            game.getSequenceExecutor().setSequence(sequence);
        });

        currentScene.registerBehaviour("johannes", async (game: Game, currentScene: Scene, pos: Pos, data: string) => {
            if(!game.getGameState().hasTalkedToTeacherRoomMartin) {
                let sequence = new Sequence([
                    new SequenceItem(new CodeSequenceItem(() => {
                        game.getPlayer().freezeMovment();
                        game.getInputHandler().preventInteraction();
                    }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                    new SequenceItem(new NPCTextAnimation(johannes.bigsprite, "Hej, din mentor Martin har en skoldator till dig", 2500, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                    new SequenceItem(new NPCTextAnimation(johannes.bigsprite, "Martin är i lärarrummet, dit hittar du genom att gå höger ut ur klassrummet, sedan rakt fram en bit och så ligger lärarrummet bakom dörren längst till höger", 5000, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                    new SequenceItem(new CodeSequenceItem(() => {
                        game.getPlayer().unfreezeMovment();
                        game.getInputHandler().allowInteraction();
                    }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                ]);

                game.getSequenceExecutor().setSequence(sequence);
            } else {
                let sequence = new Sequence([
                    new SequenceItem(new CodeSequenceItem(() => {
                        game.getPlayer().freezeMovment();
                        game.getInputHandler().preventInteraction();
                    }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                    new SequenceItem(new NPCTextAnimation(johannes.bigsprite, "Resten av din klass har gått på lunch", 2500, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                    new SequenceItem(new CodeSequenceItem(() => {
                        game.getPlayer().unfreezeMovment();
                        game.getInputHandler().allowInteraction();
                    }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                ]);

                game.getSequenceExecutor().setSequence(sequence);
            }

        });
        currentScene.registerBehaviour("jens", (game: Game, currentScene: Scene, pos: Pos, data: string) => {
            if(game.getGameState().hasTalkedToTeacherRoomMartin) return;
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
            if(game.getGameState().hasTalkedToTeacherRoomMartin) return;
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

        currentScene.registerBehaviour("jesper", (game: Game, currentScene: Scene, pos: Pos, data: string) => {
            let sequence = new Sequence([
                new SequenceItem(new CodeSequenceItem(() => {
                    game.getPlayer().freezeMovment();
                    game.getInputHandler().preventInteraction();
                }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                new SequenceItem(new NPCTextAnimation(jesper.bigsprite, "Hej, jag heter Jesper, jag är matte/fysik lärare.", 2500, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                new SequenceItem(new NPCTextAnimation(jesper.bigsprite, "Alla gör fel någon gång, ty de är mänskliga...", 2000, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                new SequenceItem(new NPCTextAnimation(jesper.bigsprite, "Förutom jag.", 750, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                new SequenceItem(new CodeSequenceItem(() => {
                    game.getPlayer().unfreezeMovment();
                    game.getInputHandler().allowInteraction();
                }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
            ]);
            game.getSequenceExecutor().setSequence(sequence);
        });

        currentScene.registerBehaviour("daniel", (game: Game, currentScene: Scene, pos: Pos, data: string) => {
            let sequence = new Sequence([
                new SequenceItem(new CodeSequenceItem(() => {
                    game.getPlayer().freezeMovment();
                    game.getInputHandler().preventInteraction();
                }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                new SequenceItem(new NPCTextAnimation(daniel.bigsprite, "Hej, jag heter Daniel, jag är lärare i matte och fysik", 2500, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                new SequenceItem(new NPCTextAnimation(daniel.bigsprite, "Jag gillar att åka skidor", 2500, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                new SequenceItem(new CodeSequenceItem(() => {
                    game.getPlayer().unfreezeMovment();
                    game.getInputHandler().allowInteraction();
                }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
            ]);
            game.getSequenceExecutor().setSequence(sequence);
        });

        currentScene.registerBehaviour("other", (game: Game, currentScene: Scene, pos: Pos, data: string) => {
            if(game.getGameState().hasTalkedToTeacherRoomMartin) return;
            let sequence = new Sequence([
                new SequenceItem(new CodeSequenceItem(() => {
                    game.getPlayer().freezeMovment();
                    game.getInputHandler().preventInteraction();
                }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                new SequenceItem(new TextAnimation("Låt mig räkna matte ifred", 1500, game.getInputHandler()), (item, ctx) => { (item as TextAnimation).render(ctx, game); }),
                new SequenceItem(new CodeSequenceItem(() => {
                    game.getPlayer().unfreezeMovment();
                    game.getInputHandler().allowInteraction();
                }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
            ]);
            game.getSequenceExecutor().setSequence(sequence);
        });
    };
    onExit (game: Game, currentScene: Scene) {

    };
    render(game: Game, currentScene: Scene) {

    };

    onInteraction(game: Game, currentScene: Scene, pos: Pos, data: string) {
        
    }
}

function removePeople(game: Game, currentScene: Scene) {
    let removePeoplePos = [
        new Pos(-1, -13),
        new Pos(-1, -14),
        new Pos(-1, -10),
        new Pos(-1, -11),
        new Pos(2, -13),
        new Pos(2, -14),
        new Pos(2, -10),
        new Pos(2, -11),
        new Pos(4, -13),
        new Pos(4, -14),
        new Pos(4, -10),
        new Pos(4, -11),
    ]

    if(game.getGameState().hasPlayedJohannesLektionCutScene && game.getGameState().hasTalkedToTeacherRoomMartin) {
        removePeoplePos.push(new Pos(-7, -10), new Pos(-7, -11));
    }
    removePeoplePos.forEach(pos => {
        let tile = currentScene.getTile(pos.toTileCoordinate());
        tile!.getSprites().forEach((sprite, i) => {
            if(sprite.spriteSheetSrc === "assets/people.png") {
                tile!.getSprites().splice(i, 1);
            }
        });
        tile!.setCollisonRule(CollisionRule.None);
    });

}
