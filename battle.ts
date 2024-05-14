import { BigSprite } from "./animate"
import { Game, Pos } from "./game"
import { Player } from "./player"
import { Sprite } from "./sprite"

class Battle {
    #heart: PlayerHeart
    #enemy: Enemy
    #projectiles: Projectile[]
    #game: Game
    
    constructor(game: Game) {
        this.#heart = new PlayerHeart(game.getPlayer())
        this.#enemy = new Enemy(100, new BigSprite(
            new Sprite("assets/goli.png", 16, 16, 0),
            new Sprite("assets/goli.png", 16, 16, 0),
            new Sprite("assets/goli.png", 16, 16, 0),
            new Sprite("assets/goli.png", 16, 16, 0),
        ));
        this.#game = game
        this.#projectiles = []
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
        this.#heart.render(ctx)
        this.#enemy.render(ctx)
        this.#projectiles.forEach(p => p.render(ctx))
    
    }
}

class PlayerHeart {
    #pos: Pos
    #lastHit: number
    #player: Player

    constructor(player: Player) {
        this.#pos = new Pos(0, 0);
        this.#lastHit = 0
        this.#player = player
    }

    render(ctx: CanvasRenderingContext2D) {
        throw new Error("Method not implemented.")
    }
}

class Projectile {
    #pos: Pos
    #damage: number
    
    constructor(damage: number) {
        this.#pos = new Pos(0, 0);
        this.#damage = damage
    }

    render(ctx: CanvasRenderingContext2D): void {
        throw new Error("Method not implemented.")
    }
}

class Enemy {
    #health: number
    #sprite: BigSprite
    
    constructor(health: number, sprite: BigSprite) {
        this.#health = health
        this.#sprite = sprite
    }

    render(ctx: CanvasRenderingContext2D) {
        throw new Error("Method not implemented.")
    }
}