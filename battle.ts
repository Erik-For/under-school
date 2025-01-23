import { BigSprite } from "./animate.js"
import { Game, Mode, Pos } from "./game.js"
import { Player } from "./player.js"
import { render, Sprite, SpriteSheet } from "./sprite.js"
import { InputHandler } from "./input.js"
import Keys from "./keys.js"
import { AssetLoader } from "./assetloader.js"
import { Screen } from "./screen.js"
import { drawImageRot, drawSpriteRot } from "./util.js"
import { CodeSequenceItem, Sequence, SequenceCallback, SequenceItem } from "./sequence.js"

/*
Vi måste passera in audioManager så att varje boss börjar spela sin låt. 
Gör klart projektiles och enemy.https://erik-for.github.io/under-school/editor.html
*/

export class Round {
    animation: Sequence
    projectiles: Projectile[]

    constructor(sequence: Sequence, projectiles: Projectile[]) {
        this.projectiles = projectiles
        this.animation = sequence
    }
}

/*
for (let i = 0; i < 10; i++) {
    let projectile = new LoopingHomingProjectile(new Pos(10*i, 10*i), 10*60, new Sprite("assets/rootSpike.png", 0, 0, 0), 1 ,this.#heart);
    let projectile2 = new StraightProjectile(new Pos(10*i, 10*i), 10*60, new Sprite("assets/rootSpike.png", 0, 0, 0), 0.75 ,this.#heart);
    this.#projectiles.push(projectile)
    this.#projectiles.push(projectile2)
}
*/
export class Battle extends SequenceCallback {
    #hasFinished: boolean
    #dead: boolean
    #heart: PlayerHeart
    #enemy: Enemy
    #projectiles: Projectile[]
    #game: Game
    #rounds: Round[]
    #currentRound: number
    #active: boolean
    

    // TODO lägg till en array av projectiles som skjuts ut i olika stader av spelet
    constructor(game: Game, enemy: Enemy, rounds: Round[]) {
        super()
        this.#heart = new PlayerHeart(game.getPlayer(), game.getInputHandler());
        this.#enemy = enemy;
        this.#game = game;
        this.#projectiles = [];
        this.#rounds = rounds;
        this.#currentRound = 0;
        this.#active = false;
        this.#dead = false;
        this.#hasFinished = false;
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

    nextRound() {

        if(this.#currentRound < this.#rounds.length) {
            let sequence = this.#rounds[this.#currentRound].animation

            sequence.items.push(new SequenceItem(
                new CodeSequenceItem(() => {
                    this.activate()
                }),
                (item, ctx) => {
                    (item as CodeSequenceItem).run();
                }
            ))

            this.deactivate()
            this.#game.getSequenceExecutor().setSequence(sequence);
            
            this.#projectiles = this.#projectiles.concat(this.#rounds[this.#currentRound].projectiles)
            this.#currentRound++
        } else if(!this.#hasFinished) {
            this.#hasFinished = true;
            this.#game.setMode(Mode.OpenWorld);
            this.#game.getPlayer().unfreezeMovment();
            this.#game.getInputHandler().allowInteraction();
            this.#game.getBattle()?.deactivate();
            this.#game.getSequenceExecutor().setSequence(new Sequence([]));
            this.#game.getAudioManager().pauseBackgroundMusic();
            this.onFinish();
        }
    }

    tick() {
        if(this.#dead) {
            setTimeout(() => {
                window.location.reload();
            }, 3000);
            return;
        }
        if (this.#active) {
            this.#projectiles.forEach(projectile => {
                projectile.update(this);
                if(projectile.getPos().distance(this.#heart.getPos()) < 2.5) {
                    this.#heart.health -= projectile.damage
                    if(this.#heart.health <= 0) {
                        this.#heart.health = 0
                        this.#dead = true;
                    }
                    projectile.lifeTime = 0
                }
            });
            this.#projectiles = this.#projectiles.filter(projectile => projectile.getLifeTime() > 0)
        }
        if(this.#projectiles.length === 0 && this.#active) {
            this.nextRound()
        }
    }

    render(ctx: CanvasRenderingContext2D, assetLoader: AssetLoader) {
        if(this.#dead) {
            renderDeathScreen(ctx, assetLoader);
            return;
        }
        const screen = this.#game.getScreen();

        const boxWidth = screen.width / 5;
        
        // caculate top left corner
        const boxTopLeftCornerX = (screen.width - boxWidth) / 2;
        const boxTopLeftCornerY = screen.height - boxWidth;

        // padding downwards
        const marginY = screen.height / 20;
        const padding = 15;

        const healthBarWidth = 200;
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

        if(this.#active) {
            this.#projectiles.forEach(projectile => {
                projectile.render(ctx, assetLoader, screen);
            });
        }

        // render health bar (red green bar inbetween the box and the enemy box)
        
        ctx.fillStyle = "red";
        ctx.fillRect(boxTopLeftCornerX + boxWidth / 2 - healthBarWidth / 2, boxTopLeftCornerY - marginY - padding - 40, healthBarWidth, 20);
        ctx.fillStyle = "green";
        ctx.fillRect(boxTopLeftCornerX + boxWidth / 2 - healthBarWidth / 2, boxTopLeftCornerY - marginY - padding - 40, healthBarWidth * (this.#heart.health / 100), 20);
        
        // Centered HP text render
        ctx.fillStyle = "white";
        ctx.font = "20px underschool";
        const hpText = "HP: " + this.#heart.health;
        const textWidth = ctx.measureText(hpText).width;
        ctx.fillText(hpText, boxTopLeftCornerX + boxWidth / 2 - textWidth / 2, boxTopLeftCornerY - marginY - padding - 45);
    }

    deactivate() {
        this.#active = false
        this.#heart.freezeMovment()
    }

    activate() {
        this.#active = true
        this.#heart.unfreezeMovment()
        if(this.#currentRound === 0) {
            this.nextRound()
            this.getHeart().getPos().x = 50
            this.getHeart().getPos().y = 50
        }
    }
}

