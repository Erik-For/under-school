import { Game, Mode, Pos } from "../game.js";
import { deserilizeScene, ObjectBehaviour, Scene, SceneScript, ScriptedObject, TileCoordinate } from "../scene.js";
import { Sprite } from "../sprite.js";

export default class Script implements SceneScript {
    name: string = "mainmenu.js";
    private buttons: any[] = [];
    private currentMenu: string = "main";
    private buttonWidth: number = 200;
    private buttonHeight: number = 40;
    private padding: number = 20;

    onEnter(prevScene: Scene, game: Game, currentScene: Scene) {        
        // Reset buttons array
        this.buttons = [];
    }

    onExit(game: Game, currentScene: Scene) {
        // Clean up if needed
    }

    render(game: Game, currentScene: Scene) {
        this.buttons.forEach(button => {
            if(game.getInputHandler().isMouseClicked() && game.getInputHandler().getMousePos().x > button.x && game.getInputHandler().getMousePos().x < button.x + button.width && game.getInputHandler().getMousePos().y > button.y && game.getInputHandler().getMousePos().y < button.y + button.height){                
                button.action();
            }
        });

        const ctx = game.getScreen().ctx;
        const centerX = game.getScreen().width / 2;
        const centerY = game.getScreen().height / 2;

        // Black background
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, game.getScreen().width, game.getScreen().height);
        
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "20px underschool";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        if (this.currentMenu === "main") {
            // Title
            ctx.font = "40px underschool";
            ctx.fillText("Underschool", centerX, centerY - 100);
            
            // Buttons
            ctx.font = "20px underschool";
            const menuButtons = ["Start Game", "Credits"];
            menuButtons.forEach((text, index) => {
                const y = centerY + (index * (this.buttonHeight + this.padding));
                
                // Button background
                ctx.strokeStyle = "#FFFFFF";
                ctx.strokeRect(
                    centerX - this.buttonWidth/2,
                    y - this.buttonHeight/2,
                    this.buttonWidth,
                    this.buttonHeight
                );
                
                // Button text
                ctx.fillText(text, centerX, y);
                
                this.buttons.push({
                    x: centerX - this.buttonWidth/2,
                    y: y - this.buttonHeight/2,
                    width: this.buttonWidth,
                    height: this.buttonHeight,
                    text: text,
                    action: async () => {
                        if (text === "Start Game") {
                            let prev = game.getScene();
                            let introScene = await deserilizeScene(game.getAssetLoader().getTextAsset("assets/intro.json")!.data!);
                            game.setScene(introScene);
                            introScene.onLoad(game, prev);
                        } else if (text === "Credits") {
                            this.currentMenu = "credits";
                            this.buttons = [];
                        }
                    }
                });
            });
        } else if (this.currentMenu === "credits") {
            ctx.fillText("Credits", centerX, centerY);
            ctx.fillText("Ruben and Erik", centerX, centerY + 50);
            
            // Back button
            const y = centerY + 2*(this.buttonHeight + this.padding);
            ctx.strokeStyle = "#FFFFFF";
            ctx.strokeRect(
                centerX - this.buttonWidth/2,
                y - this.buttonHeight/2,
                this.buttonWidth,
                this.buttonHeight
            );
            
            ctx.fillText("back", centerX, y);
            this.buttons.push({
                x: centerX - this.buttonWidth/2,
                y: y - this.buttonHeight/2,
                width: this.buttonWidth,
                height: this.buttonHeight,
                text: "back",
                action: () => {
                    this.currentMenu = "main";
                    this.buttons = [];
                }
            });
        }
    }
} 