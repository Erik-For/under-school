import { BigSprite } from "./animate.js"
import { Game, Pos } from "./game.js"
import { Player } from "./player.js"
import { Sprite } from "./sprite.js"
import { Screen } from "./screen.js"
import { InputHandler } from "./input.js"

export class Battle {
    #heart: PlayerHeart
    #enemy: Enemy
    #projectiles: Projectile[]
    #game: Game
    #active: boolean
    
    constructor(game: Game) {
        this.#heart = new PlayerHeart(game.getPlayer(), game.getInputHandler());
        this.#enemy = new Enemy(100, new BigSprite(
            new Sprite("assets/goli.png", 16, 16, 0),
            new Sprite("assets/goli.png", 16, 16, 0),
            new Sprite("assets/goli.png", 16, 16, 0),
            new Sprite("assets/goli.png", 16, 16, 0),
        ));
        this.#game = game
        this.#projectiles = [new Projectile(10), new Projectile(10), new Projectile(10)]
        this.#active = false
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

    render(ctx: CanvasRenderingContext2D) {
        const screen = this.#game.getScreen();
        const boxcavasCoords = { x: (screen.width - screen.height/3) / 2, y: 3*(screen.height - screen.height/3)/4 }
        const padding = 15;
        
        // draw rect with 4 line


        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.moveTo(boxcavasCoords.x - padding, boxcavasCoords.y - padding);
        ctx.lineTo(boxcavasCoords.x + screen.height/3 + padding, boxcavasCoords.y - padding);
        ctx.lineTo(boxcavasCoords.x + screen.height/3 + padding, boxcavasCoords.y + screen.height/3 + padding);
        ctx.lineTo(boxcavasCoords.x - padding, boxcavasCoords.y + screen.height/3 + padding);
        ctx.lineTo(boxcavasCoords.x - padding, boxcavasCoords.y - padding);
        ctx.stroke();
        ctx.closePath();

        let heartX = this.#heart.getPos().x / 100 * screen.height/3 + boxcavasCoords.x
        let heartY = this.#heart.getPos().y / 100 * screen.height/3 + boxcavasCoords.y

        this.#heart.render(ctx, heartX, heartY);
        this.#enemy.render(ctx)
        this.#projectiles.forEach(p => p.render(ctx))
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

export class PlayerHeart {
    #pos: Pos
    #lastHit: number
    #player: Player
    #frozen: boolean

    constructor(player: Player, inputHandler: InputHandler) {
        this.#pos = new Pos(0, 0);
        this.#lastHit = 0
        this.#player = player
        this.#frozen = false

        inputHandler.onHold("KeyW", () => {
            if (!this.#frozen && this.#canMove(new Pos(this.#pos.x, this.#pos.y - 1))) this.#pos.y -= 1
        });
        inputHandler.onHold("KeyS", () => {
            if (!this.#frozen && this.#canMove(new Pos(this.#pos.x, this.#pos.y + 1))) this.#pos.y += 1
        });
        inputHandler.onHold("KeyA", () => {
            if (!this.#frozen && this.#canMove(new Pos(this.#pos.x - 1, this.#pos.y))) this.#pos.x -= 1
        });
        inputHandler.onHold("KeyD", () => {
            if (!this.#frozen && this.#canMove(new Pos(this.#pos.x + 1, this.#pos.y))) this.#pos.x += 1
        });
    }

    render(ctx: CanvasRenderingContext2D, x: number, y: number) {
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
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
        return pos.x >= 0 && pos.x <= 100 && pos.y >= 0 && pos.y <= 100
    }
}

export class Projectile {
    #pos: Pos
    #damage: number
    
    constructor(damage: number) {
        this.#pos = new Pos(0, 0);
        this.#damage = damage
    }

    render(ctx: CanvasRenderingContext2D): void {
    }
}

export class Enemy {
    #health: number
    #sprite: BigSprite
    
    constructor(health: number, sprite: BigSprite) {
        this.#health = health
        this.#sprite = sprite
    }

    render(ctx: CanvasRenderingContext2D) {
    }
}