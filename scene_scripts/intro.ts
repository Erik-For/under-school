import { BigSprite, NPCTextAnimation, TextAnimation, TextAnimationNoInteract } from "../animate.js";
import { Game, Particle, Pos } from "../game.js";
import { changeScene, CollisionRule, fadeIn, fadeOut, ObjectBehaviour, Scene, SceneScript, ScriptedObject, TileCoordinate } from "../scene.js";
import { AsyncCodeSequenceItem, CodeSequenceItem, Sequence, SequenceItem, WaitSequenceItem } from "../sequence.js";
import { Sprite } from "../sprite.js";

export default class Script implements SceneScript {
    name: string = "intro.js";
    
    async onEnter(prevScene: Scene, game: Game, currentScene: Scene){
        switch(prevScene.getScriptName()){
            case "mainmenu.js":
                game.getPlayer().setPos(new Pos(-1, 6.5).multiply(16));
                goliCutScene(game, currentScene);
                break;
            case "teknik.js":
                game.getPlayer().setPos(new Pos(26.5, -3).multiply(16));
                break;
            default:
                game.getPlayer().setPos(new Pos(14, -3));
                break;
        }

        currentScene.addManyScriptedObjects(
            new ScriptedObject(new Pos(18, -7).multiply(16), ObjectBehaviour.Sign, "Trappor, förbjudet!", new Sprite("assets/saker.png", 7, 0, 10)),
            new ScriptedObject(new Pos(17, -8).multiply(16), ObjectBehaviour.Walkable, "ner", new Sprite("assets/dungeon.png", 0, 0, 10))
        );

        let hasWalkedDown = false;
        currentScene.registerBehaviour("ner", async (game: Game, currentScene: Scene, pos: Pos, data: string) => {
            if(hasWalkedDown) return;
            hasWalkedDown = true;
            game.getAudioManager().pauseBackgroundMusic();
            let sequence = new Sequence([
                new SequenceItem(new CodeSequenceItem(() => {
                    game.getPlayer().freezeMovment();
                    game.getInputHandler().preventInteraction();
                }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                new SequenceItem(new AsyncCodeSequenceItem(() => {
                    return fadeIn(game, 1000);
                }), (item, ctx) => { (item as AsyncCodeSequenceItem).run(); }),
                new SequenceItem(new WaitSequenceItem(1000), (item, ctx) => { (item as WaitSequenceItem).run(); }),
                new SequenceItem(new TextAnimationNoInteract("*Medans du går ner snubblar du och faller ner för en brunn*", 2000, 2000), (item, ctx) => { (item as TextAnimationNoInteract).render(ctx, game); }),
                new SequenceItem(new CodeSequenceItem(() => {
                    changeScene(game, "assets/dungeon.json");
                    fadeOut(game, 1000);
                }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
            ]);
            game.getSequenceExecutor().setSequence(sequence);
        });

        if(!game.getGameState().hasTalkedToTeacherRoomMartin){
            game.getAudioManager().playBackgroundMusic(game.getAssetLoader().getAudioAsset("assets/Underschool.wav")!);
            currentScene.getTile(new TileCoordinate(19, -6))?.setCollisonRule(CollisionRule.Solid);
            currentScene.getTile(new TileCoordinate(19, -7))?.getSprites().push(new Sprite("assets/people.png", 2, 0, 10));
            currentScene.getTile(new TileCoordinate(19, -6))?.getSprites().push(new Sprite("assets/people.png", 2, 1, 10));
         
            currentScene.addScriptedObject(new ScriptedObject(new Pos(19, -6).multiply(16), ObjectBehaviour.Interactable, "holgros", new Sprite("assets/dungeon.png", 0, 0, 10)));

            let holger = {
                bigsprite: new BigSprite(
                    new Sprite("assets/faces.png", 14, 0, 0),
                    new Sprite("assets/faces.png", 13, 0, 0),
                    new Sprite("assets/faces.png", 14, 1, 0),
                    new Sprite("assets/faces.png", 13, 1, 0),
                )
            }

            currentScene.registerBehaviour("holgros", async (game: Game, currentScene: Scene, pos: Pos, data: string) => {
                let sequence = new Sequence([
                    new SequenceItem(new CodeSequenceItem(() => {
                        game.getPlayer().freezeMovment();
                        game.getInputHandler().preventInteraction();
                    }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                    new SequenceItem(new NPCTextAnimation(holger.bigsprite, "Hej, jag heter Holger jag är lärare på teknikprogrammet", 3000, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                    new SequenceItem(new NPCTextAnimation(holger.bigsprite, "Ingen får gå ned för dessa trappor, det är förbjudet!", 3000, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                    new SequenceItem(new CodeSequenceItem(() => {
                        game.getPlayer().unfreezeMovment();
                        game.getInputHandler().allowInteraction();
                    }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                ]);
                game.getSequenceExecutor().setSequence(sequence);
            });
        } else {
            // -24, -11, -12
            currentScene.getTile(new TileCoordinate(24, -12))?.getSprites().push(new Sprite("assets/people.png", 6, 0, 10));
            currentScene.getTile(new TileCoordinate(24, -11))?.getSprites().push(new Sprite("assets/people.png", 6, 1, 10));
            currentScene.getTile(new TileCoordinate(25, -12))?.getSprites().push(new Sprite("assets/people.png", 5, 0, 10));
            currentScene.getTile(new TileCoordinate(25, -11))?.getSprites().push(new Sprite("assets/people.png", 5, 1, 10));

            currentScene.addManyScriptedObjects(
                new ScriptedObject(new Pos(24, -11).multiply(16), ObjectBehaviour.Interactable, "prat", new Sprite("assets/dungeon.png", 0, 0, 10)),
                new ScriptedObject(new Pos(25, -11).multiply(16), ObjectBehaviour.Interactable, "prat", new Sprite("assets/dungeon.png", 0, 0, 10))
            );

            currentScene.registerBehaviour("prat", async (game: Game, currentScene: Scene, pos: Pos, data: string) => {
                let sequence = new Sequence([
                    new SequenceItem(new CodeSequenceItem(() => {
                        game.getPlayer().freezeMovment();
                        game.getInputHandler().preventInteraction();
                    }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                    new SequenceItem(new TextAnimationNoInteract("*Oavbruttet prat*", 500, 1000), (item, ctx) => { (item as TextAnimationNoInteract).render(ctx, game); }),
                    new SequenceItem(new CodeSequenceItem(() => {
                        game.getPlayer().unfreezeMovment();
                        game.getInputHandler().allowInteraction();
                    }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                ]);
                game.getSequenceExecutor().setSequence(sequence);
            });
        }
        currentScene.addManyScriptedObjects(
            new ScriptedObject(new Pos(-2, -7).multiply(16), ObjectBehaviour.Sign, "GOLI WAS HERE!!!!!!!!!!!!!!", new Sprite("assets/saker.png", 6, 0, 0)),
            new ScriptedObject(new Pos(27, -3).multiply(16), ObjectBehaviour.ChangeScene, "assets/teknik.json", new Sprite("assets/teknik.png", 0, 0, 0)),
            new ScriptedObject(new Pos(27, -4).multiply(16), ObjectBehaviour.ChangeScene, "assets/teknik.json", new Sprite("assets/teknik.png", 0, 0, 0))
        );

        await fadeOut(game, 5000);
    };

    // 27, -3; 27, -4
    onExit (game: Game, currentScene: Scene) {

    };
    render(game: Game, currentScene: Scene) {

    };
}

function goliCutScene(game: Game, currentScene: Scene) {
    let goli = {
        top: new Sprite("assets/people.png", 0, 0, 10),
        bottom: new Sprite("assets/people.png", 0, 1, 10),
        tilecoord: new TileCoordinate(-1, 3)
    }

    let charecter = new BigSprite(
        new Sprite("assets/faces.png", 8, 0, 0),
        new Sprite("assets/faces.png", 9, 0, 0),
        new Sprite("assets/faces.png", 8, 1, 0),
        new Sprite("assets/faces.png", 9, 1, 0)
    );

    let feet = currentScene.getTile(goli.tilecoord.add(new TileCoordinate(0, 1)))!;
    let head = currentScene.getTile(goli.tilecoord)!;

    game.getPlayer().freezeMovment();
    game.getInputHandler().preventInteraction();

    feet.setCollisonRule(CollisionRule.Solid);
    head.setCollisonRule(CollisionRule.Solid);
    feet.getSprites().push(goli.bottom);
    head.getSprites().push(goli.top);

    let sequence = new Sequence([
        new SequenceItem(
            new WaitSequenceItem(1000),
            (item, ctx) => {
                (item as WaitSequenceItem).run();
            }
        ),
        new SequenceItem(
            new NPCTextAnimation(charecter, "Hej, jag heter Göran men du kan kalla mig GOLI..... använd dig av WASD för att röra dig och klicka på K för att interagera med objekt och dialog.", 8000, game.getInputHandler()),
            (item, ctx) => {
                (item as NPCTextAnimation).render(ctx, game);
            }
        ),
        new SequenceItem(
            new NPCTextAnimation(charecter, "Om du tycker jag pratar för långsamt kan du snabbspola dialog genom att trycka på L.", 5000, game.getInputHandler()),
            (item, ctx) => {
                (item as NPCTextAnimation).render(ctx, game);
            }
        ),
        new SequenceItem(
            new NPCTextAnimation(charecter, "Men i varje fall varmt välkommen till Åva gymmnasium där alla är välkomna. *mumlar för sig själv* Förutom tibble elever...", 5000, game.getInputHandler()),
            (item, ctx) => {
                (item as NPCTextAnimation).render(ctx, game);
            }
        ),
        new SequenceItem(
            new NPCTextAnimation(charecter, "Men jag ska inte störa dig mer, jag hörde att du var på väg till teknikhallen, den ligger till höger rakt fram, gå inte ner för trappan under några omständigheter.", 6500, game.getInputHandler()),
            (item, ctx) => {
                (item as NPCTextAnimation).render(ctx, game);
            }
        ),
        new SequenceItem(
            new NPCTextAnimation(charecter, "Hejdå!", 800, game.getInputHandler()),
            (item, ctx) => {
                (item as NPCTextAnimation).render(ctx, game);
            }
        ),
        new SequenceItem(new AsyncCodeSequenceItem(() => {
            return fadeIn(game, 1000);
        }), (item, ctx) => {
            (item as AsyncCodeSequenceItem).run();
        }),
        new SequenceItem(
            new CodeSequenceItem(() => {
                feet.setCollisonRule(CollisionRule.None);
                head.setCollisonRule(CollisionRule.None);
                feet.getSprites().splice(feet.getSprites().indexOf(goli.bottom), 1);
                head.getSprites().splice(head.getSprites().indexOf(goli.top), 1);

                game.getPlayer().unfreezeMovment();
                game.getInputHandler().allowInteraction();
            }),
            (item, ctx) => {
                (item as CodeSequenceItem).run();
            }
        ),
        new SequenceItem(new AsyncCodeSequenceItem(() => {
            return fadeOut(game, 4000);
        }), (item, ctx) => {
            (item as AsyncCodeSequenceItem).run();
        }),

    ])
    game.getSequenceExecutor().setSequence(sequence);
}

