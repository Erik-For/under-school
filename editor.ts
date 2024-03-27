import * as Sprites from './sprite.js';
import { deserilizeScene, Scene, serilizeScene, Tile, TileCoordinate } from './scene.js';
import { InputHandler } from './input.js';

const canvas: HTMLCanvasElement = document.getElementById('game') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
const tileSize = 16; // size of tile and sprite
const renderScale = 4;

const modal = document.getElementById('modal') as HTMLDivElement;
let modalActive = false;
let selectedSprite: Sprites.Sprite | null = null;


if(!ctx) {
    throw new Error('Canvas not found');   
}
ctx.imageSmoothingEnabled = false; //CRISP!, För fräsch pixelart
//ctx.scale(renderScale, renderScale); UUH, vi hanterar det i draw istället

// load all assets
const spriteSheetManager = new Sprites.SpriteSheetLoader (
    [
        new Sprites.SpriteSheet("assets/tilemap.png", tileSize),
        new Sprites.SpriteSheet("assets/mcwalk.png", tileSize)
    ], () => { // callback when all assets are loaded

        // delete loading screen when loading is finished
        document.getElementById('loading')!.style.display = 'none';
        canvas.style.display = 'block';

        // load data from session storage, if data is null load an empty object
        let scene: Scene = deserilizeScene(sessionStorage.getItem("data") || "{}");

        // init camera to 0,0
        const camera = { x: 0, y: 0 };

        //create an input handler
        let input = new InputHandler();
        
        // toggle modal
        input.onClick('Space', () => {
            modalActive = !modalActive;
            modal.style.display = modalActive ? 'block' : 'none';
        });
        

        //movement
        input.onHold('KeyW', () => {
            camera.y -= 1.5*renderScale;
        });
        input.onHold('KeyS', () => {
            camera.y += 1.5*renderScale;
        });
        input.onHold('KeyA', () => {
            camera.x -= 1.5*renderScale;
        });
        input.onHold('KeyD', () => {
            camera.x += 1.5*renderScale;
        });

        // copy scene to clipboard as json string
        input.onClick('KeyC', () => {
            if(confirm("Do you want to copy the current scene? as a JSON string")){
                navigator.clipboard.writeText(serilizeScene(scene));
            }
        });

        // load scene from clipboard json string
        input.onClick('KeyV', () => {
            if(confirm("Do you want to paste to the current scene? from a JSON string")){
                navigator.clipboard.readText().then((text) => {
                    scene = deserilizeScene(text);
                });
            }
        });

        // clear scene
        input.onClick('KeyX', () => {
            if(confirm("Do you want to clear the current scene?")){
                scene = new Scene();
            }
        });

        input.trackKey("ShiftLeft")

        // place 
        canvas.addEventListener('click', (event) => {
            if(selectedSprite != null){
                let x = Math.floor(((camera.x - canvas.width / 2) + event.clientX) / (tileSize * renderScale));
                let y = Math.floor(((camera.y - canvas.height / 2) + event.clientY) / (tileSize * renderScale));
                // when holding shift add a sprite to the top of the tile
                // if not holding shift create/replace tile
                if(input.isKeyDown("ShiftLeft")){
                    let tile = scene.getTile(x, y);
                    if(tile != null ){
                        let zindex = tile.getSprites().sort((a,b) => a.zindex - b.zindex)[0].zindex // get the zindex of the top sprite
                        tile.getSprites().push(new Sprites.Sprite(selectedSprite.spriteSheetSrc, selectedSprite.xOffset, selectedSprite.yOffset, zindex)); // create new sprite on the laste sprite
                        return;
                    }
                }
                scene.setTile(new TileCoordinate(x, y), 0, [selectedSprite!]);
            }
        });

        canvas.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            let x = Math.floor(((camera.x - canvas.width / 2) + event.clientX) / (tileSize * renderScale));
            let y = Math.floor(((camera.y - canvas.height / 2) + event.clientY) / (tileSize * renderScale));
            // when holding shift remove the top sprite from the tile
            // if not holding shift delete the tile
            if(input.isKeyDown("ShiftLeft")){
                let tile = scene.getTile(x, y);
                if(tile != null ){
                    if(tile.getSprites().length == 1){
                        scene.removeTile(new TileCoordinate(x, y));
                        return;
                    }
                    tile.getSprites().sort((a,b) => a.zindex - b.zindex).pop(); // remove the last sprite
                    return;
                }
            }
            scene.removeTile(new TileCoordinate(x, y));
        })

        // Save every 5 seconds so that the user does not loose their work and cry
        setInterval(() => {
            sessionStorage.setItem("data", serilizeScene(scene));
        }, 5000);

        populateSpritesheetModal(spriteSheetManager);

        
        requestAnimationFrame(function gameLoop() {
            input.update();
            render(camera, scene);
            requestAnimationFrame(gameLoop);
        });
    }
);

function render(camera: { x: number, y: number}, scene: Scene): void {
    // Camera bounds
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    let bounds = { 
        // Devison by renderScale to get the correct tile coordinate 
        minX: Math.floor((camera.x - canvas.width / 2) / (tileSize * renderScale)),
        maxX: Math.floor((camera.x + canvas.width / 2) / (tileSize * renderScale)),
        minY: Math.floor((camera.y - canvas.height / 2) / (tileSize * renderScale)),
        maxY: Math.floor((camera.y + canvas.height / 2) / (tileSize * renderScale))
    }
    scene.getTiles().forEach((row, ys) => {
        row.forEach((tile, xs) => {
            // Get current x and y as int
            let x =  Number(xs);
            let y =  Number(ys); 
            
            // Check if the tile is outside the camera view
            if(x < bounds.minX || x > bounds.maxX || y < bounds.minY || y > bounds.maxY) {
                return;
            }
            
            // Sort tiles after zindex so that the tiles with the highest zindex are drawn last
            Sprites.renderMany(ctx!, spriteSheetManager, tile.getSprites(), x * tileSize * renderScale - camera.x + canvas.width / 2, y * tileSize * renderScale - camera.y + canvas.height / 2, tileSize * renderScale, tileSize * renderScale);
        });
    });
}

function populateSpritesheetModal(spriteSheetManager: Sprites.SpriteSheetLoader) {
    spriteSheetManager.spritesheets.forEach((spritesheet, src) => {
        const margin = 10*(spritesheet.width/spritesheet.spriteSize);
        const width = Math.min(100, (window.innerWidth - margin) / (spritesheet.width/spritesheet.spriteSize));

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
                let cx: CanvasRenderingContext2D = c.getContext('2d')!;
                cx.imageSmoothingEnabled = false;
                c.width = width;
                c.height = width;
                cx?.drawImage(sprite, 0, 0, width, width);
                a.appendChild(c);
                rowDiv.appendChild(a);
            });
            modal.appendChild(rowDiv);
        });
    });   
}

function selectSprite(src: string, x: number, y: number) {
    selectedSprite = new Sprites.Sprite(src, x, y, 5);
}
