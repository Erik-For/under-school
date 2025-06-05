import { Mode, Pos } from "./game.js";
import * as Util from "./util.js";
import { PlayerAnimation, CyclicAnimation } from "./animate.js";
import { Sprite } from "./sprite.js";
import { Game } from "./game.js";
import { Action } from "./keys.js";

export class Player {
    x: number;
    y: number;
    #direction: string;
    #directionAnimation: Map<String, PlayerAnimation>;
    #game: Game;
    #movmentFrezze: boolean;
    #health: number;
    #canCollide: boolean;
    #shouldRender: boolean;

    constructor(x: number, y: number, game: Game) {
        this.x = x;
        this.y = y;
        this.#direction = "idleup";
        this.#directionAnimation = new Map();
        this.#game = game;
        this.#movmentFrezze = false;
        this.#health = 100;
        this.#canCollide = true;
        this.#shouldRender = true;

        initAnimations(this.#directionAnimation);
        this.#registerAnimationKeys(); // this handles animation logic, like walking and idleing animations
        this.#registerMovmentKeys(); // this handles movment and collision

    }

    freezeMovment() {
        this.#movmentFrezze = true;
    }
    unfreezeMovment() {
        this.#movmentFrezze = false;
        this.#direction = "idle" + this.getDirection();
    }

    setPos(pos: Pos) {
        this.x = pos.x;
        this.y = pos.y;
    }

    getPos(): Pos {
        return new Pos(this.x, this.y);
    }

    getDirection() {
        return this.#direction.replace("idle", "").replace("walk", ""); // returns the direction of the player without the action, this is kinda hacky but it works fine and is probably not prone to errors
    }
    setDirection(direction: string) {
        this.#direction = "idle" + direction;
    }

    getHealth() {
        return this.#health;
    }

    setHealth(health: number) {
        this.#health = health;
    }

    removeHealth(health: number) {
        this.#health -= health;
    }   

    addHealth(health: number) {
        this.#health += health;
    }

    allowCollisions(){
        this.#canCollide = true;
    }

    denyCollisions(){
        this.#canCollide = false;
    }

    getCanCollide(){
        return this.#canCollide;
    }

    setShouldRender(shouldRender: boolean) {
        this.#shouldRender = shouldRender;
    }

    getShouldRender() {
        return this.#shouldRender;
    }

    render(ctx: CanvasRenderingContext2D, game: Game) {                        
        if(!this.#shouldRender) {
            return;
        }
        let animation = this.#movmentFrezze ? this.#directionAnimation.get("idle" + this.getDirection()) : this.#directionAnimation.get(this.#direction);
        let pos = Util.convertWorldPosToCanvasPos(this.getPos(), game.getCamera().getPosition(), game.getScreen());
        animation!.render(ctx, game.getAssetLoader(),
            Math.round(pos.x),
            Math.round(pos.y),
            game.getScreen().renderScale * game.getScreen().tileSize,
            game.getScreen().renderScale * game.getScreen().tileSize,
        );
    }

    /**
     * Registers the movement keys for the player
     * This handles the movement logic for the player
     * like collision detection and movement
     * @private
     */
    #registerMovmentKeys() {
        const inputHandler = this.#game.getInputHandler();
        
        const getMultiplier = () => {
            return this.#game.getTimeSinceLastTick() / (1000/60);
        }

        const movmentSpeed = 1.2;
        inputHandler.onHold(Action.MoveUp, () => {
            let mutlipliedSpeed = movmentSpeed * getMultiplier();
            if(inputHandler.isKeyDown(Action.MoveLeft) || inputHandler.isKeyDown(Action.MoveRight)){
                mutlipliedSpeed /= Math.sqrt(2);
            }
            if (this.#canMove(this.x, this.y - mutlipliedSpeed)) {
                this.y -= mutlipliedSpeed;
            }
        });
        inputHandler.onHold(Action.MoveDown, () => {
            let mutlipliedSpeed = movmentSpeed * getMultiplier();
            if(inputHandler.isKeyDown(Action.MoveLeft) || inputHandler.isKeyDown(Action.MoveRight)){
                mutlipliedSpeed /= Math.sqrt(2);
            }
            if (this.#canMove(this.x, this.y + mutlipliedSpeed)) {
                this.y += mutlipliedSpeed;
            }
        });
        inputHandler.onHold(Action.MoveLeft, () => {
            let mutlipliedSpeed = movmentSpeed * getMultiplier();
            if(inputHandler.isKeyDown(Action.MoveUp) || inputHandler.isKeyDown(Action.MoveDown)){
                mutlipliedSpeed /= Math.sqrt(2);
            }
            if (this.#canMove(this.x - mutlipliedSpeed, this.y)) {
                this.x -= mutlipliedSpeed;
            }
        });
        inputHandler.onHold(Action.MoveRight, () => {
            let mutlipliedSpeed = movmentSpeed * getMultiplier();
            if(inputHandler.isKeyDown(Action.MoveUp) || inputHandler.isKeyDown(Action.MoveDown)){
                mutlipliedSpeed /= Math.sqrt(2);
            }
            if (this.#canMove(this.x + mutlipliedSpeed, this.y)) {
                this.x += mutlipliedSpeed;
            }
        });
    }

