import { Camera, Screen } from "./screen.js";
import { InputHandler } from "./input.js";
import { Player } from "./player.js";
import { ObjectBehaviour, Scene, TileCoordinate, executeBehaviour } from "./scene.js";
import { AssetLoader, AudioAsset } from "./assetloader.js";
import { SequenceExecutor } from "./sequence.js";
import * as Util from "./util.js";
import { Battle } from "./battle.js";

/**
 * Represents a game.
 */
export class Game {
    #scene: Scene;
    #player: Player;
    #camera: Camera;
    #screen: Screen;
    #audioManager: AudioManager;
    #particleManager: ParticleManager;
    #inputHandler: InputHandler;
    #assetLoader: AssetLoader;
    #sequenceExecutor: SequenceExecutor;
    #mode: Mode;
    #battle: Battle;
    
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
        this.#battle = new Battle(this);
        
        setInterval(() => { // Game ticks
            this.#inputHandler.update();
            // check if the player is in a scripted object
            
            this.getCamera().setPosition(this.getPlayer().getPos());
            const playerTilePos = Util.convertWorldPosToTileCoordinate(this.getPlayer().getPos(), this.getScreen());
            if(this.#player.getCanCollide()){
                let scriptedObject = this.#scene.getScriptedObjects().find((scriptedObject) => scriptedObject.pos.equals(playerTilePos.toPos(16)));            
                if(scriptedObject){
                    if (scriptedObject.type === ObjectBehaviour.ConveyorBelt || scriptedObject.type === ObjectBehaviour.ChangeScene) {
                        executeBehaviour(this, this.#scene, scriptedObject.pos, scriptedObject.type, scriptedObject.behaviourData);
                    }
                }
            }
            
            this.#particleManager.update();
        }, Math.round(1000 / 60));
        this.#inputHandler.onClick("KeyZ", () => {
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
            let scriptedObject = this.#scene.getScriptedObjects().find((scriptedObject) => scriptedObject.pos.equals(playerTargetPos.toPos(screen.tileSize)));
            if(scriptedObject && scriptedObject.type === ObjectBehaviour.Interactable){
                executeBehaviour(this, this.#scene, scriptedObject.pos, scriptedObject.type, scriptedObject.behaviourData);
            }
        });
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

    newBattle() {
        this.#battle = new Battle(this);
    }
}

export enum Mode {
    OpenWorld,
    Battle
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