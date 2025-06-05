import { Game, Pos } from "../game.js";
import Keys, { Action } from "../keys.js";
import { changeScene, Scene, SceneScript } from "../scene.js";

export default class Script implements SceneScript {
    name: string = "cred.js";
    padding: number = 30;

    async onEnter(prevScene: Scene, game: Game, currentScene: Scene) {
        // No special setup needed for credits
    }

    onExit(game: Game, currentScene: Scene) {
        // No cleanup needed
    }

    render(game: Game, currentScene: Scene) {
        game.getPlayer().setShouldRender(false);
        const ctx = game.getScreen().ctx;
        const centerX = game.getScreen().width / 2;
        const centerY = game.getScreen().height / 2;

        // Set text properties
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "40px underschool";
        ctx.textAlign = "center";

        // Draw title
        ctx.fillText("UNDERSCHOOL", centerX, centerY - this.padding * 3);

        // Draw victory text
        ctx.font = "30px underschool";
        ctx.fillText("Du räddade skolan från", centerX, centerY - this.padding);
        ctx.fillText("Jens den hungrige!", centerX, centerY);

        // Draw credits text
        ctx.fillText("Skapat av", centerX, centerY + this.padding * 2);
        ctx.fillText("Ruben och Erik", centerX, centerY + this.padding * 3);
        ctx.fillText("från TE22A", centerX, centerY + this.padding * 4);

        // Draw return text
        ctx.font = "20px underschool";
        ctx.fillText("Tryck på K för att gå tillbaka till startmenyn", centerX, centerY + this.padding * 6);

        // Handle return to main menu
        if (game.getInputHandler().isKeyDown(Action.Interact)) {
            window.location.reload();
        }
    }
    onInteraction(game: Game, currentScene: Scene, pos: Pos, data: string) {
    }
}