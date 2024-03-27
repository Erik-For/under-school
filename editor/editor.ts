import * as Sprites from './sprite.js';
import { Scene, Tile, TileCoordinate } from './scene.js';

const canvas: HTMLCanvasElement = document.getElementById('game') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
const tileSize = 16;
const renderScale = 4;

let selectedTile = null;

if(!ctx) {
    throw new Error('Canvas not found');   
}

ctx.imageSmoothingEnabled = false; //CRISP!, För fräsch pixelart
//ctx.scale(renderScale, renderScale); UUH, vi hanterar det i draw istället

// load all assets
const spriteSheetManager = new Sprites.SpriteSheetLoader (
    [
        { src: "assets/tilemap.png", tileSize: tileSize },

    ], () => { // callback when all assets are loaded
        // delete loading screen when loading is finished
        document.getElementById('loading')!.style.display = 'none';
        canvas.style.display = 'block';


        let scene: Scene = new Scene();
        // for loop in 2 dimensions  -10 -> 10
        for(let x = -5; x < 5; x++) {
            for(let y = -5; y < 5; y++) {
                scene.setTile(new TileCoordinate(x, y), 0, [new Sprites.Sprite("assets/tilemap.png", 1, 5, 0), new Sprites.Sprite("assets/tilemap.png", 5, 9, 1)]);
            }
        }

        const camera = { x: 0, y: 0 };
        render(camera, scene);
    }
);

function render(camera: { x: number, y: number}, scene: Scene): void {
    // Camera bounds
    let bounds = { minX: camera.x - canvas.width / 2, minY: camera.y - canvas.height / 2, maxX: camera.x + canvas.width / 2, maxY: camera.y + canvas.height / 2}
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
            Sprites.renderMany(ctx!, spriteSheetManager, tile.sprites, x * tileSize * renderScale - camera.x + canvas.width / 2, y * tileSize * renderScale - camera.y + canvas.height / 2, tileSize * renderScale, tileSize * renderScale);
        });
    });
}

