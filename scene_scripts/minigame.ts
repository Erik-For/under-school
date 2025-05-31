import { AssetLoader } from "../assetloader.js";
import { Game, Pos } from "../game.js";
import Keys from "../keys.js";
import { changeScene, Scene, SceneScript, deserilizeScene, fadeIn, fadeOut } from "../scene.js";

class car {
    x: number; // Position in virtual coordinates
    randomY: number; // Random offset for Y position
    lane: number; // 0 = top lane slow, 1 = top lane fast, 2 = bottom lane slow, 3 = bottom lane fast

    constructor(lane: number) {
        this.lane = lane;
        this.x = lane < 2 ? -150 : 2050;
        this.randomY = Math.random() * 60;
    }

    update(deltaTime: number, scale: number) {
        const speed = this.lane < 2 ? 
                      this.lane === 0 ? 200 + scale : 300 + scale : 
                      this.lane === 2 ? -200 - scale: -300 - scale;
        
        this.x += speed * deltaTime;
    }
}

export default class Script implements SceneScript {
    name: string = "minigame.js";
    
    readonly VIRTUAL_WIDTH: number = 1920;
    readonly VIRTUAL_HEIGHT: number =  1080;
    
    scaleX: number = 2;
    scaleY: number = 2;
    
    customScale = 108; // Based on virtual height / 10
    playerPos: Pos = new Pos(0, this.VIRTUAL_HEIGHT / 2 - this.customScale * 3);
    canMove: boolean = false;
    moveSpeed: number = 5;
    lastFrameTime: number = 0;
    roadOffset: number = 0;
    roadSpeed: number = 100;
    LapCount: number = 1;
    mDriven: number = 0;

    cars: car[] = [];
    carPool: car[] = [];
    maxCars: number = 12;
    spawnTimer: number = 0;
    spawnInterval: number = 1.2;

    virtualToScreenX(x: number): number {
        return x * this.scaleX;
    }
    
    virtualToScreenY(y: number): number {
        return y * this.scaleY;
    }
    
    screenToVirtualX(x: number): number {
        return x / this.scaleX;
    }
    
    screenToVirtualY(y: number): number {
        return y / this.scaleY;
    }

    async onEnter(prevScene: Scene, game: Game, currentScene: Scene) {
        fadeOut(game, 2500);
        game.getGameState().hasPlayedMinigame = true;
        game.getParticleManager().particles = [];
        game.getPlayer().setShouldRender(false);
        game.getPlayer().denyCollisions();
        game.getPlayer().freezeMovment();

        const screen = game.getScreen();
        this.scaleX = screen.width / this.VIRTUAL_WIDTH;
        this.scaleY = screen.height / this.VIRTUAL_HEIGHT;
        
        this.playerPos = new Pos(0, this.VIRTUAL_HEIGHT / 2 - this.customScale * 3);

        this.lastFrameTime = performance.now();
        game.getAssetLoader().getAudioAsset("assets/binaryburnout.mp3")!.load().then(() => {
            game.getAudioManager().playBackgroundMusic(game.getAssetLoader().getAudioAsset("assets/binaryburnout.mp3")!);
            setTimeout(() => {
                this.canMove = true;
            }, 2000);
        });

        this.carPool = [];
        for (let i = 0; i < this.maxCars; i++) {
            this.carPool.push(new car(Math.floor(Math.random() * 4)));
        }
        
        this.cars = this.carPool.splice(0, 4);
    }

    onExit(game: Game, currentScene: Scene) {
    }

    //all minigame logik ligger i render... (lol?) kanske inte är det bästa - Rubor 29 maj 2025 23:40
    render(game: Game, currentScene: Scene) {
        if(game.getInputHandler().isKeyDown("Escape") || game.getInputHandler().isKeyDown(Keys.SkipText)) {
            this.exit(game, currentScene);
            return;
        }

        let screen = game.getScreen();
        
        this.scaleX = screen.width / this.VIRTUAL_WIDTH;
        this.scaleY = screen.height / this.VIRTUAL_HEIGHT;
        
        let ctx = screen.ctx;
        
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastFrameTime) / 1000;
        this.lastFrameTime = currentTime;
        
