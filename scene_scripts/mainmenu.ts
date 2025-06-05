import { Game, Mode, Pos } from "../game.js";
import Keys, { setKey } from "../keys.js";
import { deserilizeScene, ObjectBehaviour, Scene, SceneScript, ScriptedObject, TileCoordinate } from "../scene.js";
import { Sprite } from "../sprite.js";

interface MenuButton {
    text: string | (() => string); // Allow text to be a function for dynamic text
    action?: () => void | Promise<void>; // Make action optional
    clickable?: boolean; // Add explicit clickable flag
}

interface Menu {
    title?: string;
    titleSize?: string;
    buttons: MenuButton[];
}

export default class Script implements SceneScript {
    name: string = "mainmenu.js";
    private buttons: any[] = [];
    private currentMenu: string = "main";
    private buttonWidth: number = 200;
    private buttonHeight: number = 40;
    private padding: number = 20;
    private selectedKey:  undefined | string = undefined;
    
    private menus: Record<string, Menu> = {
        main: {
            title: "Underschool",
            titleSize: "40px underschool",
            buttons: [
                {
                    text: "Starta Spel",
                    action: async () => {
                        let prev = this.game!.getScene();
                        let introScene = await deserilizeScene(this.game!.getAssetLoader().getTextAsset("assets/intro.json")!.data!);
                        this.game!.setScene(introScene);
                        this.game!.getPlayer().setShouldRender(true);
                        introScene.onLoad(this.game!, prev);
                    },
                    clickable: true
                },
                {
                    text: "Credits",
                    action: () => this.switchToMenu("credits"),
                    clickable: true
                },
                {
                    text: "Kontroller",
                    action: () => this.switchToMenu("controls"),
                    clickable: true
                },
            ]
        },
        credits: {
            title: "Underschool",
            buttons: [
                {
                    text: "Skapat av",
                    clickable: false // Not clickable
                },
                {
                    text: "Ruben Steen and Erik Forsum från TE22A",
                    clickable: false // Not clickable
                },
                {
                    text: () => "Tillbaka",
                    action: () => this.switchToMenu("main"),
                    clickable: true
                }
            ]
        },
        controls: {
            title: "Kontroller",
            // Buttons so user can set controls by clicking
            buttons: [
                {
                    text: () => "Gå uppåt: " + Keys.MoveUp.replace("Key", ""),
                    clickable: true,
                    action: () => {
                        this.selectedKey = "MoveUp";
                        // Listen for key press to change control (not via prompt)
                        
                    }
                },
                {
                    text: () => "Gå nedåt: " + Keys.MoveDown.replace("Key", ""),
                    clickable: true,
                    action: () => {
                        this.selectedKey = "MoveDown";
                    }
                },
                {
                    text: () => "Gå vänster: " + Keys.MoveLeft.replace("Key", ""),
                    clickable: true,
                    action: () => {
                        this.selectedKey = "MoveLeft";
                    }
                },
                {
                    text: () => "Gå höger: " + Keys.MoveRight.replace("Key", ""),
                    clickable: true,
                    action: () => {
                        this.selectedKey = "MoveRight";
                    }
                },
                {
                    text: () => "Interagera: " + Keys.Interact.replace("Key", ""),
                    clickable: true,
                    action: () => {
                        this.selectedKey = "Interact";
                    }
                },
                {
                    text: () => "Skippa text: " + Keys.SkipText.replace("Key", ""),
                    clickable: true,
                    action: () => {
                        this.selectedKey = "SkipText";
                    }
                },
                {
                    text: ""
                },
                {
                    text: "Tillbaka",
                    action: () => this.switchToMenu("main"),
                    clickable: true
                }
            ]
        }
    };

    private game?: Game;

    onEnter(prevScene: Scene, game: Game, currentScene: Scene) {   
        this.game = game;
        game.getPlayer().setShouldRender(false);
        this.currentMenu = "main";
        document.addEventListener("keydown", (event) => {
            if (this.selectedKey) {
                setKey(this.selectedKey as keyof typeof Keys, event.code);
                this.selectedKey = undefined; // Reset after setting
            } 
        });
    }

    onExit(game: Game, currentScene: Scene) {
        this.game = undefined;
    }

    private switchToMenu(menuName: string) {
        this.currentMenu = menuName;
        this.buttons = [];
    }

    private renderMenu(menu: Menu, ctx: CanvasRenderingContext2D, centerX: number, centerY: number) {
        let yOffset = centerY - 100;

        // Render title if it exists
        if (menu.title) {
            ctx.font = menu.titleSize || "20px underschool";
            ctx.fillText(menu.title, centerX, yOffset);
            yOffset += 80;
        }

        // Reset font for buttons
        ctx.font = "20px underschool";

        // Render buttons
        menu.buttons.forEach((button, index) => {
            const y = yOffset + (index * (this.buttonHeight + this.padding));
            
            // Check if button should be clickable
            const isClickable = button.clickable !== false && button.action;
            
            // check if button.text is a function

            const buttonText = typeof button.text === 'function' ? button.text() : button.text;
            
            // Only draw button background and add to clickable buttons if it's clickable
            if (isClickable) {
                ctx.strokeStyle = "#FFFFFF";
                ctx.strokeRect(
                    centerX - this.buttonWidth/2,
                    y - this.buttonHeight/2,
                    this.buttonWidth,
                    this.buttonHeight
                );
                
                const buttonData = {
                    x: centerX - this.buttonWidth/2,
                    y: y - this.buttonHeight/2,
                    width: this.buttonWidth,
                    height: this.buttonHeight,
                    text: buttonText,
                    action: button.action
                };
                
                this.buttons.push(buttonData);
            }
            
            // Button text
            ctx.fillText(buttonText, centerX, y);
        });

        // render big box to tell user to click to change controls with alot of padding
        if (this.selectedKey) {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(centerX - 250, centerY + 100, 500, 100);
            ctx.fillStyle = "#000000";
            ctx.textAlign = "center";
            ctx.fillText(`Click a key to set ${this.selectedKey}`, centerX, centerY + 150);
        }
    }

    render(game: Game, currentScene: Scene) {
        
        // Handle button clicks
        const mousePos = game.getInputHandler().getMousePos();
        const isMouseClicked = game.getInputHandler().isMouseClicked();
        
        this.buttons.forEach(button => {
            
            if(isMouseClicked && 
               mousePos.x > button.x && 
               mousePos.x < button.x + button.width && 
               mousePos.y > button.y && 
               mousePos.y < button.y + button.height) {
                button.action();
            }
        });

        // Clear buttons for this frame
        this.buttons = [];

        const ctx = game.getScreen().ctx;
        const centerX = game.getScreen().width / 2;
        const centerY = game.getScreen().height / 2;

        // Black background
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, game.getScreen().width, game.getScreen().height);
        
        // Set text styling
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        // Render current menu
        const currentMenuData = this.menus[this.currentMenu];
        if (currentMenuData) {
            this.renderMenu(currentMenuData, ctx, centerX, centerY);
        }
    }

    onInteraction(game: Game, currentScene: Scene, pos: Pos, data: string) {
        
    }

    // Helper method to add new menus dynamically
    addMenu(name: string, menu: Menu) {
        this.menus[name] = menu;
    }

    // Helper method to get current menu
    getCurrentMenu(): string {
        return this.currentMenu;
    }
}