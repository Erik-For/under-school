import { Game, Pos } from "../game.js";
import Keys from "../keys.js";
import { changeScene, Scene, SceneScript, deserilizeScene, fadeIn, fadeOut } from "../scene.js";
import { Star } from "../game.js";

export default class Script implements SceneScript {
    name: string = "stars.js";

    async onEnter(prevScene: Scene, game: Game, currentScene: Scene) {
        game.getParticleManager().particles = [];
        
        setTimeout(() => {
            (async () => {
                game.getPlayer().denyCollisions();
                game.getPlayer().freezeMovment();
                const fadeToBlack = fadeIn(game);
                let newScene = await deserilizeScene(game.getAssetLoader().getTextAsset("assets/snow2.json")!.data!);
                fadeToBlack.then(() => {
                    game.getPlayer().setShouldRender(true);
                    game.setScene(newScene);
                    newScene.onLoad(game, currentScene); 
                    const fade = fadeOut(game);
                    fade.then(() => {
                        game.getPlayer().allowCollisions();
                        game.getPlayer().unfreezeMovment();
                    });
                });
            })();
        }, 5000);
    }

    onExit(game: Game, currentScene: Scene) {
        // No cleanup needed
    }

    render(game: Game, currentScene: Scene) {
        game.getPlayer().setShouldRender(false);
        //h7undra kanske är lite mycket lol, skoldatorn kanske dör :p
        for (let i = 0; i < 100; i++) {
            const randomX = Math.floor(Math.random() * 3);
            const randomY = Math.floor(Math.random() * 3);
            const star = new Star(new Pos(Math.random() * game.getScreen().width, Math.random() * game.getScreen().height), 1000000, game.getAssetLoader().getSpriteSheet("assets/snowset.png")!.getSprite(5+randomX, 1+randomY));
            game.getParticleManager().addParticle(star);
        }
    }
    onInteraction(game: Game, currentScene: Scene, pos: Pos, data: string) {
    }
}