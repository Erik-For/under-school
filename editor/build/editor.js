import * as Sprites from './sprite.js';
import { deserilizeScene, serilizeScene, TileCoordinate } from './scene.js';
import { InputHandler } from './input.js';
const canvas = document.getElementById('game');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
const tileSize = 16; // size of tile and sprite
const renderScale = 4;
const modal = document.getElementById('modal');
let modalActive = false;
let selectedSprite = null;
if (!ctx) {
    throw new Error('Canvas not found');
}
ctx.imageSmoothingEnabled = false; //CRISP!, För fräsch pixelart
//ctx.scale(renderScale, renderScale); UUH, vi hanterar det i draw istället
// load all assets
const spriteSheetManager = new Sprites.SpriteSheetLoader([
    { src: "assets/tilemap.png", spriteSize: tileSize },
], () => {
    // delete loading screen when loading is finished
    document.getElementById('loading').style.display = 'none';
    canvas.style.display = 'block';
    let scene = deserilizeScene(sessionStorage.getItem("data") || "{}");
    const camera = { x: 0, y: 0 };
    let input = new InputHandler();
    input.onClick('Space', () => {
        modalActive = !modalActive;
        modal.style.display = modalActive ? 'block' : 'none';
    });
    input.onHold('KeyW', () => {
        camera.y -= 1.5 * renderScale;
    });
    input.onHold('KeyS', () => {
        camera.y += 1.5 * renderScale;
    });
    input.onHold('KeyA', () => {
        camera.x -= 1.5 * renderScale;
    });
    input.onHold('KeyD', () => {
        camera.x += 1.5 * renderScale;
    });
    input.onClick('KeyC', () => {
        confirm("Do you want to copy the current scene? as a JSON string");
        // the following object is non verbose on purpose to reduce scene string size
        navigator.clipboard.writeText(serilizeScene(scene));
    });
    input.onClick('KeyV', () => {
        confirm("Do you want to paste the current scene? as a JSON string");
        navigator.clipboard.readText().then((text) => {
            scene = deserilizeScene(text);
        });
    });
    canvas.addEventListener('click', (event) => {
        if (selectedSprite != null) {
            let x = Math.floor(((camera.x - canvas.width / 2) + event.clientX) / (tileSize * renderScale));
            let y = Math.floor(((camera.y - canvas.height / 2) + event.clientY) / (tileSize * renderScale));
            scene.setTile(new TileCoordinate(x, y), 0, [selectedSprite]);
        }
    });
    setInterval(() => {
        let dataStorage = sessionStorage.setItem("data", serilizeScene(scene));
    }, 5000);
    populateSpritesheetModal(spriteSheetManager);
    render(camera, scene);
    requestAnimationFrame(function gameLoop() {
        input.update();
        render(camera, scene);
        requestAnimationFrame(gameLoop);
    });
});
function render(camera, scene) {
    // Camera bounds
    ctx === null || ctx === void 0 ? void 0 : ctx.clearRect(0, 0, canvas.width, canvas.height);
    let bounds = {
        // Devison by renderScale to get the correct tile coordinate 
        minX: Math.floor((camera.x - canvas.width / 2) / (tileSize * renderScale)),
        maxX: Math.floor((camera.x + canvas.width / 2) / (tileSize * renderScale)),
        minY: Math.floor((camera.y - canvas.height / 2) / (tileSize * renderScale)),
        maxY: Math.floor((camera.y + canvas.height / 2) / (tileSize * renderScale))
    };
    scene.getTiles().forEach((row, ys) => {
        row.forEach((tile, xs) => {
            // Get current x and y as int
            let x = Number(xs);
            let y = Number(ys);
            // Check if the tile is outside the camera view
            if (x < bounds.minX || x > bounds.maxX || y < bounds.minY || y > bounds.maxY) {
                return;
            }
            // Sort tiles after zindex so that the tiles with the highest zindex are drawn last
            Sprites.renderMany(ctx, spriteSheetManager, tile.getSprites(), x * tileSize * renderScale - camera.x + canvas.width / 2, y * tileSize * renderScale - camera.y + canvas.height / 2, tileSize * renderScale, tileSize * renderScale);
        });
    });
}
function populateSpritesheetModal(spriteSheetManager) {
    spriteSheetManager.spritesheets.forEach((spritesheet, src) => {
        const margin = 10 * (spritesheet.width / spritesheet.spriteSize);
        const width = (window.innerWidth - margin) / (spritesheet.width / spritesheet.spriteSize);
        const tileMapSrcText = document.createElement('p');
        tileMapSrcText.innerText = src;
        modal.appendChild(tileMapSrcText);
        spritesheet.getSprites().forEach((row, y) => {
            const rowDiv = document.createElement('div');
            row.forEach((sprite, x) => {
                let a = document.createElement('a');
                a.onclick = () => {
                    selectSprite(src, x, y);
                };
                let c = document.createElement('canvas');
                let cx = c.getContext('2d');
                c.width = width;
                c.height = width;
                cx === null || cx === void 0 ? void 0 : cx.drawImage(sprite, 0, 0, width, width);
                a.appendChild(c);
                rowDiv.appendChild(a);
            });
            modal.appendChild(rowDiv);
        });
        /*
        spritesheet.getSprites().forEach((row, y) => {
            row.forEach((sprite, x) => {
                let a = document.createElement('a');
                a.onclick = () => {
                    selectSprite(src, x, y);
                };
                let c = document.createElement('canvas');
                let cx = c.getContext('2d');
                c.width = width;
                c.height = width;
                cx?.drawImage(sprite, 0, 0, width, width);
                a.appendChild(c);
                modal.appendChild(a);
            });
        });
        */
    });
}
function selectSprite(src, x, y) {
    selectedSprite = new Sprites.Sprite(src, x, y, 5);
}
