import { AssetLoader } from "../assetloader.js";
import { Game, Pos } from "../game.js";
import Keys from "../keys.js";
import { changeScene, Scene, SceneScript, deserilizeScene, fadeIn, fadeOut } from "../scene.js";

class car {
    x: number = 0; // Position in virtual coordinates
    y: number = 0; // Y position based on lane
    lane: number = 0; // 0 -> 7 | 0-3 ltr & 4-7 rtl
    speed: number = 0; // Unique speed of the car

    /*
    Allowed positions:
    0: (0, 26)
    1: (0, 180)
    2: (0, 295)
    3: (0, 450) 
    4: (maxwidth + 200, 558) 
    5: (maxwidth + 200, 719)
    6: (maxwidth + 200, 826) 
    7: (maxwidth + 200, 954)
    */

    update(deltaTime: number, scale: number) {
        // Apply speed + scale factor to adjust for game progression
        const adjustedSpeed = this.speed + (this.speed > 0 ? scale : -scale);
        this.x += adjustedSpeed * deltaTime;
    }
}

export default class Script implements SceneScript {
    name: string = "minigame.js";
    
    readonly VIRTUAL_WIDTH: number = 1920;
    readonly VIRTUAL_HEIGHT: number =  1080;
    
    scaleX: number = 2;
    scaleY: number = 2;
    
    customScale = 108; // Based on virtual height / 10
    playerPos: Pos = new Pos(0, 0);
    canMove: boolean = false;
    moveSpeed: number = 15;
    lastFrameTime: number = 0;
    roadOffset: number = 0;
    roadSpeed: number = 0;
    LapCount: number = 1;
    mDriven: number = 0;

    score: number = 0;
    
    // Add new variables for rotation
    playerRotation: number = 0;
    playerRotationSpeed: number = 0;
    isCrashed: boolean = false;
    crashSpinDuration: number = 0;

    // Add invincibility variables
    invincibilityDuration: number = 1.5; // 1.5 seconds of invincibility after crash
    invincibilityTimer: number = 0;
    isInvincible: boolean = false;
    invincibilityFlashTimer: number = 0;
    shouldDisplayPlayer: boolean = true;

    cars: car[] = [];
    carPool: car[] = [];
    maxCars: number = 45;
    spawnTimer: number = 0;
    spawnInterval: number = 0.7;

    // Add variables for exit animation
    isExiting: boolean = false;
    exitAnimationTimer: number = 0;
    exitAnimationDuration: number = 3; // seconds for the animation
    
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
        
        this.playerPos = new Pos(this.VIRTUAL_WIDTH / 2 - this.customScale * 2, this.VIRTUAL_HEIGHT / 2 - this.customScale);

        this.lastFrameTime = performance.now();
        game.getAssetLoader().getAudioAsset("assets/binaryburnout.mp3")!.load().then(() => {
            game.getAudioManager().playBackgroundMusic(game.getAssetLoader().getAudioAsset("assets/binaryburnout.mp3")!);
            setTimeout(() => {
                this.canMove = true;
            }, 2000);
        });

        this.carPool = [];
        for (let i = 0; i < this.maxCars; i++) {
            this.carPool.push(new car());
        }

        this.playerRotation = 0;
        this.playerRotationSpeed = 0;
        this.isCrashed = false;
        this.crashSpinDuration = 0;
        this.isInvincible = false;
        this.invincibilityTimer = 0;
        this.shouldDisplayPlayer = true;
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
            
            const carScreenX = this.virtualToScreenX(car.x);
            const carScreenY = this.virtualToScreenY(car.y);
            