        const cappedDeltaTime = Math.min(deltaTime, 0.1);
        
        this.roadOffset = (this.roadOffset + this.roadSpeed * cappedDeltaTime) % (this.customScale * 2);
        
        const baseSpeed = this.moveSpeed * 60;
        
        this.drawMap(game, ctx);
        const screenX = this.virtualToScreenX(this.playerPos.x);
        const screenY = this.virtualToScreenY(this.playerPos.y);
        const scaledSize = this.customScale * this.scaleY;
        
        for (const car of this.cars) {
            car.update(cappedDeltaTime, this.roadSpeed / 10);
            
            let virtualY: number;
            switch(car.lane) {
                case 0: // Top lane slow
                    virtualY = this.VIRTUAL_HEIGHT / 8 - 50 + car.randomY;
                    break;
                case 1: // Top lane fast  
                    virtualY = this.VIRTUAL_HEIGHT / 4 + 50 + car.randomY;
                    break;
                case 2: // Bottom lane slow
                    virtualY = this.VIRTUAL_HEIGHT * 5/8 - 50 + car.randomY;
                    break;
                case 3: // Bottom lane fast
                    virtualY = this.VIRTUAL_HEIGHT * 3/4 + 50 + car.randomY;
                    break;
                default:
                    virtualY = this.VIRTUAL_HEIGHT / 2;
            }
            
            const carScreenX = this.virtualToScreenX(car.x);
            const carScreenY = this.virtualToScreenY(virtualY);
            
            ctx.drawImage(
                game.getAssetLoader().getSpriteSheet("assets/cars.png")!.getSprite(car.lane < 2 ? 1 : 2, 0),
                carScreenX,
                carScreenY,
                scaledSize,
                scaledSize
            );
        }

        this.spawnTimer += cappedDeltaTime;
        if (this.spawnTimer >= this.spawnInterval && this.cars.length < this.maxCars) {
            this.spawnTimer = 0;
            this.spawnInterval = 0.8 + Math.random() * 1.2;
            if (this.carPool.length > 0) {
                const newCar = this.carPool.pop()!;
                newCar.lane = Math.floor(Math.random() * 4);
                newCar.x = newCar.lane < 2 ? -150 : 2050;
                newCar.randomY = Math.random() * 60;
                this.cars.push(newCar);
            }
        }

        for (let i = this.cars.length - 1; i >= 0; i--) {
            const car = this.cars[i];
            
            if ((car.lane < 2 && car.x > this.VIRTUAL_WIDTH + 200) || 
                (car.lane >= 2 && car.x < -200)) {
                
                this.cars.splice(i, 1);
                this.carPool.push(car);
            }
        }
        
        ctx.save();
        ctx.translate(screenX, screenY);
        ctx.rotate(0);
        ctx.drawImage(game.getAssetLoader().getSpriteSheet("assets/cars.png")!.getSprite(0, 0), 0, 0, scaledSize, scaledSize);
        ctx.restore();

        const fontSizeLarge = Math.round(60 * this.scaleY);
        const fontSizeSmall = Math.round(20 * this.scaleY);
        
        ctx.fillStyle = "white";
        ctx.font = `${fontSizeLarge}px underschool`;
        ctx.fillText(`LAP ${this.LapCount}`, 10 * this.scaleX, 100 * this.scaleY);
        ctx.fillText(`KMH ${Math.round(this.roadSpeed/10)}`, 10 * this.scaleX, 150 * this.scaleY);

        this.drawScanlines(ctx, screen.width, screen.height);
        ctx.font = `${fontSizeSmall}px underschool`;
        ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        ctx.fillText("uunnvhvhba", 10 * this.scaleX, screen.height - 80 * this.scaleY);
        
        this.roadSpeed = Math.min(this.roadSpeed + 1, 2250);
        
        if(this.canMove) {
            let dx = 0;
            let dy = 0;

            if(game.getInputHandler().isKeyDown(Keys.MoveDown)) {
                dy += 1;
            }

            if(game.getInputHandler().isKeyDown(Keys.MoveUp)) {
                dy -= 1;
            }

            if(game.getInputHandler().isKeyDown(Keys.MoveLeft)) {
                dx -= 1;
            }

            if(game.getInputHandler().isKeyDown(Keys.MoveRight)) {
                dx += 1;
            }

            if (dx !== 0 && dy !== 0) {
                let length = Math.sqrt(dx * dx + dy * dy);
                dx = dx / length;
                dy = dy / length;
            }

            this.playerPos.x += dx * baseSpeed * cappedDeltaTime;
            this.playerPos.y += dy * baseSpeed * cappedDeltaTime;
        }

