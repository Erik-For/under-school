import { Camera, Screen } from "./screen.js";
import { InputHandler } from "./input.js";
import { Player } from "./player.js";
import { ObjectBehaviour, Scene, Tile, TileCoordinate, executeBehaviour, fadeOut } from "./scene.js";
import { AssetLoader, AudioAsset } from "./assetloader.js";
import { Sequence, SequenceExecutor, SequenceItem, WaitSequenceItem } from "./sequence.js";
import * as Util from "./util.js";
import { Battle, Enemy, HomingProjectile, LoopingHomingProjectile, Round, StraightProjectile } from "./battle.js";
import Keys from "./keys.js";
import {BigSprite, TextAnimation, TextAnimationNoInteract} from "./animate.js";
import {render, Sprite, SpriteSheet} from "./sprite.js";

/**
 * Represents a game.
 */
export class Game {
    #scene: Scene;
    #player: Player;
    #camera: Camera;
    #screen: Screen;
    #gameState: GameState = new GameState();
    #audioManager: AudioManager;
    #particleManager: ParticleManager;
    #inputHandler: InputHandler;
    #assetLoader: AssetLoader;
    #sequenceExecutor: SequenceExecutor;
    #mode: Mode;
    #battle: Battle | undefined;
    #lastTickTime: number = 0;
    
