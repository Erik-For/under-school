import * as Sprites from './sprite.js';
import { deserilizeScene, Scene, serilizeScene, Tile, TileCoordinate } from './scene.js';
import { InputHandler } from './input.js';

const canvas: HTMLCanvasElement = document.getElementById('game') as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;

const spriteSheetLoader = new Sprites.SpriteSheetLoader(
    [
        new Sprites.SpriteSheet("assets/tilemap.png", 16),
        new Sprites.SpriteSheet("assets/mcwalk.png", 16),
    ],
    () => {
        // remove loading screen
        document.getElementById('loading')?.remove();
        // show the canvas
        canvas.style.display = 'block';
        // start the game
        
        const scene = deserilizeScene(JSON.parse(localStorage.getItem('scene') || '{}'));
        
    }
);