        this.mDriven += this.roadSpeed * cappedDeltaTime / 1000 * 60;
        this.LapCount = Math.floor(this.mDriven / 2000) + 1;
        
        if (this.playerPos.x < 0) {
            this.playerPos.x = 0;
        }
        if (this.playerPos.x + this.customScale > this.VIRTUAL_WIDTH) {
            this.playerPos.x = this.VIRTUAL_WIDTH - this.customScale;
        }
        if (this.playerPos.y < 0) {
            this.playerPos.y = 0;
        }
        if (this.playerPos.y + this.customScale > this.VIRTUAL_HEIGHT) {
            this.playerPos.y = this.VIRTUAL_HEIGHT - this.customScale;
        }
    }

    onInteraction(game: Game, currentScene: Scene, pos: Pos, data: string) {
    }

    exit(game: Game, currentScene: Scene) {
        (async () => {
                game.getPlayer().denyCollisions();
                game.getPlayer().freezeMovment();
                const fadeToBlack = fadeIn(game);
                let newScene = await deserilizeScene(game.getAssetLoader().getTextAsset("assets/teknik.json")!.data!);
                fadeToBlack.then(() => {
                    game.getParticleManager().particles = [];
                    game.getPlayer().setShouldRender(true);
                    game.setScene(newScene);
                    newScene.onLoad(game, currentScene); 
                    const fade = fadeOut(game);
                    fade.then(() => {
                        game.getPlayer().allowCollisions();
                        game.getPlayer().unfreezeMovment();
                        game.getInputHandler().allowInteraction();
                        game.getAudioManager().pauseBackgroundMusic();
                    });
                });
            })();
    }

    drawMap(game: Game, ctx: CanvasRenderingContext2D) {
        const screen = game.getScreen();
        const roadTile = game.getAssetLoader().getSpriteSheet("assets/cars.png")!.getSprite(3, 0);
        
        const scaledTileSize = this.customScale * this.scaleY;
        
        const tilesAcross = Math.ceil(this.VIRTUAL_WIDTH / this.customScale);
        const exactWidth = Math.ceil(this.customScale * this.scaleX);
        
        for (let x = 0; x < tilesAcross; x++) {         
            const screenX = Math.floor(x * this.customScale * this.scaleX);   
            ctx.drawImage(roadTile, screenX, 0, exactWidth, scaledTileSize);
            ctx.drawImage(roadTile, screenX, this.virtualToScreenY(this.VIRTUAL_HEIGHT / 2), exactWidth, scaledTileSize);
            ctx.drawImage(roadTile, screenX, this.virtualToScreenY(this.VIRTUAL_HEIGHT - 40), exactWidth, scaledTileSize);
        }

        const neededTiles = Math.ceil(this.VIRTUAL_WIDTH / (this.customScale * 2)) + 1;
        
        for(let x = -1; x < neededTiles + 1; x++) {
            const posX = x * this.customScale * 2 * this.scaleX - this.roadOffset * this.scaleX;
            
            ctx.drawImage(roadTile, posX, this.virtualToScreenY(this.VIRTUAL_HEIGHT / 4), scaledTileSize, scaledTileSize);
            ctx.drawImage(roadTile, posX, this.virtualToScreenY(this.VIRTUAL_HEIGHT * 3 / 4), scaledTileSize, scaledTileSize);
        }
    }

    drawScanlines(ctx: CanvasRenderingContext2D, width: number, height: number) {
        ctx.save();
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        
        const lineHeight = Math.max(1, Math.round(4 * this.scaleY));
        const lineSpacing = Math.max(2, Math.round(8 * this.scaleY));
        
        for (let y = 0; y < height; y += lineSpacing) {
            ctx.fillRect(0, y, width, lineHeight);
        }
        
        ctx.restore();
    }
}