    /**
     * Checks if the player can move to the given position
     * @param x - the x position
     * @param y - the y position
     * @returns true if the player can move to the given position otherwise false
     * @private
     */
    #canMove(x: number, y: number):boolean {
        if (this.#movmentFrezze) {
            return false;
        }

        const screen = this.#game.getScreen();
        const scene = this.#game.getScene();

        // the player has 2 hitpoints one at the left side and one at the right side
        // if you press p in game you can see the hitboxes if you besides the player, (they are very small so you have to look closely)
        const leftCollisionPoint = new Pos(x - (screen.tileSize / 2 - 3), y);
        const middleCollisionPoint = new Pos(x, y);
        const rightCollisionPoint = new Pos(x + (screen.tileSize / 2 - 3), y);

        // get tile that the player is trying to move to
        const leftCollisionPointTile = scene.getTile(Util.convertWorldPosToTileCoordinate(leftCollisionPoint, this.#game.getScreen()));
        const middleCollisionPointTile = scene.getTile(Util.convertWorldPosToTileCoordinate(middleCollisionPoint, this.#game.getScreen()));
        const rightCollisionPointTile = scene.getTile(Util.convertWorldPosToTileCoordinate(rightCollisionPoint, this.#game.getScreen()));

        // if either of the tiles are undefined then the player is trying to move outside the map
        if(leftCollisionPointTile == undefined || rightCollisionPointTile == undefined || middleCollisionPointTile == undefined) {
            return false;
        }

        // get position inside the tile
        const leftSubPos = Util.getSubTileCoordinate(leftCollisionPoint, screen);
        const middleSubPos = Util.getSubTileCoordinate(middleCollisionPoint, screen);
        const rightSubPos = Util.getSubTileCoordinate(rightCollisionPoint, screen);
        
        // if one of points is colliding with a collision box then the move is prevented
        if(isColliding(leftSubPos, leftCollisionPointTile.getCollisonRule()) || isColliding(rightSubPos, rightCollisionPointTile.getCollisonRule()) || isColliding(middleSubPos, middleCollisionPointTile.getCollisonRule())) {
            return false;
        }

        return true;
    }

    /**
     * Registers the animation keys for the player
     * This handles the animation logic for the player
     * like walking and idleing animations
     * @private
     */
    #registerAnimationKeys() {
        let inputHandler = this.#game.getInputHandler()
        function isOtherKeyHeld(){
            return inputHandler.isKeyDown(Action.MoveUp) || inputHandler.isKeyDown(Action.MoveDown) || inputHandler.isKeyDown(Action.MoveLeft) || inputHandler.isKeyDown(Action.MoveRight);
        }

        // animation keys
        inputHandler.onHold(Action.MoveUp, () => {       
            if(inputHandler.isKeyDown(Action.MoveLeft) || inputHandler.isKeyDown(Action.MoveRight) || this.#movmentFrezze){ return; }
            this.#direction = "walkup";
        });
        inputHandler.onRelease(Action.MoveUp, () => {
            if(isOtherKeyHeld() || this.#movmentFrezze){ return; }
            this.#direction = "idleup";
        });
    
        inputHandler.onHold(Action.MoveDown, () => {
            if(inputHandler.isKeyDown(Action.MoveLeft) || inputHandler.isKeyDown(Action.MoveRight) || this.#movmentFrezze){ return; }
            this.#direction = "walkdown";
        });
        inputHandler.onRelease(Action.MoveDown, () => {
            if(isOtherKeyHeld() || this.#movmentFrezze){ return; }
            this.#direction = "idledown";
        });
    
        inputHandler.onHold(Action.MoveLeft, () => {
            if(inputHandler.isKeyDown(Action.MoveUp) || inputHandler.isKeyDown(Action.MoveDown) || this.#movmentFrezze){ return; }
            this.#direction = "walkleft";
        });
        inputHandler.onRelease(Action.MoveLeft, () => {
            if(isOtherKeyHeld() || this.#movmentFrezze){ return; }
            this.#direction = "idleleft";
        });
    
        inputHandler.onHold(Action.MoveRight, () => {
            if(inputHandler.isKeyDown(Action.MoveUp) || inputHandler.isKeyDown(Action.MoveDown) || this.#movmentFrezze){ return; }
            this.#direction = "walkright";
        });
        inputHandler.onRelease(Action.MoveRight, () => {
            if(isOtherKeyHeld() || this.#movmentFrezze){ return; }
            this.#direction = "idleright";
        });
    }

}

/**
 * Initializes the animations for the player
 * @param directionAnimation - the map to store the animations associated with the direction
 */
function initAnimations(directionAnimation: Map<String, PlayerAnimation>) {
    let duration = 750;
    
    directionAnimation.set("idledown", new PlayerAnimation(
        new CyclicAnimation([
            new Sprite("assets/mcwalk.png", 0, 0, 0),
        ], duration),
        new CyclicAnimation([
            new Sprite("assets/mcwalk.png", 0, 1, 0),
        ], duration)
    ));
    directionAnimation.set("walkdown", new PlayerAnimation(
        new CyclicAnimation([
            new Sprite("assets/mcwalk.png", 1, 0, 0),
            new Sprite("assets/mcwalk.png", 0, 0, 0),
            new Sprite("assets/mcwalk.png", 2, 0, 0),
            new Sprite("assets/mcwalk.png", 0, 0, 0),

        ], duration * 1.7),
        new CyclicAnimation([
            new Sprite("assets/mcwalk.png", 1, 1, 0),
            new Sprite("assets/mcwalk.png", 0, 1, 0),
            new Sprite("assets/mcwalk.png", 2, 1, 0),
            new Sprite("assets/mcwalk.png", 0, 1, 0),
        ], duration * 1.7)
    ));



    directionAnimation.set("idleup", new PlayerAnimation(
        new CyclicAnimation([
            new Sprite("assets/mcwalk.png", 0, 2, 0),
        ], duration),
        new CyclicAnimation([
            new Sprite("assets/mcwalk.png", 0, 3, 0),
        ], duration)
    ));
    directionAnimation.set("walkup", new PlayerAnimation(
        new CyclicAnimation([
            new Sprite("assets/mcwalk.png", 1, 2, 0),
            new Sprite("assets/mcwalk.png", 0, 2, 0),
            new Sprite("assets/mcwalk.png", 2, 2, 0),
            new Sprite("assets/mcwalk.png", 0, 2, 0),
        ], duration * 1.7),
        new CyclicAnimation([
            new Sprite("assets/mcwalk.png", 1, 3, 0),
            new Sprite("assets/mcwalk.png", 0, 3, 0),
            new Sprite("assets/mcwalk.png", 2, 3, 0),
            new Sprite("assets/mcwalk.png", 0, 3, 0),
        ], duration * 1.7)
    ));
         

    directionAnimation.set("idleright", new PlayerAnimation(
        new CyclicAnimation([
            new Sprite("assets/mcwalk.png", 0, 4, 0),
        ], duration),
        new CyclicAnimation([
            new Sprite("assets/mcwalk.png", 0, 5, 0),
        ], duration)
    ));
    directionAnimation.set("walkright", new PlayerAnimation(
        new CyclicAnimation([
            new Sprite("assets/mcwalk.png", 0, 4, 0),
            new Sprite("assets/mcwalk.png", 1, 4, 0),
        ], duration),
        new CyclicAnimation([
            new Sprite("assets/mcwalk.png", 0, 5, 0),
            new Sprite("assets/mcwalk.png", 1, 5, 0),
        ], duration)
    ));

    directionAnimation.set("idleleft", new PlayerAnimation(
        new CyclicAnimation([
            new Sprite("assets/mcwalk.png", 0, 6, 0),
        ], duration),
        new CyclicAnimation([
            new Sprite("assets/mcwalk.png", 0, 7, 0),
        ], duration)
    ));
    directionAnimation.set("walkleft", new PlayerAnimation(
        new CyclicAnimation([
            new Sprite("assets/mcwalk.png", 0, 6, 0),
            new Sprite("assets/mcwalk.png", 1, 6, 0),
        ], duration),
        new CyclicAnimation([
            new Sprite("assets/mcwalk.png", 0, 7, 0),
            new Sprite("assets/mcwalk.png", 1, 7, 0),
        ], duration)
    ));
}

/**
 * Checks if the position within the tile is colliding with the collision box of the tile
 * @param pos - the position within the tile
 * @param collisionRule - the collision rule of the tile
 * @returns true if the position is colliding with the collision box of the tile otherwise false
 */
function isColliding(pos: Pos, collisionRule: number) {
    if(collisionRule == 0) {
        return false;
    }
    const subBounds:  { [key: number]: { minX: number, minY: number, maxX: number, maxY: number } } = {
        1: { minX: 0, minY: 0, maxX: 16, maxY: 16 }, // full collision box
        2: { minX: 5, minY: 5, maxX: 12, maxY: 12 }, // center collision box
        3: { minX: 0, minY: 0, maxX: 16, maxY: 7 }, // top half collision box
        4: { minX: 0, minY: 9, maxX: 16, maxY: 16 }, // bottom half collision box
        5: { minX: 0, minY: 0, maxX: 7, maxY: 16 }, // left half collision box
        6: { minX: 9, minY: 0, maxX: 16, maxY: 16 }, // right half collision box
        7: { minX: 0, minY: 0, maxX: 7, maxY: 7 }, // top left corner collision box
        8: { minX: 9, minY: 0, maxX: 16, maxY: 7 }, // top right corner collision box
        9: { minX: 0, minY: 9, maxX: 7, maxY: 16 }, // bottom left corner collision box
        10: { minX: 9, minY: 9, maxX: 16, maxY: 16 }, // bottom right corner collision box
    };
    
    let subBound = subBounds[collisionRule];
    return subBound.minX <= pos.x && pos.x <= subBound.maxX && // if minX <= pos.x <= maxX
    subBound.minY <= pos.y && pos.y <= subBound.maxY; // if minY <= pos.y <= maxY
}