    /**
     * Creates a new instance of the Game class.
     * @param scene The inital scene of the game.
     * @param startPos The starting position of the player.
     * @param screen The screen for rendering the game.
     * @param assetLoader The asset loader of the game.
    */
   constructor(scene: Scene, startPos: Pos, screen: Screen, audioManager: AudioManager, particleManager: ParticleManager, assetLoader: AssetLoader) {
        this.#screen = screen;
        this.#assetLoader = assetLoader;
        this.#scene = scene;
        this.#audioManager = audioManager;
        this.#particleManager = particleManager;
        this.#camera = new Camera(startPos.x, startPos.y);
        this.#inputHandler = new InputHandler();
        this.#player = new Player(startPos.x, startPos.y, this);
        this.#sequenceExecutor = new SequenceExecutor();
        this.#mode = Mode.OpenWorld;

        //TSTKOD FÖR BATTLE FIxa Notera Att en bild ska ha munnen öppen för att prata
        let projectiles = [];
        let projectiles2 = [];
        let projectiles3 = [];
        let projectiles4 = [];
        let projectiles5 = [];
        let projectiles6 = [];
        let projectiles7 = [];
        let projectiles8 = [];
        let projectiles9 = [];
        let projectiles10 = [];
        let projectiles11 = [];
        let projectiles12 = [];
        let projectiles13 = [];
        let projectiles14 = [];
        let projectiles15 = [];
        let projectiles16 = [];
        let projectiles17 = [];
        let projectiles18 = [];
        let projectiles19 = [];
        let projectiles20 = [];
        let projectiles21 = [];
        let projectiles22 = [];
        let projectiles23 = [];
        let projectiles24 = [];
        let projectiles25 = [];
        let projectiles26 = [];
        let projectiles27 = [];

        let antal = 10;
        for(let i = 0; i < antal; i++){
            let x = Math.cos(2*Math.PI*i/antal);
            let y = Math.sin(2*Math.PI*i/antal);
            projectiles.push(new LoopingHomingProjectile(new Pos(50+x*70, 50+y*70), 5*60, new Sprite("assets/rootSpike.png", 0, 0, 0), 0.75));
            projectiles2.push(new StraightProjectile(new Pos(50+x*100, 50+y*100), 3*60, new Sprite("assets/rootSpike.png", 0, 0, 0), 1.5, Math.atan2(y, x)));
            projectiles3.push(new StraightProjectile(new Pos(-50, 100/11 * i), 3*60, new Sprite("assets/rootSpike.png", 0, 0, 0), 1.5, 0));
            projectiles4.push(new StraightProjectile(new Pos(150, 100/11 * i), 3*60, new Sprite("assets/rootSpike.png", 0, 0, 0), 1.5, Math.PI));
            projectiles5.push(new StraightProjectile(new Pos(100/11*i, 150), 3*60, new Sprite("assets/rootSpike.png", 0, 0, 0), 1.5, Math.PI/2));
            projectiles6.push(new StraightProjectile(new Pos(100/11*i, -50), 3*60, new Sprite("assets/rootSpike.png", 0, 0, 0), 1.5, 3*Math.PI/2));
            projectiles7.push(new StraightProjectile(new Pos(-50, 100/11 * i), 3*60, new Sprite("assets/rootSpike.png", 0, 0, 0), 1.5, 0));
            projectiles8.push(new StraightProjectile(new Pos(150, 100/11 * i), 3*60, new Sprite("assets/rootSpike.png", 0, 0, 0), 1.5, Math.PI));
            projectiles9.push(new StraightProjectile(new Pos(100/11*i, 150), 3*60, new Sprite("assets/rootSpike.png", 0, 0, 0), 1.5, Math.PI/2));
            projectiles10.push(new StraightProjectile(new Pos(100/11*i, -50), 3*60, new Sprite("assets/rootSpike.png", 0, 0, 0), 1, 3*Math.PI/2));
            projectiles11.push(new LoopingHomingProjectile(new Pos(50+x*70, 50+y*70), 5*60, new Sprite("assets/rootSpike.png", 0, 0, 0), 0.75));
            projectiles12.push(new StraightProjectile(new Pos(50+x*100, 50+y*100), 3*60, new Sprite("assets/rootSpike.png", 0, 0, 0), 1.5, Math.atan2(y, x)));
            projectiles13.push(new LoopingHomingProjectile(new Pos(50+x*70, 50+y*70), 5*60, new Sprite("assets/rootSpike.png", 0, 0, 0), 0.75));
            projectiles14.push(new StraightProjectile(new Pos(50+x*100, 50+y*100), 3*60, new Sprite("assets/rootSpike.png", 0, 0, 0), 1.5, Math.atan2(y, x)));
            projectiles15.push(new StraightProjectile(new Pos(-50, 100/11 * i), 3*60, new Sprite("assets/rootSpike.png", 0, 0, 0), 1.5, 0));
            projectiles16.push(new StraightProjectile(new Pos(150, 100/11 * i), 3*60, new Sprite("assets/rootSpike.png", 0, 0, 0), 1.5, Math.PI));
            projectiles17.push(new StraightProjectile(new Pos(100/11*i, 150), 3*60, new Sprite("assets/rootSpike.png", 0, 0, 0), 1.5, Math.PI/2));
            projectiles18.push(new StraightProjectile(new Pos(100/11*i, -50), 3*60, new Sprite("assets/rootSpike.png", 0, 0, 0), 1, 3*Math.PI/2));
            projectiles19.push(new LoopingHomingProjectile(new Pos(50+x*70, 50+y*70), 5*60, new Sprite("assets/rootSpike.png", 0, 0, 0), 0.75));
            projectiles20.push(new StraightProjectile(new Pos(50+x*100, 50+y*100), 3*60, new Sprite("assets/rootSpike.png", 0, 0, 0), 1.5, Math.atan2(y, x)));
            projectiles21.push(new LoopingHomingProjectile(new Pos(50+x*70, 50+y*70), 5*60, new Sprite("assets/rootSpike.png", 0, 0, 0), 0.75));
            projectiles22.push(new StraightProjectile(new Pos(50+x*100, 50+y*100), 3*60, new Sprite("assets/rootSpike.png", 0, 0, 0), 1.5, Math.atan2(y, x)));
            projectiles23.push(new StraightProjectile(new Pos(-50, 100/11 * i), 3*60, new Sprite("assets/rootSpike.png", 0, 0, 0), 1.5, 0));
            projectiles24.push(new StraightProjectile(new Pos(150, 100/11 * i), 3*60, new Sprite("assets/rootSpike.png", 0, 0, 0), 1.5, Math.PI));
            projectiles25.push(new LoopingHomingProjectile(new Pos(50+x*70, 50+y*70), 5*60, new Sprite("assets/rootSpike.png", 0, 0, 0), 0.75));
            projectiles26.push(new StraightProjectile(new Pos(50+x*100, 50+y*100), 3*60, new Sprite("assets/rootSpike.png", 0, 0, 0), 1.5, Math.atan2(y, x)));
            projectiles27.push(new StraightProjectile(new Pos(-50, 100/11 * i), 3*60, new Sprite("assets/rootSpike.png", 0, 0, 0), 1.5, 0));
        }
        this.#battle = new Battle(this, new Enemy(100, new BigSprite(
            new Sprite("assets/faces.png", 26, 0, 0),
            new Sprite("assets/faces.png", 27, 0, 0),
            new Sprite("assets/faces.png", 26, 1, 0),
            new Sprite("assets/faces.png", 27, 1, 0)
        )), [new Round(new Sequence([
            new SequenceItem(new TextAnimationNoInteract( "Du kommer bli mat för min köttfärssås hahahahhahaha", 1000, 1000), (item, ctx) => {
                (item as TextAnimation).render(ctx, this);
            })
        ]), projectiles), new Round(new Sequence([
            new SequenceItem(new TextAnimationNoInteract("Varför försöker du ens?", 1000*1, 1000*2), (item, ctx) => {
                (item as TextAnimation).render(ctx, this);
            })
        ]),[new LoopingHomingProjectile(new Pos(50, 50), 3*60, new Sprite("assets/rootSpike.png", 0, 0, 0), 1.25)]), new Round(new Sequence([]), projectiles2), new Round(new Sequence([]), projectiles3), new Round(new Sequence([]), projectiles4), new Round(new Sequence([]), projectiles5), new Round(new Sequence([]), projectiles6), new Round(new Sequence([]), projectiles7), new Round(new Sequence([]), projectiles8), new Round(new Sequence([]), projectiles9), new Round(new Sequence([]), projectiles10), new Round(new Sequence([
            new SequenceItem(new TextAnimationNoInteract("Du är envis, men jag är starkare!", 1500, 1000*2), (item, ctx) => {
                (item as TextAnimation).render(ctx, this);
            })
        ]), projectiles11), new Round(new Sequence([]), projectiles12), new Round(new Sequence([]), projectiles13), new Round(new Sequence([]), projectiles14), new Round(new Sequence([]), projectiles15), new Round(new Sequence([]), projectiles16), new Round(new Sequence([]), projectiles17), new Round(new Sequence([]), projectiles18), new Round(new Sequence([]), projectiles19), new Round(new Sequence([]), projectiles20), new Round(new Sequence([]), projectiles21), new Round(new Sequence([
            new SequenceItem(new TextAnimationNoInteract("Ge upp nu, du har ingen chans!", 1500, 1000*2), (item, ctx) => {
                (item as TextAnimation).render(ctx, this);
            })
        ]), projectiles22), new Round(new Sequence([]), projectiles23), new Round(new Sequence([]), projectiles24), new Round(new Sequence([]), projectiles25), new Round(new Sequence([]), projectiles26), new Round(new Sequence([]), projectiles27), new Round(new Sequence([
            new SequenceItem(new TextAnimationNoInteract("Hur kunde du överleva min köttfärssås?", 1500, 1000*2), (item, ctx) => {
                (item as TextAnimation).render(ctx, this);
            }),
            new SequenceItem(new TextAnimationNoInteract("Nej!!!!!!!!!!!!!!!!!", 1500, 1000*2), (item, ctx) => {
                (item as TextAnimation).render(ctx, this);
            }),
        ]), [])]);
        
        this.#lastTickTime = Date.now();
        setInterval(() => { // Game ticks
            this.#inputHandler.update();

            
            // check if the player is in a scripted object
            
            this.getCamera().setPosition(this.getPlayer().getPos());
            const playerTilePos = Util.convertWorldPosToTileCoordinate(this.getPlayer().getPos(), this.getScreen());
            if(this.#player.getCanCollide()){
                let scriptedObject = this.#scene.getScriptedObjects().find((scriptedObject) => scriptedObject.pos.equals(playerTilePos.toPos(16)));            
                if(scriptedObject){
                    if (scriptedObject.type === ObjectBehaviour.ConveyorBelt || scriptedObject.type === ObjectBehaviour.ChangeScene || scriptedObject.type === ObjectBehaviour.Walkable) {
                        executeBehaviour(this, this.#scene, scriptedObject.pos, scriptedObject.type, scriptedObject.behaviourData);
                    }
                }
            }

            const isIce = (tile: Tile) => tile.getSprites().find(sprite => sprite.spriteSheetSrc === "assets/snowset.png" && 2 <= sprite.xOffset && sprite.xOffset <= 4 && 4 <= sprite.yOffset && sprite.yOffset <= 6)

            // console.log(scene.getTile(playerTilePos));            
            
            if(this.#scene.getTile(playerTilePos) && isIce(this.#scene.getTile(playerTilePos)!)){
                this.getInputHandler().preventInteraction();
                this.getPlayer().freezeMovment();
                
                const range = 1;
                const newPos = calculateNewPosition(this.getPlayer().getPos(), this.getPlayer().getDirection(), range);
                
                const newTileCoordinate = newPos.divide(16).floor().toTileCoordinate();

                if(!isIce(this.getScene().getTile(newTileCoordinate)!)){
                    this.getPlayer().unfreezeMovment();
                    this.getInputHandler().allowInteraction();

                    this.getPlayer().setPos(calculateNewPosition(this.getPlayer().getPos(), this.getPlayer().getDirection(), 3));
                } else {
                    this.getPlayer().setPos(newPos);
                }
                
            }
            this.#battle?.tick();
            this.#particleManager.update();
            this.#lastTickTime = Date.now();
        }, Math.round(1000 / 60));


        this.#inputHandler.onClick(Keys.Interact, () => {
            // calculate tile in front of player ( 8 pixels in front of player)
            const playerPos = this.getPlayer().getPos();
            const playerDirection = this.getPlayer().getDirection();
            let range = 12;
            switch (playerDirection) {
                case "up":
                    playerPos.y -= range;
                    break;
                case "down":
                    playerPos.y += range;
                    break;
                case "left":
                    playerPos.x -= range;
                    break;
                case "right":
                    playerPos.x += range;
                    break;
            }
            const playerTargetPos = Util.convertWorldPosToTileCoordinate(playerPos, this.getScreen());
            this.getScene().callOnInteraction(this, this.#scene, playerTargetPos.toPos(1), "");
            let scriptedObject = this.#scene.getScriptedObjects().find((scriptedObject) => scriptedObject.pos.equals(playerTargetPos.toPos(screen.tileSize)))!;
            if((scriptedObject && (scriptedObject.type === ObjectBehaviour.Interactable) || scriptedObject.type === ObjectBehaviour.Sign) || scriptedObject.type === ObjectBehaviour.Button){
                executeBehaviour(this, this.#scene, scriptedObject.pos, scriptedObject.type, scriptedObject.behaviourData);
            }
        });
    }
    
    getGameState() {
        return this.#gameState;
    }

    /**
     * Gets the player of the game.
     * @returns The player object.
    */
   getPlayer(): Player {
       return this.#player;
    }

    /**
     * Gets the scene of the game.
     * @returns The scene object.
    */
   getScene(): Scene {
       return this.#scene;
    }
    
    /**
     * Gets the camera of the game.
     * @returns The camera object.
    */
   getCamera(): Camera {
       return this.#camera;
    }
    
    /**
     * Gets the screen of the game.
     * @returns The screen object.
     */
    getScreen(): Screen {
        return this.#screen;
    }

    /**
     * Gets the audio manager of the game.
     * @returns The audio manager object.
    */
   getAudioManager(): AudioManager {
       return this.#audioManager;
    }

    /**
     * Gets the particle manager of the game.
     * @returns The particle manager object.
    */
    getParticleManager(): ParticleManager {
        return this.#particleManager;
    }
    
    /**
     * Gets the input handler of the game.
     * @returns The input handler object.
    */
   getInputHandler(): InputHandler {
       return this.#inputHandler;
    }
    
    /**
     * Sets the scene of the game.
     * @param scene The new scene object.
    */
   setScene(scene: Scene) {
       this.#scene = scene;
    }

    /**
     * Gets the asset loader of the game.
     * @returns The asset loader object.
     */
    getAssetLoader(): AssetLoader {
        return this.#assetLoader;
    }

    /**
     * Retrieves the sequence executor.
     * @returns The sequence executor.
     */
    getSequenceExecutor(): SequenceExecutor {
        return this.#sequenceExecutor;
    }
    
    /**
     * Retrieves the current mode of the game.
     * @returns The current mode of the game.
    */
    getMode(): Mode {
       return this.#mode;
    }
    
    setMode(mode: Mode) {
        this.#mode = mode;
        switch(mode) {
            case Mode.OpenWorld:                
                this.#player.unfreezeMovment();
                this.#inputHandler.allowInteraction();
                break;
            case Mode.Battle:
                this.#player.freezeMovment();
                this.#inputHandler.preventInteraction();
                break;
        }
    }
    
    getBattle() {
        return this.#battle;
    }

    newBattle(enemy: Enemy, rounds: Round[]) {
        this.#battle = new Battle(this, enemy, rounds);
    }

    getTimeSinceLastTick(): number {
        return Date.now() - this.#lastTickTime;
    }
}

