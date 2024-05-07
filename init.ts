import * as Sprites from './sprite.js';
import { deserilizeScene, executeBehaviour, ObjectBehaviour, SceneAsset, TileCoordinate } from './scene.js';
import * as Util from './util.js';
import { Screen } from './screen.js';
import { TextAsset, AudioAsset, AssetLoader} from './assetloader.js';
import { Pos, Game, AudioManager } from './game.js';
import { NPCTextAnimation, NPCTalkingSprite } from './animate.js';
import { Sequence, SequenceItem } from './sequence.js';

const canvas: HTMLCanvasElement = document.getElementById('game') as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;

let dev = false;
const zoom = 1;

document.addEventListener('keydown', (event) => {
    if (event.key === 'p') {
        dev = !dev;
    }
});

const assetLoader = new AssetLoader(
    [
        new Sprites.SpriteSheet("assets/tilemap.png", 16),
        new Sprites.SpriteSheet("assets/mcwalk.png", 16),
        new Sprites.SpriteSheet("assets/collision_boxes.png", 16),
        new Sprites.SpriteSheet("assets/goli.png", 16),
        new Sprites.SpriteSheet("assets/teknik.png", 16),
        new TextAsset("assets/test2.json"),
        new TextAsset("assets/test3.json"),
        new AudioAsset("assets/test.mp3"),
    ],
    async () => {
        // remove loading screen
        document.getElementById('loading')!.remove();
        // show the canvas
        canvas.style.display = 'block';
        // start the game

        const screen = new Screen(window.innerWidth, window.innerHeight, 16);
        let scene = await deserilizeScene(assetLoader.getTextAsset("assets/test2.json")!.data!);
        let audioManager = new AudioManager();
        const game = new Game(scene, new Pos(16, 16), screen, audioManager, assetLoader);
        scene.onLoad(game, scene);
        //testcase! ta bort vid senare tillfälle
        document.addEventListener("keydown", (event) =>{
            if(event.key === "l"){
                game.getCamera().cameraShake(2500, 1.75);
            }

            if(event.key === "r"){
                game.getCamera().toggleRippleEffect();
            }
        });

        game.getInputHandler().onClick("Space", () => {
            assetLoader.getAudioAsset("assets/test.mp3")!.play(); 
        });
        
        //GOOOLII!
        let charecter = new NPCTalkingSprite(
            new Sprites.Sprite("assets/goli.png", 13, 14, 0),
            new Sprites.Sprite("assets/goli.png", 14, 14, 0),
            new Sprites.Sprite("assets/goli.png", 13, 15, 0),
            new Sprites.Sprite("assets/goli.png", 14, 15, 0)
        );

        let sequence = new Sequence([
            new SequenceItem(
                new NPCTextAnimation(charecter, "Hej jag heter Göran, men du kan kalla mig GOLI...", 3000, game.getInputHandler()),
                (item) => {
                    (item as NPCTextAnimation).render(ctx, game);
                }
            ),
            new SequenceItem(
                new NPCTextAnimation(charecter, "Jag är lärare i DAODAC, DVS Arduinokunskap.", 3000, game.getInputHandler()),
                (item) => {
                    (item as NPCTextAnimation).render(ctx, game);
                }
            ),
            new SequenceItem(
                new NPCTextAnimation(charecter, "Själv gillar jag att se på itläraren.se du vet, skåningen, och köra lastbil... Vet du vad....", 3000, game.getInputHandler()),
                (item) => {
                    (item as NPCTextAnimation).render(ctx, game);
                }
            ),
            new SequenceItem(
                new NPCTextAnimation(charecter, "Kom till it support i bibblan 9:30 - 10:15 eller något så kan jag fixa din dator.... Eller din arduino uno eller router eller skrivare eller... Ja, jag kan visst fixa allting.", 5000, game.getInputHandler()),
                (item) => {
                    (item as NPCTextAnimation).render(ctx, game);
                }
            ),
        ])
        game.getSequenceExecutor().setSequence(sequence);
        requestAnimationFrame(function gameLoop() {
            game.getScreen().width = window.innerWidth;
            game.getScreen().height = window.innerHeight;
            game.getScreen().renderScale = Math.floor(zoom * window.innerWidth / 480); // to prevent player from just scrolling out and seeing everything, and 480 is just an arbitrary number
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            ctx.imageSmoothingEnabled = false;
            ctx.font = "underschool";

            render(game);
            if (dev) {
                renderDevOverlay(game);
                renderDevPlayerHitbox(game);

            }
            game.getSequenceExecutor().execute();
            requestAnimationFrame(gameLoop);
        })
    }
);

