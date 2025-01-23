import * as Sprites from './sprite.js';
import { deserilizeScene, fadeIn, fadeOut, TileCoordinate } from './scene.js';
import * as Util from './util.js';
import { Screen } from './screen.js';
import { TextAsset, AudioAsset, AssetLoader} from './assetloader.js';
import { Pos, Game, AudioManager, ParticleManager, Mode } from './game.js';
import Keys from './keys.js';

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
        new Sprites.SpriteSheet("assets/mcwalk.png", 16),
        new Sprites.SpriteSheet("assets/collision_boxes.png", 16),
        new Sprites.SpriteSheet("assets/teknik.png", 16),
        new Sprites.SpriteSheet("assets/people.png", 16),
        new Sprites.SpriteSheet("assets/faces.png", 16),
        new Sprites.SpriteSheet("assets/saker.png", 16),
        new Sprites.SpriteSheet("assets/heart.png", 16),
        new Sprites.SpriteSheet("assets/proj1.png", 16),
        new Sprites.SpriteSheet("assets/rootSpike.png", 16),
        new Sprites.SpriteSheet("assets/ingang.png", 16),
        new Sprites.SpriteSheet("assets/dungeon.png", 16),
        new Sprites.SpriteSheet("assets/snowset.png", 16),
        new Sprites.SpriteSheet("assets/sodexo.png", 16),
        new TextAsset("assets/intro.json"),
        new TextAsset("assets/dungeon.json"),
        new TextAsset("assets/snow1.json"),
        new TextAsset("assets/snow2.json"),
        new TextAsset("assets/snow3.json"),
        new TextAsset("assets/test1.json"),
        new TextAsset("assets/teknik.json"),
        new TextAsset("assets/sodexo.json"),
        new TextAsset("assets/cred.json"),
        new AudioAsset("assets/bg.mp3"),
        new AudioAsset("assets/beep.wav"),
        new AudioAsset("assets/rumble.wav"),
        new AudioAsset("assets/textblip.mp3"),
        new AudioAsset("assets/DaftPunkalovania.mp3"),
        new AudioAsset("assets/Whispersofsnow.wav"),
        new AudioAsset("assets/clank1.wav"),
        new AudioAsset("assets/drippin_cave.wav"),
        new AudioAsset("assets/Unknown.wav"),
        new AudioAsset("assets/Underschool.wav"),
        new AudioAsset("assets/slappin_bass.wav"),
        new AudioAsset("assets/Intro.wav"),



    ],
    async () => {
        // remove loading screen
        document.getElementById('loading')!.remove();
        // show the canvas
        canvas.style.display = 'block';
        // start the game


        const screen = new Screen(window.innerWidth, window.innerHeight, 16, ctx);
        let startScene = await deserilizeScene(assetLoader.getTextAsset("assets/intro.json")!.data!);
        let menuScene = await deserilizeScene('{ "tileData": {}, "objectData": {}, "sceneScriptName": "mainmenu.js" }');
        let audioManager = new AudioManager();
        let particleManager = new ParticleManager();
        const game = new Game(startScene, new Pos(-5, 2), screen, audioManager, particleManager, assetLoader);
        game.setScene(menuScene);
        menuScene.onLoad(game, menuScene);

        // --- Start dev code ---
        /*
        game.getInputHandler().onClick(Keys.Debug3, () => {
            game.setMode(game.getMode() === Mode.OpenWorld ? Mode.Battle : Mode.OpenWorld);
            if(game.getMode() === Mode.Battle){
                game.getBattle()?.activate();
            } else {
                game.getBattle()?.deactivate();
            }
        }, true);
        */
        game.getInputHandler().onClick(Keys.Debug2, async () => {
            if(dev){
                let sceneName = prompt("Enter scene name");
                if(sceneName){
                    let scene = await deserilizeScene(assetLoader.getTextAsset("assets/" + sceneName + ".json")!.data!);
                    game.setScene(scene);
                    scene.onLoad(game, scene);
                }
            }
        }, true)

        requestAnimationFrame(function gameLoop() {
            game.getScreen().width = window.innerWidth;
            game.getScreen().height = window.innerHeight;
            game.getScreen().renderScale = Math.floor(zoom * window.innerWidth / 480); // to prevent player from just scrolling out and seeing everything, and 480 is just an arbitrary number
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            ctx.imageSmoothingEnabled = false;
            ctx.font = "underschool";

            if(game.getMode() === Mode.OpenWorld){
                render(game);
                if (dev) {
                    renderDevOverlay(game);
                    renderDevPlayerHitbox(game);
                }
            } else if(game.getMode() === Mode.Battle){
                game.getBattle()?.render(ctx, assetLoader);
            }
            game.getSequenceExecutor().execute(ctx);
            requestAnimationFrame(gameLoop);
        })
    }
);

function render(game: Game): void {
    // Camera bounds
    const screen = game.getScreen();

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
    game.getScene().getScriptedObjects().forEach((object) => {
        let pos = object.pos;
        let tilePos = object.pos.divide(game.getScreen().tileSize).round();
        if (tilePos.x < renderBounds.min.x || tilePos.x > renderBounds.max.x || tilePos.y < renderBounds.min.y || tilePos.y > renderBounds.max.y) {
            return;
        }
        const sprite = object.sprite;
        const canvasPos = Util.convertWorldPosToCanvasPos(pos, game.getCamera().getPosition(), game.getScreen()).round();
        
        Sprites.render(ctx, assetLoader, sprite!, canvasPos.x, canvasPos.y, screen.tileSize * screen.renderScale, screen.tileSize * screen.renderScale);
    });

    game.getPlayer().render(ctx, game);
    game.getScene().onRender(game);
    game.getParticleManager().render(ctx, game);

    if(screen.fadeAlpha != 0){
        ctx.globalAlpha = screen.fadeAlpha;
        ctx.fillRect(0, 0, game.getScreen().width, game.getScreen().height);
    }
}

function renderDevOverlay(game: Game) {
    const playerTilePos = Util.convertWorldPosToTileCoordinate(game.getPlayer().getPos(), game.getScreen());
    const mouseTilePos = Util.convertWorldPosToTileCoordinate(Util.convertCanvasPosToWorldPos(game.getInputHandler().getMousePos(), game.getCamera().getPosition(), game.getScreen()), game.getScreen());

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "lighter 20px Arial";
    ctx.fillText(`Standing on tile: ${playerTilePos.x}, ${playerTilePos.y}`, 10, 30);
    ctx.fillText(`Mouse on tile: ${mouseTilePos.x}, ${mouseTilePos.y}`, 10, 60);
    ctx.fillText(`Scene: ${game.getScene().getScriptName()}`, 10, 90);
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
