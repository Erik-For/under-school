import { BigSprite } from "./animate.js"
import { Game, Pos } from "./game.js"
import { Player } from "./player.js"
import { render, Sprite, SpriteSheet } from "./sprite.js"
import { InputHandler } from "./input.js"
import Keys from "./keys.js"
import { AssetLoader } from "./assetloader.js"
import { Screen } from "./screen.js"
import { drawImageRot, drawSprigeRot } from "./util.js"

/*
Vi måste passera in audioManager så att varje boss börjar spela sin låt. 
Gör klart projektiles och enemy.
*/

export class Battle {
    #heart: PlayerHeart
    #enemy: Enemy
    #projectiles: Projectile[]
    #game: Game
    #active: boolean
    
    constructor(game: Game, enemy: Enemy) {
        this.#heart = new PlayerHeart(game.getPlayer(), game.getInputHandler());
        this.#enemy = enemy;
        this.#game = game
        this.#projectiles = []
        this.#active = false
        for (let i = 0; i < 10; i++) {
            let projectile = new HomingProjectile(new Pos(10*i, 10*i), 5*60, new Sprite("assets/rootSpike.png", 0, 0, 0), 10 ,this.#heart);
            this.#projectiles.push(projectile)
        }

    }

    getHeart() {
        return this.#heart
    }

    getEnemy() {
        return this.#enemy
    }

    getProjectiles() {
        return this.#projectiles
    }

    tick() {
        if (this.#active) {
            this.#projectiles.forEach(projectile => {
                projectile.update()
            })
            this.#projectiles = this.#projectiles.filter(projectile => projectile.getLifeTime() > 0)
        }
    }

    render(ctx: CanvasRenderingContext2D, assetLoader: AssetLoader) {
        const screen = this.#game.getScreen();

        const boxWidth = screen.width / 5;
        
        // caculate top left corner
        const boxTopLeftCornerX = (screen.width - boxWidth) / 2;
        const boxTopLeftCornerY = screen.height - boxWidth;

        // padding downwards
        const marginY = screen.height / 20;
        const padding = 15;

        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        ctx.moveTo(boxTopLeftCornerX - padding, boxTopLeftCornerY - marginY - padding); // top left corner
        ctx.lineTo(boxTopLeftCornerX + boxWidth + padding, boxTopLeftCornerY - marginY - padding); // top right corner
        ctx.lineTo(boxTopLeftCornerX + boxWidth + padding, boxTopLeftCornerY + boxWidth - marginY + padding); // bottom right corner
        ctx.lineTo(boxTopLeftCornerX - padding, boxTopLeftCornerY + boxWidth - marginY + padding); // bottom left corner
        ctx.lineTo(boxTopLeftCornerX - padding, boxTopLeftCornerY - marginY - padding); // top left corner
        ctx.stroke();
        ctx.closePath();

        this.#heart.render(ctx, assetLoader, boxTopLeftCornerX + boxWidth * this.#heart.getPos().x / 100, boxTopLeftCornerY + boxWidth * this.#heart.getPos().y / 100 - marginY)
        
        const enemyBoxWidth = screen.width / 5;
        const enemyBoxTopLeftCornerX = (screen.width - enemyBoxWidth) / 2;
        const enemyBoxTopLeftCornerY = marginY;

        this.#enemy.render(ctx, this.#game.getAssetLoader(), enemyBoxTopLeftCornerX, enemyBoxTopLeftCornerY, enemyBoxWidth)

        this.#projectiles.forEach(projectile => {
            projectile.render(ctx, assetLoader, screen);
        })
    }

    deactivate() {
        this.#active = false
        this.#heart.freezeMovment()
    }

    activate() {
        this.#active = true
        this.#heart.unfreezeMovment()
    }
}

export interface PosProvider {
    getPos(): Pos
}

export class PlayerHeart implements PosProvider {
    #pos: Pos
    #size: number;
    #lastHit: number
    #player: Player
    #frozen: boolean

