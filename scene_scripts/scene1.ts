import { Game } from "../game";
import { Scene, SceneScript } from "../scene";

export default class Script implements SceneScript {
    onEnter(prevScene: Scene, game: Game, currentScene: Scene){
        console.log("Scene 1 entered");
    };
    onExit (game: Game, currentScene: Scene) {

    };
    render(game: Game, currentScene: Scene) {
        
    };
}