export enum Mode {
    OpenWorld,
    Battle,
}


export class Pos {
    x: number;
    y: number;
    
    /**
     * Contains information about the position
     * @param x - the x position
     * @param y - the y position
    */
   constructor(x: number, y: number) {
       this.x = x;
       this.y = y;
    }
    
    /**
     * Adds the given position to this position
     * @param pos - the position to add
     * @returns the new position
    */
   add(pos: Pos): Pos {
       return new Pos(this.x + pos.x, this.y + pos.y);
    }
    
    /**
     * Subtracts the given position from this position
     * @param pos - the position to subtract
     * @returns the new position
    */
   minus(pos: Pos): Pos {
       return new Pos(this.x - pos.x, this.y - pos.y);
    }
    
    /**
     * Multiplies this position by the given scalar value
     * @param scalar - the scalar value to multiply by
     * @returns the new position
    */
   multiply(scalar: number): Pos {
       return new Pos(this.x * scalar, this.y * scalar);
    }
    
    /**
     * Divides this position by the given scalar value
     * @param scalar - the scalar value to divide by
     * @returns the new position
    */
   divide(scalar: number): Pos {
       return new Pos(this.x / scalar, this.y / scalar);
    }
    
    /**
     * Converts this position to a TileCoordinate
     * @returns the new TileCoordinate
    */
   toTileCoordinate(): TileCoordinate {
       return new TileCoordinate(this.x, this.y);
    }
    
