import { BigSprite, NPCTextAnimation } from "../animate.js";
import { Game, Particle, Pos } from "../game.js";
import { CollisionRule, isButtonPressed, ObjectBehaviour, Scene, SceneScript, ScriptedObject, TileCoordinate } from "../scene.js";
import { CodeSequenceItem, Sequence, SequenceItem } from "../sequence.js";
import { Sprite } from "../sprite.js";

const ruben = {
    bigsprite: new BigSprite (
        new Sprite("assets/faces.png", 46, 0, 0),
        new Sprite("assets/faces.png", 47, 0, 0),
        new Sprite("assets/faces.png", 46, 1, 0),
        new Sprite("assets/faces.png", 47, 1, 0),
    )
}

export default class Script implements SceneScript {
    name: string = "supersecretroom.js";
    #buttons: ScriptedObject[] = [
        new ScriptedObject(new Pos(-8, -5).multiply(16), ObjectBehaviour.Button, "btn", new Sprite("assets/dungeon.png", 0, 1, 0)),
        new ScriptedObject(new Pos(7, -5).multiply(16), ObjectBehaviour.Button, "btn", new Sprite("assets/dungeon.png", 0, 1, 0)),
        new ScriptedObject(new Pos(-8, 3).multiply(16), ObjectBehaviour.Button, "btn", new Sprite("assets/dungeon.png", 0, 1, 0)),
        new ScriptedObject(new Pos(7, 3).multiply(16), ObjectBehaviour.Button, "btn", new Sprite("assets/dungeon.png", 0, 1, 0)),
    ]
    #pranks: number = 0;
    #canInteract: boolean = false;
    
    onEnter(prevScene: Scene, game: Game, currentScene: Scene){
        switch(prevScene.getScriptName()){
            case "intro.js":
                game.getPlayer().setPos(new Pos(0, 32.5).multiply(16));
                game.getPlayer().setDirection("down");
                break;
            default:
                game.getPlayer().setPos(new Pos(0, 32.5).multiply(16));
                break;
            
        }

        game.getPlayer().unfreezeMovment();
        game.getInputHandler().allowInteraction();

        currentScene.addManyScriptedObjects(
            new ScriptedObject(new Pos(0, -2).multiply(16), ObjectBehaviour.Interactable, "ruben", new Sprite("assets/people.png", 15, 0, 0)),
            new ScriptedObject(new Pos(0, -1).multiply(16), ObjectBehaviour.Interactable, "ruben", new Sprite("assets/people.png", 15, 1, 0)),
            new ScriptedObject(new Pos(0, -6).multiply(16), ObjectBehaviour.Sign, "Dörren är låst", new Sprite("assets/ingang.png", 0, 0, 0)),
            new ScriptedObject(new Pos(-1, -6).multiply(16), ObjectBehaviour.Sign, "Dörren är låst", new Sprite("assets/ingang.png", 0, 0, 0)),

        )
        
        currentScene.registerBehaviour("ruben", (game: Game, currentScene: Scene, pos: Pos, data: string) => {
            if(this.#pranks === 0  && !this.#canInteract)
            {
                let sequence = new Sequence([
                                        new SequenceItem(new CodeSequenceItem(() => {
                                            game.getPlayer().freezeMovment();
                                            game.getInputHandler().preventInteraction();
                                        }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                                        new SequenceItem(new NPCTextAnimation(ruben.bigsprite, "Hejsan! Jag heter Ruben...", 750, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                                        new SequenceItem(new NPCTextAnimation(ruben.bigsprite, "Kul att du tog dig igenom mitt lilla racing-spel... Jag är imponerad", 2750, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                                        new SequenceItem(new NPCTextAnimation(ruben.bigsprite, "Jag hoppas att det var lite svårt att klara...", 1550, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                                        new SequenceItem(new NPCTextAnimation(ruben.bigsprite, "Det tog en hel del justering för att det skulle bli lagom svårt...", 2250, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                                        new SequenceItem(new NPCTextAnimation(ruben.bigsprite, "Hur som helst... Nu har du klarat spelets enda 'sidequest'. Grattis!", 2250, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                                        new SequenceItem(new NPCTextAnimation(ruben.bigsprite, "Innan du får återgå till att själva spelet måste du låsa upp dörren...", 3250, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                                        new SequenceItem(new NPCTextAnimation(ruben.bigsprite, "Dra i spaken längst upp till vänster och lengst ner till höger för att låsa upp dörren", 3000, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                                        new SequenceItem(new NPCTextAnimation(ruben.bigsprite, "Kom tillbaka till mig om du har några frågor. Lycka till.", 1750, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),


                                        new SequenceItem(new CodeSequenceItem(() => {
                                            game.getPlayer().unfreezeMovment();
                                            game.getInputHandler().allowInteraction();
                                            this.#canInteract = true;
                                        }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                                    ]);
                            game.getSequenceExecutor().setSequence(sequence);
            }
            else if(this.#pranks === 0 && this.#canInteract)
            {
                let sequence = new Sequence([
                        new SequenceItem(new CodeSequenceItem(() => {
                            game.getPlayer().freezeMovment();
                            game.getInputHandler().preventInteraction();
                        }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                        new SequenceItem(new NPCTextAnimation(ruben.bigsprite, "Lyssnade du inte? Dra i spaken längst upp till vänster och längs ner till höger...", 2000, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),

                        new SequenceItem(new CodeSequenceItem(() => {
                            game.getPlayer().unfreezeMovment();
                            game.getInputHandler().allowInteraction();
                        }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                    ]);
            game.getSequenceExecutor().setSequence(sequence);
            }
            else if(this.#pranks === 1 && !this.#canInteract)
            {
                let sequence = new Sequence([
                        new SequenceItem(new CodeSequenceItem(() => {
                            game.getPlayer().freezeMovment();
                            game.getInputHandler().preventInteraction();
                        }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                        new SequenceItem(new NPCTextAnimation(ruben.bigsprite, "Ojsan... Jag råkade säga fel....", 1250, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                        new SequenceItem(new NPCTextAnimation(ruben.bigsprite, "Vad jag menade att säga var att dra i spaken längst upp till höger, sedan spaken längs ner till vänster", 3250, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                        new SequenceItem(new NPCTextAnimation(ruben.bigsprite, "Glöm inte att återställa spakarna du drog i tidigare...", 1500, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),

                        new SequenceItem(new CodeSequenceItem(() => {
                            game.getPlayer().unfreezeMovment();
                            game.getInputHandler().allowInteraction();
                            this.#canInteract = true;
                        }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                    ]);
            game.getSequenceExecutor().setSequence(sequence);
            }
            else if(this.#pranks === 1 && this.#canInteract)
            {
                let sequence = new Sequence([
                        new SequenceItem(new CodeSequenceItem(() => {
                            game.getPlayer().freezeMovment();
                            game.getInputHandler().preventInteraction();
                        }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                        new SequenceItem(new NPCTextAnimation(ruben.bigsprite, "...........", 1250, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                        new SequenceItem(new NPCTextAnimation(ruben.bigsprite, "Spaken längst upp till höger och längst ner till vänster...", 1750, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                        new SequenceItem(new NPCTextAnimation(ruben.bigsprite, "Glöm inte att återställa tidigare spakar till ursprungspositionen...", 2000, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),

                        new SequenceItem(new CodeSequenceItem(() => {
                            game.getPlayer().unfreezeMovment();
                            game.getInputHandler().allowInteraction();
                        }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                    ]);
            game.getSequenceExecutor().setSequence(sequence);
            }
            else if(this.#pranks === 2 && !this.#canInteract)
            {
                                let sequence = new Sequence([
                        new SequenceItem(new CodeSequenceItem(() => {
                            game.getPlayer().freezeMovment();
                            game.getInputHandler().preventInteraction();
                        }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                        new SequenceItem(new NPCTextAnimation(ruben.bigsprite, "Det verkade inte funka heller....", 1500, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                        new SequenceItem(new NPCTextAnimation(ruben.bigsprite, "...", 4000, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                        new SequenceItem(new NPCTextAnimation(ruben.bigsprite, "Hahahaha, get pranked...", 2000, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                        new SequenceItem(new NPCTextAnimation(ruben.bigsprite, "De där spakarna är inte inkopplade...", 2000, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                        new SequenceItem(new NPCTextAnimation(ruben.bigsprite, "Låt mig öppna dörren åt dig...", 2000, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                        new SequenceItem(new NPCTextAnimation(ruben.bigsprite, "Glöm inte att du inte, under några omständigheter får gå ned för trappan ;)", 2000, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                        new SequenceItem(new NPCTextAnimation(ruben.bigsprite, "Hejdå!", 500, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),

                        new SequenceItem(new CodeSequenceItem(() => {
                            game.getPlayer().unfreezeMovment();
                            game.getInputHandler().allowInteraction();
                            this.#canInteract = true;

                            game.getCamera().cameraShake(500, 2, game);
                            currentScene.getTile(new TileCoordinate(-1, -7))?.setCollisonRule(CollisionRule.None);
                            currentScene.getTile(new TileCoordinate(-1, -7))?.getSprites().pop();
                            currentScene.getTile(new TileCoordinate(-1, -7))?.getSprites().push(new Sprite("assets/sodexo.png", 5, 2, 0));
                            
                            currentScene.getTile(new TileCoordinate(-1, -6))?.setCollisonRule(CollisionRule.None);
                            currentScene.getTile(new TileCoordinate(-1, -6))?.getSprites().pop();
                            currentScene.getTile(new TileCoordinate(-1, -6))?.getSprites().push(new Sprite("assets/sodexo.png", 5, 3, 0));
                        
                            currentScene.getTile(new TileCoordinate(0, -7))?.setCollisonRule(CollisionRule.None);
                            currentScene.getTile(new TileCoordinate(0, -7))?.getSprites().pop();
                            currentScene.getTile(new TileCoordinate(0, -7))?.getSprites().push(new Sprite("assets/sodexo.png", 6, 2, 0));
                            
                            currentScene.getTile(new TileCoordinate(0, -6))?.setCollisonRule(CollisionRule.None);
                            currentScene.getTile(new TileCoordinate(0, -6))?.getSprites().pop();
                            currentScene.getTile(new TileCoordinate(0, -6))?.getSprites().push(new Sprite("assets/sodexo.png", 6, 3, 0));

                            const scriptedObjects = currentScene.getScriptedObjects();
                for (let index = scriptedObjects.length - 1; index >= 0; index--) {
                    const obj = scriptedObjects[index];
                    if (obj.pos.equals(new Pos(-1, -6).multiply(16)) || obj.pos.equals(new Pos(0, -6).multiply(16))) {
                        currentScene.removeScriptedObjectAtIndex(index);
                    }
                }

                            currentScene.addManyScriptedObjects(
                                new ScriptedObject(new Pos(-1, -6).multiply(16), ObjectBehaviour.ChangeScene, "assets/intro.json", new Sprite("assets/dungeon.png", 0, 0, 0)),
                                new ScriptedObject(new Pos(0, -6).multiply(16), ObjectBehaviour.ChangeScene, "assets/intro.json", new Sprite("assets/dungeon.png", 0, 0, 0)),
                            )

                            game.getGameState().hasTalkedToRuben = true;

                        }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                    ]);
            game.getSequenceExecutor().setSequence(sequence);

            }
            else if(this.#pranks === 3 || (this.#pranks === 2 && this.#canInteract))
            {
                        let sequence = new Sequence([
                        new SequenceItem(new CodeSequenceItem(() => {
                            game.getPlayer().freezeMovment();
                            game.getInputHandler().preventInteraction();
                        }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                        new SequenceItem(new NPCTextAnimation(ruben.bigsprite, "Adjö... Spela klart spelet nu...", 1500, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),

                        new SequenceItem(new CodeSequenceItem(() => {
                            game.getPlayer().unfreezeMovment();
                            game.getInputHandler().allowInteraction();
                        }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                    ]);
            game.getSequenceExecutor().setSequence(sequence);

            }
        });

        currentScene.registerBehaviour("btn", (game: Game, currentScene: Scene, pos: Pos, data: string) => {
            let ans = "";
            this.#buttons.forEach(button => {
                if(isButtonPressed(currentScene, button.pos.divide(16).floor().toTileCoordinate())) {
                    ans += "1"
                } else {
                    ans += "0"
                }
            })
            console.log(ans);
            if(this.#canInteract)
            {
                if(this.#pranks === 0 && ans === "0110") {
                    game.getCamera().cameraShake(500, 2, game);
                    this.#pranks++;
                    this.#canInteract = false;
                }
                else if(this.#pranks === 1 && ans === "1001") {
                    game.getCamera().cameraShake(500, 2, game);
                    this.#pranks++;
                    this.#canInteract = false;
                }
            } 
        });

        currentScene.addManyScriptedObjects(...this.#buttons)
        game.getAudioManager().playBackgroundMusic(game.getAssetLoader().getAudioAsset("assets/drippin_cave.wav")!);
    };

    onExit(game: Game, currentScene: Scene) {
        game.getAudioManager().pauseBackgroundMusic();
    };


    render(game: Game, currentScene: Scene) {
        
    };

    onInteraction(game: Game, currentScene: Scene, pos: Pos, data: string) {
        
    }
}