    constructor(player: Player, inputHandler: InputHandler) {
        this.#pos = new Pos(0, 0);
        this.#size = 24;
        this.#lastHit = 0
        this.#player = player
        this.#frozen = false

        const movmentSpeed = 1;

        inputHandler.onHold(Keys.MoveUp, () => {
            if (!this.#frozen && this.#canMove(new Pos(this.#pos.x, this.#pos.y - movmentSpeed))) this.#pos.y -= inputHandler.isKeyDown(Keys.MoveLeft) || inputHandler.isKeyDown(Keys.MoveRight) ? movmentSpeed/Math.sqrt(2) : movmentSpeed 
        });
        inputHandler.onHold(Keys.MoveDown, () => {
            if (!this.#frozen && this.#canMove(new Pos(this.#pos.x, this.#pos.y + movmentSpeed))) this.#pos.y += inputHandler.isKeyDown(Keys.MoveLeft) || inputHandler.isKeyDown(Keys.MoveRight) ? movmentSpeed/Math.sqrt(2) : movmentSpeed
        });
        inputHandler.onHold(Keys.MoveLeft, () => {
            if (!this.#frozen && this.#canMove(new Pos(this.#pos.x - movmentSpeed, this.#pos.y))) this.#pos.x -= inputHandler.isKeyDown(Keys.MoveDown) || inputHandler.isKeyDown(Keys.MoveUp) ? movmentSpeed/Math.sqrt(2) : movmentSpeed
        });
        inputHandler.onHold(Keys.MoveRight, () => {
            if (!this.#frozen && this.#canMove(new Pos(this.#pos.x + movmentSpeed, this.#pos.y))) this.#pos.x += inputHandler.isKeyDown(Keys.MoveDown) || inputHandler.isKeyDown(Keys.MoveUp) ? movmentSpeed/Math.sqrt(2) : movmentSpeed
        });
    }

    render(ctx: CanvasRenderingContext2D, assetLoader: AssetLoader, x: number, y: number) {
        let sprite: Sprite = new Sprite("assets/heart.png", 0, 0, 0);
        render(ctx, assetLoader ,sprite, x, y, 24, 24);
    }

    getPos() {
        return this.#pos
    }

    freezeMovment() {
        this.#frozen = true
    }

    unfreezeMovment() {
        this.#frozen = false
    }

    #canMove(pos: Pos) {
        return pos.x >= -3 && pos.x <= 97 && pos.y >= -4 && pos.y <= 97
    }
}

export abstract class Projectile {
    pos: Pos;
    sprite: Sprite;
    lifeTime: number;
    rotation: number;
    speed: number;

    constructor(pos: Pos, lifeTime: number, sprite: Sprite, speed: number) {
        this.pos = pos;
        this.lifeTime = lifeTime;
        this.sprite = sprite;
        this.rotation = 0;
        this.speed = speed;
    }

    render(ctx: CanvasRenderingContext2D, assetLoader: AssetLoader, screen: Screen): void {
        //ctx, assetLoader, boxTopLeftCornerX + boxWidth * this.#heart.getPos().x / 100, boxTopLeftCornerY + boxWidth * this.#heart.getPos().y / 100 - marginY

        const boxWidth = screen.width / 5;
        
        // caculate top left corner
        const boxTopLeftCornerX = (screen.width - boxWidth) / 2;
        const boxTopLeftCornerY = screen.height - boxWidth;

        // padding downwards
        const marginY = screen.height / 20;
        const padding = 15;
        drawSprigeRot(ctx, assetLoader, this.sprite, boxTopLeftCornerX + boxWidth * this.pos.x / 100, boxTopLeftCornerY + boxWidth * this.pos.y / 100 - marginY, 24, 24, this.rotation);
        //render(ctx, assetLoader, this.sprite, boxTopLeftCornerX + boxWidth * this.pos.x / 100, boxTopLeftCornerY + boxWidth * this.pos.y / 100 - marginY, 24, 24);

    }
    getLifeTime(): number {
        return this.lifeTime;
    }
    abstract update(): void;
}

export class HomingProjectile extends Projectile{
    #target: PosProvider;
    #acceleration: Pos;
    
    constructor(pos: Pos, lifeTime: number, sprite: Sprite, speed: number, target: PosProvider) {
        super(pos, lifeTime, sprite, speed);
        this.#target = target;
        this.#acceleration = new Pos(0, 0);
    }
    
    update(): void {
        this.rotation = Math.atan2(this.#target.getPos().y - this.pos.y, this.#target.getPos().x - this.pos.x) + Math.PI/2;
        this.#acceleration.x += (this.#target.getPos().x - this.pos.x) / 100;
        this.#acceleration.y += (this.#target.getPos().y - this.pos.y) / 100;
        this.pos.x += this.#acceleration.x;
        this.pos.y += this.#acceleration.y;

        this.lifeTime--;
    }
}

export class Enemy {
    #health: number
    #sprite: BigSprite
    
    
    constructor(health: number, sprite: BigSprite) {
        this.#health = health
        this.#sprite = sprite
    }

    render(ctx: CanvasRenderingContext2D, assetLoader: AssetLoader, enemyBoxTopLeftCornerX: number, enemyBoxTopLeftCornerY: number, enemyBoxWidth: number) {
        this.#sprite.render(ctx, assetLoader, enemyBoxTopLeftCornerX, enemyBoxTopLeftCornerY, enemyBoxWidth, enemyBoxWidth);
    }
}