export interface PosProvider {
    getPos(): Pos
}

export class PlayerHeart implements PosProvider {
    #pos: Pos
    #size: number;
    health: number
    #player: Player
    #frozen: boolean

    constructor(player: Player, inputHandler: InputHandler) {
        this.#pos = new Pos(50, 50);
        this.#size = 24;
        this.#player = player
        this.#frozen = false
        this.health = 100

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
    height: number;
    width: number;
    damage: number
    
    constructor(pos: Pos, lifeTime: number, sprite: Sprite, speed: number, height: number = 24, width: number = 24, damage: number = 5) {
        this.pos = pos;
        this.lifeTime = lifeTime;
        this.sprite = sprite;
        this.rotation = 0;
        this.speed = speed;
        this.height = height;
        this.width = width;
        this.damage = damage;
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
        drawSpriteRot(ctx, assetLoader, this.sprite, boxTopLeftCornerX + boxWidth * this.pos.x / 100, boxTopLeftCornerY + boxWidth * this.pos.y / 100 - marginY, this.width, this.height, this.rotation);
        //render(ctx, assetLoader, this.sprite, boxTopLeftCornerX + boxWidth * this.pos.x / 100, boxTopLeftCornerY + boxWidth * this.pos.y / 100 - marginY, 24, 24);
    }
    getLifeTime(): number {
        return this.lifeTime;
    }
    getPos() {
        return this.pos;
    }
    abstract update(battle: Battle): void;
}

export class LoopingHomingProjectile extends Projectile {
    #acceleration: Pos;
    
    constructor(pos: Pos, lifeTime: number, sprite: Sprite, speed: number, height: number = 24, width: number = 24) {
        super(pos, lifeTime, sprite, speed, height, width);
        this.#acceleration = new Pos(0, 0);
    }
    
    update(battle: Battle): void {
        const turnRate = 0.1;
        const turnDirection = Math.sign((Math.atan2(battle.getHeart().getPos().y - this.pos.y, battle.getHeart().getPos().x - this.pos.x) + Math.PI/2) - this.rotation);
        this.rotation += turnRate * turnDirection;
        
        // Move towards target                
        
        this.pos.x += Math.cos(this.rotation - Math.PI/2) * this.speed;
        this.pos.y += Math.sin(this.rotation - Math.PI/2) * this.speed;

        this.lifeTime--;
    }
}

export class HomingProjectile extends Projectile {
    #acceleration: Pos;
    #lastDirection: number;
    
    constructor(pos: Pos, lifeTime: number, sprite: Sprite, speed: number, height: number = 24, width: number = 24) {
        super(pos, lifeTime, sprite, speed, height, width);
        this.#acceleration = new Pos(0, 0);
        this.#lastDirection = 0;
    }
    
    update(battle: Battle): void {
        const turnRate: number = 0.5;
        const alpha = (Math.atan2(battle.getHeart().getPos().y - this.pos.y, battle.getHeart().getPos().x - this.pos.x));
        
        let turnDirection: number = Math.sign((alpha + Math.PI/2) - this.rotation);
        
        this.rotation += turnRate * turnDirection;
        
        if(Math.abs(alpha) > Math.PI/2 * 0.6) {
            turnDirection = this.#lastDirection;
        } else {
            this.#lastDirection = turnDirection;
        }
        
        // Move towards target
        this.pos.x += Math.cos(this.rotation - Math.PI/2) * this.speed;
        this.pos.y += Math.sin(this.rotation - Math.PI/2) * this.speed;

        this.lifeTime--;
    }
}

export class StraightProjectile extends Projectile {
    #initialTargetPos: Pos | undefined;
    #velocity: Pos;
    
    constructor(pos: Pos, lifeTime: number, sprite: Sprite, speed: number, rotation: number, height: number = 24, width: number = 24) {
        super(pos, lifeTime, sprite, speed, height, width);
        this.rotation = rotation;
        this.#velocity = new Pos(Math.cos(this.rotation) * speed, Math.sin(this.rotation) * speed);
    }
     
    update(battle: Battle): void {
        if (!this.#initialTargetPos) {
            this.#initialTargetPos = battle.getHeart().getPos();
            this.rotation = Math.atan2(this.#initialTargetPos.y - this.pos.y, this.#initialTargetPos.x - this.pos.x);
            this.#velocity = new Pos(Math.cos(this.rotation) * this.speed, Math.sin(this.rotation) * this.speed);
        }
        this.pos.x += this.#velocity.x;
        this.pos.y += this.#velocity.y;
        this.lifeTime--;
    }
}

export class Enemy {
    #health: number
    #sprite: BigSprite
    //#spriteMouthOpen: BigSprite
    
    
    constructor(health: number, sprite: BigSprite) {
        this.#health = health
        this.#sprite = sprite
        //this.#spriteMouthOpen = mouthOpenSprite;
    }

    render(ctx: CanvasRenderingContext2D, assetLoader: AssetLoader, enemyBoxTopLeftCornerX: number, enemyBoxTopLeftCornerY: number, enemyBoxWidth: number) {
        this.#sprite.render(ctx, assetLoader, enemyBoxTopLeftCornerX, enemyBoxTopLeftCornerY, enemyBoxWidth, enemyBoxWidth);
    }
}

function renderDeathScreen(ctx: CanvasRenderingContext2D, assetLoader: AssetLoader) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "40px underschool";
    ctx.fillText("You died", ctx.canvas.width / 2 - ctx.measureText("You died").width / 2, ctx.canvas.height / 2);
}
