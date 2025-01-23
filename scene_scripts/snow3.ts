const kim = {
    bigsprite: new BigSprite (
        new Sprite("assets/faces.png", 0, 0, 0),
        new Sprite("assets/faces.png", 1, 0, 0),
        new Sprite("assets/faces.png", 0, 1, 0),
        new Sprite("assets/faces.png", 1, 1, 0),
    )
}


import { BigSprite, NPCTextAnimation } from "../animate.js";
import { Game, Particle, Snow, Pos } from "../game.js";
import { Player } from "../player.js";
import { CollisionRule, ObjectBehaviour, Scene, SceneScript, ScriptedObject, TileCoordinate } from "../scene.js";
import { Camera } from "../screen.js";
import { CodeSequenceItem, Sequence, SequenceItem } from "../sequence.js";
import { Sprite } from "../sprite.js";

export default class Script implements SceneScript {
    name: string = "snow3.js";
    showKim: boolean = true;

    onEnter(prevScene: Scene, game: Game, currentScene: Scene){
        if(this.showKim){
            currentScene.addManyScriptedObjects(
                //man ska kunna prata med kim på berget nere, samma pos som i snow2 fast nu npc med dialog
                new ScriptedObject(new Pos(35, -12).multiply(16), ObjectBehaviour.Interactable, "kim", new Sprite("assets/people.png", 4, 0, 0)),
                new ScriptedObject(new Pos(35, -11).multiply(16), ObjectBehaviour.Interactable, "kim", new Sprite("assets/people.png", 4, 1, 0)),
                new ScriptedObject(new Pos(33, -31).multiply(16), ObjectBehaviour.ChangeScene, "assets/snow2.json", new Sprite("assets/dungeon.png", 0, 0, 0)),
                new ScriptedObject(new Pos(34, -31).multiply(16), ObjectBehaviour.ChangeScene, "assets/snow2.json", new Sprite("assets/dungeon.png", 0, 0, 0)),
                new ScriptedObject(new Pos(59, -86).multiply(16), ObjectBehaviour.Sign, "Julpynt", new Sprite("assets/saker.png", 7, 0, 0)),
                new ScriptedObject(new Pos(60, -86).multiply(16), ObjectBehaviour.Sign, "Nyckeln till dörren som du vill nå, genom julefrid, du kan få...", new Sprite("assets/dungeon.png", 0, 0, 0)),
                new ScriptedObject(new Pos(61, -86).multiply(16), ObjectBehaviour.Sign, "Nyckeln till dörren som du vill nå, genom julefrid, du kan få...", new Sprite("assets/dungeon.png", 0, 0, 0)),
                new ScriptedObject(new Pos(58, -86).multiply(16), ObjectBehaviour.Sign, "Du är inte sugen på att pynta just nu...", new Sprite("assets/snowset.png", 6, 5, 0)),
                new ScriptedObject(new Pos(25, -86).multiply(16), ObjectBehaviour.Interactable, "tree", new Sprite("assets/snowset.png", 7, 5, 0)),
                new ScriptedObject(new Pos(25, -87).multiply(16), ObjectBehaviour.Interactable, "tree", new Sprite("assets/snowset.png", 7, 4, 0)),
            );

            currentScene.registerBehaviour("kim", (game: Game, currentScene: Scene, pos: Pos, data: string) => {
                            let sequence = new Sequence([
                                new SequenceItem(new CodeSequenceItem(() => {
                                    game.getPlayer().freezeMovment();
                                    game.getInputHandler().preventInteraction();
                                }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                                new SequenceItem(new NPCTextAnimation(kim.bigsprite, "FONClBrISCH, FONClBrISCH, på dig!", 2500, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                                new SequenceItem(new NPCTextAnimation(kim.bigsprite, "Jag heter Kim, jag var kemilärare på Åva innan de gjorde sig av med mig........ Nu håller jag hus här...", 5000, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                                new SequenceItem(new NPCTextAnimation(kim.bigsprite, "Du ser inte ut som om du hör hemma här.... Under skolan alltså....", 5000, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                                new SequenceItem(new NPCTextAnimation(kim.bigsprite, "Jag nej, jag är ett med naturen nu mera...", 2500, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                                new SequenceItem(new NPCTextAnimation(kim.bigsprite, "Vet du vad, du som kommit så långt på väg till att bli den du vill... Gå tillbaka norr ut, så ska jag hjälpa dig på traven....", 5000, game.getInputHandler()), (item, ctx) => { (item as NPCTextAnimation).render(ctx, game); }),
                                new SequenceItem(new CodeSequenceItem(() => {
                                    game.getPlayer().unfreezeMovment();
                                    game.getInputHandler().allowInteraction();
                                    //sätt stegar
                                    currentScene.getTile(new TileCoordinate(41, -31))?.setCollisonRule(CollisionRule.None);
                                    for(let i = 0; i < 37; i++){
                                        currentScene.getTile(new TileCoordinate(41, - 32 - i))?.getSprites().pop();
                                        currentScene.getTile(new TileCoordinate(41, - 32 - i))?.getSprites().push(new Sprite("assets/snowset.png", 0, 3, 0));      
                                        currentScene.getTile(new TileCoordinate(41, - 32 - i))?.getSprites().push(new Sprite("assets/snowset.png", 6, 4, 1));
                                  
                                    }
                                    game.getCamera().cameraShake(500, 2, game);
                                }), (item, ctx) => { (item as CodeSequenceItem).run(); }),
                            ]);
            
                            game.getSequenceExecutor().setSequence(sequence);
                        });
        }

        currentScene.registerBehaviour("tree", (game: Game, currentScene: Scene, pos: Pos, data: string) => {
            currentScene.getTile(new TileCoordinate(60, -87))?.setCollisonRule(CollisionRule.None);
            currentScene.getTile(new TileCoordinate(60, - 87))?.getSprites().pop();
            currentScene.getTile(new TileCoordinate(60, - 87))?.getSprites().push(new Sprite("assets/sodexo.png", 5, 2, 0));     
            currentScene.getTile(new TileCoordinate(60, -86))?.setCollisonRule(CollisionRule.None);
            currentScene.getTile(new TileCoordinate(60, - 86))?.getSprites().pop();
            currentScene.getTile(new TileCoordinate(60, - 86))?.getSprites().push(new Sprite("assets/sodexo.png", 5, 3, 0)); 
            currentScene.getTile(new TileCoordinate(61, -87))?.setCollisonRule(CollisionRule.None);
            currentScene.getTile(new TileCoordinate(61, - 87))?.getSprites().pop();
            currentScene.getTile(new TileCoordinate(61, - 87))?.getSprites().push(new Sprite("assets/sodexo.png", 6, 2, 0));     
            currentScene.getTile(new TileCoordinate(61, -86))?.setCollisonRule(CollisionRule.None);
            currentScene.getTile(new TileCoordinate(61, - 86))?.getSprites().pop();
            currentScene.getTile(new TileCoordinate(61, - 86))?.getSprites().push(new Sprite("assets/sodexo.png", 6, 3, 0));        
            currentScene.addManyScriptedObjects(
                new ScriptedObject(new Pos(60, -86).multiply(16), ObjectBehaviour.ChangeScene, "assets/sodexo.json", new Sprite("assets/dungeon.png", 0, 0, 0)),
                new ScriptedObject(new Pos(60, -86).multiply(16), ObjectBehaviour.ChangeScene, "assets/sodexo.json", new Sprite("assets/dungeon.png", 0, 0, 0)),

            );
            game.getCamera().cameraShake(500, 2, game);
        });

        game.getPlayer().setPos(new Pos(34, -30).multiply(16));
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