    /**
     * Rounds the x and y values of this position to the nearest integer
     * @returns the new position
    */
    round(): Pos {
        return new Pos(Math.round(this.x), Math.round(this.y));
    }
    
    floor(): Pos {
        return new Pos(Math.floor(this.x), Math.floor(this.y));
    }
    /**
     * Returns a new position with the absolute values of the x and y values of this position
     * @returns the new position
    */
   abs(): Pos {
       return new Pos(Math.abs(this.x), Math.abs(this.y));
    }
    
    /**
     * Returns the length of this position
     * @returns the length
    */
   equals(pos: Pos): boolean {
       return this.x == pos.x && this.y == pos.y;
    }
    
    /**
     * Returns the normalized version of this position
     * @returns the normalized position
    */
   normalize(): Pos {
       let length = Math.sqrt(this.x * this.x + this.y * this.y);
       return new Pos(this.x / length, this.y / length);
    }

    /**
     * Returns the distance between this position and another position
     * @param pos - the other position
     * @returns the distance
    */
    distance(arg0: Pos) {
        return Math.sqrt((this.x - arg0.x) ** 2 + (this.y - arg0.y) ** 2);
    }
}

//example usage code
//game.getAudioManager().playSoundEffect(assetLoader.getAudioAsset("assets/test.mp3")!);
export class AudioManager {
    #backGroundMusic: AudioAsset | undefined;
    #volume: number;

