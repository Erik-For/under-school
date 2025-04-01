import { BigSprite, NPCTextAnimation, TextAnimationNoInteract } from "../animate.js";
import { Game, Particle, Snow, Pos, BurstParticle } from "../game.js";
import { Player } from "../player.js";
import { CollisionRule, isButtonPressed, ObjectBehaviour, Scene, SceneScript, ScriptedObject, setButtonPressed, TileCoordinate } from "../scene.js";
import { CodeSequenceItem, Sequence, SequenceItem, WaitSequenceItem } from "../sequence.js";
import { Sprite } from "../sprite.js";

export default class Script implements SceneScript {
    name: string = "snow2.js";
    #buttons: ScriptedObject[] = [
        new ScriptedObject(new Pos(93, -6).multiply(16), ObjectBehaviour.Button, "bra", new Sprite("assets/dungeon.png", 2, 1, 0)),
        new ScriptedObject(new Pos(116, -6).multiply(16), ObjectBehaviour.Button, "bra", new Sprite("assets/dungeon.png", 2, 1, 0)),
        new ScriptedObject(new Pos(116, -11).multiply(16), ObjectBehaviour.Button, "bra", new Sprite("assets/dungeon.png", 2, 1, 0)),
        new ScriptedObject(new Pos(112, -11).multiply(16), ObjectBehaviour.Button, "bra", new Sprite("assets/dungeon.png", 2, 1, 0)),
        new ScriptedObject(new Pos(112, -15).multiply(16), ObjectBehaviour.Button, "bra", new Sprite("assets/dungeon.png", 2, 1, 0)),
        new ScriptedObject(new Pos(97, -15).multiply(16), ObjectBehaviour.Button, "bra", new Sprite("assets/dungeon.png", 2, 1, 0)),
        new ScriptedObject(new Pos(97, -11).multiply(16), ObjectBehaviour.Button, "bra", new Sprite("assets/dungeon.png", 2, 1, 0)),
        new ScriptedObject(new Pos(102, -11).multiply(16), ObjectBehaviour.Button, "bra", new Sprite("assets/dungeon.png", 2, 1, 0)),
        