            ctx.drawImage(
                game.getAssetLoader().getSpriteSheet("assets/cars.png")!.getSprite(car.lane < 4 ? 1 : 2, 0),
                carScreenX,
                carScreenY,
                scaledSize,
                scaledSize
            );
        }

        this.spawnTimer += cappedDeltaTime;
        //Här sätts lanes och y pos för bilar !!!!!!!!!!!!!!!!!! OBS!!!!!!!!!!!!
        if (this.spawnTimer >= this.spawnInterval && this.cars.length < this.maxCars && !this.isExiting) {
            this.spawnTimer = 0;
            this.spawnInterval = this.roadSpeed === 2250 ? 0.25 : 0.55;
            if (this.carPool.length > 0) {
                const newCar = this.carPool.pop()!;
                //set lane and speed
                newCar.lane = Math.floor(Math.random() * 8);
                
                // Set speed and spawn position based on lane
                if (newCar.lane >= 0 && newCar.lane <= 3) {
                    // Right-moving cars (lanes 0-3)
                    newCar.speed = 175 + Math.random() * 220 + this.roadSpeed / 10;
                    newCar.x = -200;
                    // Set y according to allowed positions
                    const yPositions = [32, 165, 302, 435];
                    newCar.y = yPositions[newCar.lane];
                } else {
                    // Left-moving cars (lanes 4-7)
                    newCar.speed = -(175 + Math.random() * 220 + this.roadSpeed / 10);
                    newCar.x = this.VIRTUAL_WIDTH + 200;
                    // Set y according to allowed positions
                    const yPositions = [569, 702, 838, 945];
                    newCar.y = yPositions[newCar.lane - 4];
                }
                
                this.cars.push(newCar);
            }
        }
        
        for (let i = this.cars.length - 1; i >= 0; i--) {
            const car = this.cars[i];
            
            if ((car.lane < 4 && car.x > this.VIRTUAL_WIDTH + 200) || 
                (car.lane >= 4 && car.x < -200)) {
                
                this.cars.splice(i, 1);
                this.carPool.push(car);
            }

            // Check for collision with player
            if (!this.isCrashed && !this.isInvincible && 
                Math.abs(car.x - this.playerPos.x) < this.customScale && 
                Math.abs(car.y - this.playerPos.y) < this.customScale * 0.75) { // Adjusted for actual height ratio (12/16 = 0.75)
                this.cars.splice(i, 1);
                this.carPool.push(car);
                this.roadSpeed = 0;
                
                // Start player spin on crash
                this.isCrashed = true;
                this.playerRotationSpeed = Math.PI * 4; // 2 full rotations per second
                this.crashSpinDuration = 0.75; // 0.75 seconds of spinning
                
                game.getAudioManager().playSoundEffect(game.getAssetLoader().getAudioAsset("assets/crash.wav")!);
            }
        }
        
        // Update player rotation if crashed
        if (this.isCrashed) {
            this.canMove = false;
            this.playerRotation += this.playerRotationSpeed * cappedDeltaTime;
            this.crashSpinDuration -= cappedDeltaTime;
            
            if (this.crashSpinDuration <= 0) {
                this.isCrashed = false;
                this.canMove = true;
                this.playerRotation = 0;
                
                // Start invincibility period
                this.isInvincible = true;
                this.invincibilityTimer = this.invincibilityDuration;
            }
        }
        
        // Handle invincibility period
        if (this.isInvincible) {
            this.invincibilityTimer -= cappedDeltaTime;
            
            // Flash the player (toggle visibility every 0.1 seconds)
            this.invincibilityFlashTimer += cappedDeltaTime;
            if (this.invincibilityFlashTimer >= 0.1) {
                this.invincibilityFlashTimer = 0;
                this.shouldDisplayPlayer = !this.shouldDisplayPlayer;
            }
            
            if (this.invincibilityTimer <= 0) {
                this.isInvincible = false;
                this.shouldDisplayPlayer = true;
            }
        }
        
        // Only draw player if it should be displayed (for flashing effect)
        if (this.shouldDisplayPlayer) {
            ctx.save();
            ctx.translate(screenX + scaledSize / 2, screenY + scaledSize / 2);
            ctx.rotate(this.playerRotation);
            ctx.drawImage(
                game.getAssetLoader().getSpriteSheet("assets/cars.png")!.getSprite(0, 0), 
                -scaledSize / 2,
                -scaledSize / 2,
                scaledSize, 
                scaledSize
            );
            ctx.restore();
        }

        const fontSizeLarge = Math.round(60 * this.scaleY);
        const fontSizeSmall = Math.round(20 * this.scaleY);
        
        ctx.fillStyle = "white";
        ctx.font = `${fontSizeLarge}px underschool`;
        ctx.fillText(`LAP ${this.LapCount}`, 10 * this.scaleX, 100 * this.scaleY);
        ctx.fillText(`KMH ${Math.round(this.roadSpeed/10)}`, 10 * this.scaleX, 150 * this.scaleY);
        //draw score top right
        ctx.fillText(`${Math.floor(this.score)}`, screen.width - 10 * this.scaleX - ctx.measureText(`${Math.floor(this.score)}`).width, 100 * this.scaleY);

        this.drawScanlines(ctx, screen.width, screen.height);
        ctx.font = `${fontSizeSmall}px underschool`;
        ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        ctx.fillText("uunnvhvhba", 10 * this.scaleX, screen.height - 80 * this.scaleY);
        
        if(!this.isCrashed && this.canMove) {
            this.roadSpeed = Math.min(this.roadSpeed + 1, 2250);
        }

        if(this.roadSpeed === 2250) {
            this.score += cappedDeltaTime * 50;
        }
        else if(this.roadSpeed > 1000) {
            this.score  += cappedDeltaTime * 15;
        }
        
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

        // Check if game should end and start exit animation
        if(this.LapCount === 5 && !this.isExiting) {
            this.isExiting = true;
            this.canMove = false;
            this.exitAnimationTimer = this.exitAnimationDuration;
            
            // Clear other cars from the screen
            this.cars.forEach(car => this.carPool.push(car));
            this.cars = [];
            
            if(this.score > 2499){
                game.getGameState().hasReachedHighScoreThreshold = true;
            }
            game.getGameState().hasWonMinigame = true;
        }
        
        // Handle exit animation
        if (this.isExiting) {
            this.exitAnimationTimer -= cappedDeltaTime;
            
            // Accelerate to the right
            this.playerPos.x += (400 + (this.exitAnimationDuration - this.exitAnimationTimer) * 300) * cappedDeltaTime;
            
            // Gradually decrease speed and drive away
            this.roadSpeed = Math.max(0, this.roadSpeed - 15);
            
            // After animation completes, switch scene
            if (this.exitAnimationTimer <= 0 || this.playerPos.x > this.VIRTUAL_WIDTH + 200) {
                this.exit(game, currentScene);
                return;
            }
        }
        
        // Rest of boundary checks only if not exiting
        if (!this.isExiting) {
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
    }

    onInteraction(game: Game, currentScene: Scene, pos: Pos, data: string) {
    }

    exit(game: Game, currentScene: Scene) {
        (async () => {
                game.getPlayer().denyCollisions();
                game.getPlayer().freezeMovment();
                fadeIn(game);
                let newScene = await deserilizeScene(game.getAssetLoader().getTextAsset("assets/teknik.json")!.data!);
                game.getParticleManager().particles = [];
                    game.getPlayer().setShouldRender(true);
                    game.setScene(newScene);
                    newScene.onLoad(game, currentScene); 
                    fadeOut(game).then(() => {
                        game.getPlayer().allowCollisions();
                        game.getPlayer().unfreezeMovment();
                        game.getInputHandler().allowInteraction();
                        game.getAudioManager().pauseBackgroundMusic();
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
