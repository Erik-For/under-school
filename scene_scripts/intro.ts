import { BigSprite, NPCTextAnimation } from "../animate.js";
import { Game, Particle, Pos } from "../game.js";
import { fadeIn, fadeOut, ObjectBehaviour, Scene, SceneScript, ScriptedObject, TileCoordinate } from "../scene.js";
import { CodeSequenceItem, Sequence, SequenceItem } from "../sequence.js";
import { Sprite } from "../sprite.js";

export default class Script implements SceneScript {
    name: string = "intro.js";
    onEnter(prevScene: Scene, game: Game, currentScene: Scene){
        currentScene.addScriptedObject(new ScriptedObject(new Pos(-2, -7).multiply(16), ObjectBehaviour.Sign, "GOLI WAS HERE!!!!!!!!!!!!!!", new Sprite("assets/saker.png", 6, 0, 0)));
        currentScene.addScriptedObject(new ScriptedObject(new Pos(27, -3).multiply(16), ObjectBehaviour.ChangeScene, "assets/teknik.json", new Sprite("assets/teknik.png", 0, 0, 0)));
        currentScene.addScriptedObject(new ScriptedObject(new Pos(27, -4).multiply(16), ObjectBehaviour.ChangeScene, "assets/teknik.json", new Sprite("assets/teknik.png", 0, 0, 0)));
    
        fadeOut(game);

        let goli = {
            top: new Sprite("assets/people.png", 0, 0, 0),
            bottom: new Sprite("assets/people.png", 0, 1, 0),
            pos: new Pos(-1, 4)
        }


        new Sequence([
            
        ])
    };

    // 27, -3; 27, -4
    onExit (game: Game, currentScene: Scene) {

    };
    render(game: Game, currentScene: Scene) {
        
    };

    getStartTile(): Map<String, TileCoordinate> {
        return new Map([
            ["teknik.js", new TileCoordinate(26.5, -3)],
            ["default", new TileCoordinate(-1, 6.5)]
        ]);
    };
}