    constructor() {
        this.#backGroundMusic;
        this.#volume = 1;
    }

    /**
     * Plays a sound effect.
     * @param audio The audio asset to play.
     */
    playSoundEffect(audio: AudioAsset): void {
        audio.audio.volume = this.#volume;
        audio.play();
    }

    /**
     * Sets and plays a background music track.
     * @param audio The audio asset to play.
     */
    playBackgroundMusic(audio: AudioAsset): void {
        if(this.#backGroundMusic) {
            this.#backGroundMusic.audio.pause();
        }
        this.#backGroundMusic = audio;
        this.#backGroundMusic.audio.volume = this.#volume;
        this.#backGroundMusic.audio.loop = true;
        this.#backGroundMusic.play();
    }

    /**
     * Pauses the background music.
     */
    pauseBackgroundMusic(): void {
        if(this.#backGroundMusic) {
            this.#backGroundMusic.audio.pause();
        }
    }

    /**
     * Resumes the background music.
     */
    resumeBackgroundMusic(): void {
        if(this.#backGroundMusic) {
            this.#backGroundMusic.audio.play();
        }
    }

    /**
     * Sets the current volume of the audio manager.
     * Immediately changes the volume of the background music if it is playing.
     * @param volume The volume to set.
     */
    setVolume(volume: number): void {
        this.#volume = volume;
        if(this.#backGroundMusic) {
            this.#backGroundMusic.audio.volume = volume;
        }
    }
}