        new ScriptedObject(new Pos(93, -11).multiply(16), ObjectBehaviour.Button, "bad", new Sprite("assets/dungeon.png", 2, 1, 0)),
        new ScriptedObject(new Pos(116, -15).multiply(16), ObjectBehaviour.Button, "bad", new Sprite("assets/dungeon.png", 2, 1, 0)),
    ]
    onEnter(prevScene: Scene, game: Game, currentScene: Scene){
        switch(prevScene.getScriptName()){
            default:
                game.getPlayer().setPos(new Pos(92, 27).multiply(16));
                game.getPlayer().setDirection("right");
                break;
            case "snow1.js":
                game.getPlayer().setPos(new Pos(-1, -1.5).multiply(16));
                game.getPlayer().setDirection("right");
                break;
            case "snow3.js":
                game.getPlayer().setPos(new Pos(35, -5).multiply(16));
                game.getPlayer().setDirection("down");
                break;
            case "stars.js":
                game.getPlayer().setPos(new Pos(8, -39.5).multiply(16));
                game.getPlayer().setDirection("up");
                break;
        }

        currentScene.addManyScriptedObjects(
            new ScriptedObject(new Pos(35, -6).multiply(16), ObjectBehaviour.ChangeScene, "assets/snow3.json", new Sprite("assets/dungeon.png", 0, 0, 0)),
            new ScriptedObject(new Pos(34, -6).multiply(16), ObjectBehaviour.ChangeScene, "assets/snow3.json", new Sprite("assets/dungeon.png", 0, 0, 0)),
            new ScriptedObject(new Pos(-3, -2).multiply(16), ObjectBehaviour.ChangeScene, "assets/snow1.json", new Sprite("assets/dungeon.png", 0, 0, 0)),
            new ScriptedObject(new Pos(7, -41).multiply(16), ObjectBehaviour.Interactable, "scope", new Sprite("assets/snowset.png", 6, 3, 0)),
            new ScriptedObject(new Pos(8, -41).multiply(16), ObjectBehaviour.Interactable, "scope", new Sprite("assets/snowset.png", 7, 3, 0)),

        )

        currentScene.registerBehaviour("scope", (game: Game, currentScene: Scene, pos: Pos, data: String) => {
            let sequence = new Sequence([
                new SequenceItem(new TextAnimationNoInteract("Du hukar dig ner och ser genom teleskopet upp mot natthimlen", 1000, 1500), (item, ctx) => {
                    (item as TextAnimationNoInteract).render(ctx, game);
                }),
                new SequenceItem(new CodeSequenceItem(() => {
                    currentScene.addScriptedObject(new ScriptedObject(new Pos(8, -40).multiply(16), ObjectBehaviour.ChangeScene, "assets/stars.json", new Sprite("assets/dungeon.png", 0, 0, 0)));
                    currentScene.addScriptedObject(new ScriptedObject(new Pos(7, -40).multiply(16), ObjectBehaviour.ChangeScene, "assets/stars.json", new Sprite("assets/dungeon.png", 0, 0, 0)));        
                }), (item, ctx) => {
                    (item as CodeSequenceItem).run();
                }),
            ]);
            game.getSequenceExecutor().setSequence(sequence);
        });

        currentScene.addManyScriptedObjects(...this.#buttons);
        currentScene.registerBehaviour("bra", (game: Game, currentScene: Scene, pos: Pos, data: String) => {
            let ans = ""
            this.#buttons.forEach(button => {
                if(isButtonPressed(currentScene, button.pos.divide(16).floor().toTileCoordinate())) {
                    ans += "0"
                } else {
                    ans += "1"
                }
            })
            console.log(ans);
            
            if(ans === "1111111100") {
                if(game.getGameState().hasSolvedIcePuzzle) return;
                game.getGameState().hasSolvedIcePuzzle = true;

                let sequence = new Sequence([
                    new SequenceItem(new CodeSequenceItem(() => {
                        game.getCamera().cameraShake(500, 2, game);
                    }), (item, ctx) => {
                        (item as CodeSequenceItem).run();
                    }),
                    new SequenceItem(new WaitSequenceItem(500), (item, ctx) => {
                        (item as WaitSequenceItem).run();
                    }),
                    new SequenceItem(new TextAnimationNoInteract("Gången söderut är nu öppnad", 1000, 1000), (item, ctx) => {
                        (item as TextAnimationNoInteract).render(ctx, game);
                    }),
                ])
                
                currentScene.getTile(new TileCoordinate(91, -2))!.setCollisonRule(CollisionRule.None);
                currentScene.getTile(new TileCoordinate(92, -2))!.setCollisonRule(CollisionRule.None);
                currentScene.getTile(new TileCoordinate(91, -2))!.getSprites().pop();
                currentScene.getTile(new TileCoordinate(92, -2))!.getSprites().pop();

                game.getSequenceExecutor().setSequence(sequence);
            }
        })
        currentScene.registerBehaviour("bad", (game: Game, currentScene: Scene, pos: Pos, data: String) => {
            this.#buttons.forEach(button => {
                setButtonPressed(currentScene, button.pos.divide(16).floor().toTileCoordinate(), false);
            })
        })

        this.#buttons.forEach(button => {
            setButtonPressed(currentScene, button.pos.divide(16).floor().toTileCoordinate(), false);
        })

        if(!game.getGameState().hasSolvedIcePuzzle) {
            currentScene.getTile(new TileCoordinate(91, -2))!.setCollisonRule(CollisionRule.Solid);
            currentScene.getTile(new TileCoordinate(92, -2))!.setCollisonRule(CollisionRule.Solid);
            currentScene.getTile(new TileCoordinate(91, -2))!.getSprites().push(new Sprite("assets/snowset.png", 2, 3, 5));
            currentScene.getTile(new TileCoordinate(92, -2))!.getSprites().push(new Sprite("assets/snowset.png", 2, 3, 5));
        }
        if(game.getGameState().hasReadExplosiveSign) {
            currentScene.getTile(new TileCoordinate(35, -6))!.getSprites().length = 0
            currentScene.getTile(new TileCoordinate(35, -7))!.getSprites().length = 0
            currentScene.getTile(new TileCoordinate(34, -6))!.getSprites().length = 0
            currentScene.getTile(new TileCoordinate(34, -7))!.getSprites().length = 0

            currentScene.getTile(new TileCoordinate(35, -6))!.setCollisonRule(CollisionRule.None);
            currentScene.getTile(new TileCoordinate(35, -7))!.setCollisonRule(CollisionRule.None);
            currentScene.getTile(new TileCoordinate(34, -6))!.setCollisonRule(CollisionRule.None);
            currentScene.getTile(new TileCoordinate(34, -7))!.setCollisonRule(CollisionRule.None);
        }

        currentScene.addManyScriptedObjects(
            new ScriptedObject(new Pos(6, -10).multiply(16), ObjectBehaviour.Sign, "^ Norra Bergstoppen ^", new Sprite("assets/saker.png", 6, 0, 0)),
            new ScriptedObject(new Pos(30, -6).multiply(16), ObjectBehaviour.Sign, "Varning för halka", new Sprite("assets/saker.png", 7, 0, 0)),
            new ScriptedObject(new Pos(88, -5).multiply(16), ObjectBehaviour.Sign, "Börja här: Ö Ö N V N V S Ö", new Sprite("assets/saker.png", 6, 0, 0)),
            new ScriptedObject(new Pos(92, 25).multiply(16), ObjectBehaviour.Interactable, "skylt", new Sprite("assets/saker.png", 6, 0, 0)),
            new ScriptedObject(new Pos(9, -38).multiply(16), ObjectBehaviour.Sign, "Utkiksplats ", new Sprite("assets/saker.png", 6, 0, 0)),
        );

        currentScene.registerBehaviour("skylt", (game: Game, currentScene: Scene, pos: Pos, data: String) => {
            if(game.getGameState().hasReadExplosiveSign) return;
            game.getGameState().hasReadExplosiveSign = true;

            let sequence = new Sequence([
                new SequenceItem(new CodeSequenceItem(() => {
                    game.getPlayer().freezeMovment();
                    game.getInputHandler().preventInteraction();
                }), (item, ctx) => {
                    (item as CodeSequenceItem).run();
                }),
                new SequenceItem(new TextAnimationNoInteract("Vid berget där man halka, en öppning börja nalka(s)", 1000, 2500), (item, ctx) => {
                    (item as TextAnimationNoInteract).render(ctx, game);
                }),
                new SequenceItem(new CodeSequenceItem(() => {
                    //remove the sign it is not a tile, its a scripted object
                    currentScene.getScriptedObjects().forEach((obj) => {
                        if(obj.pos.equals(new Pos(92, 25).multiply(16))) {
                            currentScene.removeScriptedObject(obj);
                        }
                    });
                    currentScene.getTile(new TileCoordinate(92, 25))!.setCollisonRule(CollisionRule.None);
                    //spawn a bunch of sign particles
                    for (let i = 0; i < 100; i++) {
                        const signParticle = new BurstParticle(new Pos(92.5, 25).multiply(16), game.getAssetLoader().getSpriteSheet("assets/saker.png")!.getSprite(6, 0));
                        game.getParticleManager().addParticle(signParticle);
                    }
                    game.getCamera().cameraShake(500, 2, game);
                }), (item, ctx) => {
                    (item as CodeSequenceItem).run();
                }),
                new SequenceItem(new WaitSequenceItem(1000), (item, ctx) => {
                    (item as WaitSequenceItem).run();
                }),
                new SequenceItem(new CodeSequenceItem(() => {
                    currentScene.getTile(new TileCoordinate(35, -6))!.getSprites().length = 0
                    currentScene.getTile(new TileCoordinate(35, -7))!.getSprites().length = 0
                    currentScene.getTile(new TileCoordinate(34, -6))!.getSprites().length = 0
                    currentScene.getTile(new TileCoordinate(34, -7))!.getSprites().length = 0

                    currentScene.getTile(new TileCoordinate(35, -6))!.setCollisonRule(CollisionRule.None);
                    currentScene.getTile(new TileCoordinate(35, -7))!.setCollisonRule(CollisionRule.None);
                    currentScene.getTile(new TileCoordinate(34, -6))!.setCollisonRule(CollisionRule.None);
                    currentScene.getTile(new TileCoordinate(34, -7))!.setCollisonRule(CollisionRule.None);

                    game.getPlayer().unfreezeMovment();
                    game.getInputHandler().allowInteraction();
                }), (item, ctx) => {
                    (item as CodeSequenceItem).run();
                })
            ]);
            game.getSequenceExecutor().setSequence(sequence);
        })
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

    onInteraction(game: Game, currentScene: Scene, pos: Pos, data: string) {
        
    }
}