import { Pos } from "./screen.js";
import * as Util from "./util.js";
import { PlayerAnimation, CyclicAnimation } from "./animate.js";
import { Sprite } from "./sprite.js";
import { Game } from "./game.js";

export class Player {
    x: number;
    y: number;
    #direction: string;
    #directionAnimation: Map<String, PlayerAnimation>;
    #game: Game;

    constructor(x: number, y: number, game: Game) {
        this.x = x;
        this.y = y;
        this.#direction = "idledown";
        this.#directionAnimation = new Map();
        this.#game = game;

        initAnimations(this.#directionAnimation);
        this.#registerAnimationKeys(); // this handles animation logic, like walking and idleing animations
        this.#registerMovmentKeys(); // this handles movment and collision

    }

    getPosition(): Pos {
        return new Pos(this.x, this.y);
    }

    render(ctx: CanvasRenderingContext2D, game: Game) {                        
        let animation = this.#directionAnimation.get(this.#direction);
        let pos = Util.convertWorldPosToCanvasPos(this.getPosition(), game.getCamera().getPosition(), game.getScreen());
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
        let inputHandler = this.#game.getInputHandler();

        let movmentSpeed = 1;
        inputHandler.onHold("KeyW", () => {
            if (this.#canMove(this.x, this.y - movmentSpeed)) {
                this.y -= movmentSpeed;
                this.#game.getCamera().setPosition(this.getPosition())
            }
        });
        inputHandler.onHold("KeyS", () => {
            if (this.#canMove(this.x, this.y + movmentSpeed)) {
                this.y += movmentSpeed;
                this.#game.getCamera().setPosition(this.getPosition())
            }
        });
        inputHandler.onHold("KeyA", () => {
            if (this.#canMove(this.x - movmentSpeed, this.y)) {
                this.x -= movmentSpeed;
                this.#game.getCamera().setPosition(this.getPosition())
            }
        });
        inputHandler.onHold("KeyD", () => {
            if (this.#canMove(this.x + movmentSpeed, this.y)) {
                this.x += movmentSpeed;
                this.#game.getCamera().setPosition(this.getPosition())
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
        const screen = this.#game.getScreen();
        const scene = this.#game.getScene();

        // the player has 2 hitpoints one at the left side and one at the right side
        // if you press p in game you can see the hitboxes if you besides the player, (they are very small so you have to look closely)
        const leftCollisionPoint = new Pos(x - screen.tileSize / 2, y);
        const rightCollisionPoint = new Pos(x + screen.tileSize / 2, y);

        // get tile that the player is trying to move to
        const leftCollisionPointTile = scene.getTile(Util.convertWorldPosToTileCoordinate(leftCollisionPoint, this.#game.getScreen()));
        const rightCollisionPointTile = scene.getTile(Util.convertWorldPosToTileCoordinate(rightCollisionPoint, this.#game.getScreen()));

        // if either of the tiles are undefined then the player is trying to move outside the map
        if(leftCollisionPointTile == undefined || rightCollisionPointTile == undefined) {
            return false;
        }

        // get position inside the tile
        const leftSubPos = Util.getSubTileCoordinate(leftCollisionPoint, screen);
        const rightSubPos = Util.getSubTileCoordinate(rightCollisionPoint, screen);
        
        // if one of points is colliding with a collision box then the move is prevented
        if(isColliding(leftSubPos, leftCollisionPointTile.getCollisonRule()) || isColliding(rightSubPos, rightCollisionPointTile.getCollisonRule())) {
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
            return inputHandler.isKeyDown("KeyW") || inputHandler.isKeyDown("KeyS") || inputHandler.isKeyDown("KeyA") || inputHandler.isKeyDown("KeyD");
        }

        // animation keys
        inputHandler.onHold("KeyW", () => {       
            if(inputHandler.isKeyDown("KeyA") || inputHandler.isKeyDown("KeyD")){ return; }
    
            this.#direction = "walkup";
        });
        inputHandler.onRelease("KeyW", () => {
            if(isOtherKeyHeld()){ return; }
            this.#direction = "idleup";
        });
    
        inputHandler.onHold("KeyS", () => {
            if(inputHandler.isKeyDown("KeyA") || inputHandler.isKeyDown("KeyD")){ return; }
            this.#direction = "walkdown";
        });
        inputHandler.onRelease("KeyS", () => {
            if(isOtherKeyHeld()){ return; }
            this.#direction = "idledown";
        });
    
        inputHandler.onHold("KeyA", () => {
            if(inputHandler.isKeyDown("KeyW") || inputHandler.isKeyDown("KeyS")){ return; }
            this.#direction = "walkleft";
        });
        inputHandler.onRelease("KeyA", () => {
            if(isOtherKeyHeld()){ return; }
            this.#direction = "idleleft";
        });
    
        inputHandler.onHold("KeyD", () => {
            if(inputHandler.isKeyDown("KeyW") || inputHandler.isKeyDown("KeyS")){ return; }
            this.#direction = "walkright";
        });
        inputHandler.onRelease("KeyD", () => {
            if(isOtherKeyHeld()){ return; }
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
            new Sprite("assets/mcwalk.png", 2, 0, 0),
        ], duration),
        new CyclicAnimation([
            new Sprite("assets/mcwalk.png", 1, 1, 0),
            new Sprite("assets/mcwalk.png", 2, 1, 0),
        ], duration)
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
            new Sprite("assets/mcwalk.png", 2, 2, 0),
        ], duration),
        new CyclicAnimation([
            new Sprite("assets/mcwalk.png", 1, 3, 0),
            new Sprite("assets/mcwalk.png", 2, 3, 0),
        ], duration)
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
        5: { minX: 0, minY: 0, maxX: 7, maxY: 15 }, // left half collision box
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