export class Particle {
    pos: Pos;
    velocity: Pos;
    lifeTime: number;
    image: ImageBitmap;
    useGravity: boolean;

    constructor(pos: Pos, velocity: Pos, lifeTime: number, image: ImageBitmap, gravity: boolean = false) {
        this.pos = pos;
        this.velocity = velocity;
        this.lifeTime = lifeTime;
        this.image = image;
        this.useGravity = gravity;
    }

    update() {
        this.pos = this.pos.add(this.velocity);

        if(this.useGravity){
            this.velocity.y += 9.82 / 350;
        }
        this.lifeTime--;
    }

    render(ctx: CanvasRenderingContext2D, game: Game){
        let canvasPos = Util.convertWorldPosToCanvasPos(this.pos, game.getCamera().getPosition(), game.getScreen());
        ctx.drawImage(this.image, canvasPos.x, canvasPos.y);
    }
}

export class Snow extends Particle {
    #rot: number;
    #initialX: number;
    #jitterFrequency: number;

    constructor(pos: Pos, lifeTime: number, image: ImageBitmap) {
        super(pos, new Pos(0, 0.25), lifeTime, image, false); // Constant downward velocity
        this.#initialX = pos.x;
        this.#rot = Math.random() * Math.PI * 2;
        this.#jitterFrequency = Math.random() * 0.05 + 0.05; // Random frequency for jitter
    }

    update() {
        this.pos.y += this.velocity.y;
        this.pos.x = this.#initialX + Math.sin(this.lifeTime * this.#jitterFrequency) * 3; // Jitter left and right
        this.lifeTime--;
    }

    render(ctx: CanvasRenderingContext2D, game: Game) {
        let canvasPos = Util.convertWorldPosToCanvasPos(this.pos, game.getCamera().getPosition(), game.getScreen());
        // Into rotera det är onödigt Util.drawImageRot(ctx, this.image, canvasPos, 4, 4, this.#rot);
        ctx.drawImage(this.image, canvasPos.x, canvasPos.y, 4, 4);
    }
}

export class BurstParticle extends Particle {
    constructor(pos: Pos, image: ImageBitmap) {
        super(pos, new Pos(0, 0), Math.random() * 30 + 30, image, false);

        this.velocity = new Pos(Math.random() * 2 - 1, Math.random() * 2 - 1); // Random velocity
        this.velocity.x *= 0.5; // Adjust the speed of the burst particles
        this.velocity.y *= 0.5; // Adjust the speed of the burst particles
    }