function render(game: Game): void {
    // Camera bounds
    ctx!.clearRect(0, 0, game.getScreen().width, game.getScreen().height);

    let renderBounds = {
        // Devison by renderScale to get the correct tile coordinate 
        min: Util.convertWorldPosToTileCoordinate(
            Util.convertCanvasPosToWorldPos(new Pos(0, 0), game.getCamera().getPosition(), game.getScreen())
            , game.getScreen()),
        max: Util.convertWorldPosToTileCoordinate(
            Util.convertCanvasPosToWorldPos(new Pos(game.getScreen().width, game.getScreen().height), game.getCamera().getPosition(), game.getScreen())
            , game.getScreen()
        )
    }

    game.getScene().getTiles().forEach((row, ys) => {
        let screen = game.getScreen();
        // Get row y as int
        let y = Number(ys);

        row.forEach((tile, xs) => {
            // Get current tiles y as int
            let x = Number(xs);

            // Check if the tile is outside the camera view
            if (x < renderBounds.min.x || x > renderBounds.max.x || y < renderBounds.min.y || y > renderBounds.max.y) {
                // if(x <= renderBounds.min.x || x >= renderBounds.max.x || y <= renderBounds.min.y || y >= renderBounds.max.y) { // try this to se how it looks to build understanding
                return;
            }
            let pos = Util.convertWorldPosToCanvasPos(Util.convertTileCoordinateToWorldPos(new TileCoordinate(x, y), game.getScreen()), game.getCamera().getPosition(), game.getScreen()).round();
            let xPos = pos.x;
            let yPos = pos.y;

            // Sort tiles after zindex so that the tiles with the highest zindex are drawn last
            Sprites.renderMany(ctx!, assetLoader, tile.getSprites(),
                xPos,
                yPos,
                screen.tileSize * screen.renderScale,
                screen.tileSize * screen.renderScale
            );

            // draw collision boxes if in dev mode
            if (dev) {
                ctx.globalAlpha = 0.4;
                ctx.drawImage(assetLoader.getSpriteSheet("assets/collision_boxes.png")!.getSprite(tile.getCollisonRule(), 0),
                    xPos,
                    yPos,
                    screen.tileSize * screen.renderScale,
                    screen.tileSize * screen.renderScale
                );
                ctx.globalAlpha = 1;
            }
        });
    });
    game.getPlayer().render(ctx, game);
    game.getScene().onRender(game);
}

function renderDevOverlay(game: Game) {
    const playerTilePos = Util.convertWorldPosToTileCoordinate(game.getPlayer().getPos(), game.getScreen());
    const mouseTilePos = Util.convertWorldPosToTileCoordinate(Util.convertCanvasPosToWorldPos(game.getInputHandler().getMousePos(), game.getCamera().getPosition(), game.getScreen()), game.getScreen());

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "lighter 20px Arial";
    ctx.fillText(`Standing on tile: ${playerTilePos.x}, ${playerTilePos.y}`, 10, 30);
    ctx.fillText(`Mouse on tile: ${mouseTilePos.x}, ${mouseTilePos.y}`, 10, 60);
}

function renderDevPlayerHitbox(game: Game) {
    const camera = game.getCamera();
    const screen = game.getScreen();
    const player = game.getPlayer();

    const leftCollisionPoint = new Pos(player.x -screen.tileSize / 2, player.y);
    const rightCollisionPoint = new Pos(player.x + screen.tileSize / 2, player.y);

    const leftPoint = Util.convertWorldPosToCanvasPos(leftCollisionPoint, camera.getPosition(), screen);
    const rightPoint = Util.convertWorldPosToCanvasPos(rightCollisionPoint, camera.getPosition(), screen);

    ctx.fillStyle = "#FF0000";
    ctx.fillRect(Math.round(leftPoint.x), Math.round(leftPoint.y), 1, 1);
    ctx.fillRect(Math.round(rightPoint.x), Math.round(rightPoint.y), 1, 1);
}
