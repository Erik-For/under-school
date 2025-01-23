import { BigSprite, NPCTextAnimation } from "../animate.js";
import { Game, Particle, Pos } from "../game.js";
import { CollisionRule, isButtonPressed, ObjectBehaviour, Scene, SceneScript, ScriptedObject, TileCoordinate } from "../scene.js";
import { CodeSequenceItem, Sequence, SequenceItem } from "../sequence.js";
import { Sprite } from "../sprite.js";

export default class Script implements SceneScript {
    name: string = "dungeon.js";
    #buttons: ScriptedObject[] = [
        new ScriptedObject(new Pos(21, -34).multiply(16), ObjectBehaviour.Button, "btn", new Sprite("assets/dungeon.png", 0, 1, 0)),
        new ScriptedObject(new Pos(25, -34).multiply(16), ObjectBehaviour.Button, "btn", new Sprite("assets/dungeon.png", 0, 1, 0)),
        new ScriptedObject(new Pos(29, -34).multiply(16), ObjectBehaviour.Button, "btn", new Sprite("assets/dungeon.png", 0, 1, 0)),
        new ScriptedObject(new Pos(33, -34).multiply(16), ObjectBehaviour.Button, "btn", new Sprite("assets/dungeon.png", 0, 1, 0)),
        new ScriptedObject(new Pos(37, -34).multiply(16), ObjectBehaviour.Button, "btn", new Sprite("assets/dungeon.png", 0, 1, 0)),
        new ScriptedObject(new Pos(21, -30).multiply(16), ObjectBehaviour.Button, "btn", new Sprite("assets/dungeon.png", 0, 1, 0)),
        new ScriptedObject(new Pos(25, -30).multiply(16), ObjectBehaviour.Button, "btn", new Sprite("assets/dungeon.png", 0, 1, 0)),
        new ScriptedObject(new Pos(29, -30).multiply(16), ObjectBehaviour.Button, "btn", new Sprite("assets/dungeon.png", 0, 1, 0)),
        new ScriptedObject(new Pos(33, -30).multiply(16), ObjectBehaviour.Button, "btn", new Sprite("assets/dungeon.png", 0, 1, 0)),
        new ScriptedObject(new Pos(37, -30).multiply(16), ObjectBehaviour.Button, "btn", new Sprite("assets/dungeon.png", 0, 1, 0)),
    ]
    
    onEnter(prevScene: Scene, game: Game, currentScene: Scene){
        switch(prevScene.getScriptName()){
            case "snow1.js":
                game.getPlayer().setPos(new Pos(40.5, -36).multiply(16)); // byt ut kordinaterna
                game.getPlayer().setDirection("down");
                break;
            case "intro.js":
                game.getPlayer().setPos(new Pos(-9, 0).multiply(16));
                game.getPlayer().setDirection("down");
                break;
            default:
                game.getPlayer().setPos(new Pos(40, -34).multiply(16));
                break;
            
        }

        game.getPlayer().unfreezeMovment();
        game.getInputHandler().allowInteraction();

        currentScene.addManyScriptedObjects(
            new ScriptedObject(new Pos(39, -2).multiply(16), ObjectBehaviour.Sign, "I labyrinten ska du gå, följ stenarna för att målet nå", new Sprite("assets/saker.png", 6, 0, 0)),
            new ScriptedObject(new Pos(-4, -5).multiply(16), ObjectBehaviour.Sign, "I grottan du är, vilket misär", new Sprite("assets/saker.png", 7, 0, 0)),
            new ScriptedObject(new Pos(-2, -5).multiply(16), ObjectBehaviour.Sign, "Dörren är låst, inga nycklar finns att se, med lite list, en uppenbarelse kan ske", new Sprite("assets/saker.png", 7, 0, 0)),
            new ScriptedObject(new Pos(29, -37).multiply(16), ObjectBehaviour.Sign, "V->H/U->N: NER NER UPP NER UPP UPP UPP NER NER UPP", new Sprite("assets/saker.png", 7, 0, 0)),
            new ScriptedObject(new Pos(40, -37).multiply(16), ObjectBehaviour.Sign, "Dörren är låst", new Sprite("assets/dungeon.png", 0, 0, 0)),
            new ScriptedObject(new Pos(41, -37).multiply(16), ObjectBehaviour.Sign, "Dörren är låst", new Sprite("assets/dungeon.png", 0, 0, 0)),
            //new ScriptedObject(new Pos(38, -2).multiply(16), ObjectBehaviour.Button
            //, "btn", new Sprite("assets/dungeon.png", 0, 1, 0)),
            
        )
        //currentScene.registerBehaviour("btn", (game: Game, currentScene: Scene, pos: Pos, data: String) => {
        //    alert("Du tryckte på knappen");
        //})

        currentScene.registerBehaviour("btn", (game: Game, currentScene: Scene, pos: Pos, data: String) => {
            let ans = ""
            
            this.#buttons.forEach(button => {
                if(isButtonPressed(currentScene, button.pos.divide(16).floor().toTileCoordinate())) {
                    ans += "1"
                } else {
                    ans += "0"
                }
            })

            if(ans === "0010111001") {
                game.getCamera().cameraShake(500, 2, game);
                currentScene.getScriptedObjects().forEach(obj => {
                    if(obj.pos.equals(new Pos(40, -37).multiply(16)) || obj.pos.equals(new Pos(41, -37).multiply(16))) {
                        currentScene.removeScriptedObject(obj);
                    }
                });
                currentScene.getTile(new TileCoordinate(40, -38))?.setCollisonRule(CollisionRule.None);
                currentScene.getTile(new TileCoordinate(40, -38))?.getSprites().pop();
                currentScene.getTile(new TileCoordinate(40, -38))?.getSprites().push(new Sprite("assets/dungeon.png", 4, 0, 0));
                
                currentScene.getTile(new TileCoordinate(41, -38))?.setCollisonRule(CollisionRule.None);
                currentScene.getTile(new TileCoordinate(41, -38))?.getSprites().pop();
                currentScene.getTile(new TileCoordinate(41, -38))?.getSprites().push(new Sprite("assets/dungeon.png", 4, 2, 0));
            
                currentScene.getTile(new TileCoordinate(40, -37))?.setCollisonRule(CollisionRule.None);
                currentScene.getTile(new TileCoordinate(40, -37))?.getSprites().pop();
                currentScene.getTile(new TileCoordinate(40, -37))?.getSprites().push(new Sprite("assets/dungeon.png", 4, 1, 0));
                
                currentScene.getTile(new TileCoordinate(41, -37))?.setCollisonRule(CollisionRule.None);
                currentScene.getTile(new TileCoordinate(41, -37))?.getSprites().pop();
                currentScene.getTile(new TileCoordinate(41, -37))?.getSprites().push(new Sprite("assets/dungeon.png", 4, 3, 0));

                currentScene.addManyScriptedObjects(
                    new ScriptedObject(new Pos(40, -37).multiply(16), ObjectBehaviour.ChangeScene, "assets/snow1.json", new Sprite("assets/dungeon.png", 0, 0, 0)),
                    new ScriptedObject(new Pos(41, -37).multiply(16), ObjectBehaviour.ChangeScene, "assets/snow1.json", new Sprite("assets/dungeon.png", 0, 0, 0)),
                )
            }
        })
        currentScene.addManyScriptedObjects(...this.#buttons)
        
    };

    onExit(game: Game, currentScene: Scene) {

    };


    render(game: Game, currentScene: Scene) {
        
    };
}