    update(): void {
        this.pos = this.pos.add(this.velocity);
        this.lifeTime--;
    }

    render(ctx: CanvasRenderingContext2D, game: Game): void {
        let canvasPos = Util.convertWorldPosToCanvasPos(this.pos, game.getCamera().getPosition(), game.getScreen());
        ctx.drawImage(this.image, canvasPos.x, canvasPos.y, 4, 4); // Draw the burst particle
    }


}

export class Star extends Particle {
    #rot: number;
    #fadeSpeed: number;
    #fadeOut: boolean;
    #fade: number;

    constructor(pos: Pos, lifeTime: number, image: ImageBitmap) {
        super(pos, new Pos(0, 0), lifeTime, image, false); // No velocity
        this.#rot = Math.random() * Math.PI * 2;
        this.#fadeSpeed = Math.random() * 0.05 + 0.05; // Random fade speed
        this.#fadeOut = false;
        this.#fade = 1;
    }

    update(): void {
        if(this.#fadeOut) {
            this.#fade -= this.#fadeSpeed;
            if(this.#fade <= 0) {
                this.lifeTime = 0; // Remove the particle when it is fully faded out
            }
        } else {
            this.#fade += this.#fadeSpeed;
            if(this.#fade >= 1) {
                this.#fadeOut = true; // Start fading out after reaching full brightness
            }
        }
    }

    render(ctx: CanvasRenderingContext2D, game: Game): void {
        ctx.globalAlpha = this.#fade; // Set the alpha for fading effect
        Util.drawImageRot(ctx, this.image, this.pos, 4, 4, this.#rot);
        ctx.globalAlpha = 1; // Reset alpha to 1 for other drawings
    }
}

export class ParticleManager{
    particles: Particle[];

    constructor(){
        this.particles = [];
    }

    addParticle(particle: Particle){
        this.particles.push(particle);
    }

    update(){
        this.particles.forEach(particle => {
            particle.update();
        });
        this.particles = this.particles.filter(particle => particle.lifeTime > 0);
    }

    render(ctx: CanvasRenderingContext2D, game: Game){
        this.particles.forEach(particle => {
            particle.render(ctx, game);
        });
    }

}

function calculateNewPosition(currentPos: Pos, direction: string, range: number): Pos {
    const newPos = new Pos(currentPos.x, currentPos.y);
    
    switch (direction) {
        
        case "up":
            newPos.y -= range;
            break;
        case "down":
            newPos.y += range;
            break;
        case "left":
            newPos.x -= range;
            break;
        case "right":
            newPos.x += range;
            break;
    }
    
    return newPos;
}

export class GameState {
    hasPlayedJohannesLektionCutScene: boolean;
    //minigame related
    hasPlayedMinigame: boolean;
    hasWonMinigame: boolean;
    hasReachedHighScoreThreshold: boolean;
    hasRecievedKey: boolean;
    goliCutScene1: boolean;
    hasTalkedToRuben: boolean;
    //
    hasTalkedToTeacherRoomMartin: boolean;
    hasSolvedIcePuzzle: boolean;
    hasReadExplosiveSign: boolean;
    hasStartedBattle: boolean;
    hasTalkedToKim: boolean;

    constructor(){
        this.hasPlayedJohannesLektionCutScene = false; // ändra tillbaka till false innan push
        //minigame related
        this.hasPlayedMinigame = false;
        this.hasWonMinigame = false;
        this.hasReachedHighScoreThreshold = false;
        this.hasRecievedKey = false;
        this.goliCutScene1 =  false;
        this.hasTalkedToRuben = false;
        //
        this.hasTalkedToTeacherRoomMartin = false;
        this.hasSolvedIcePuzzle = false;
        this.hasReadExplosiveSign = false;
        this.hasStartedBattle = false;
        this.hasTalkedToKim = false;
    }
}
