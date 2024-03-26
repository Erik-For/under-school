import Tilemap from './tilemap.js';


const canvas: HTMLCanvasElement | null = document.getElementById('game') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx: CanvasRenderingContext2D | null = canvas!.getContext('2d');
if(!ctx) {
    throw new Error('Canvas not found');   
}

let tilemap: Tilemap = new Tilemap("assets/tilemap.png", 16, (src: string) => {
    console.log(tilemap.width, tilemap.height); 
    for(let y = 0; y < tilemap.height/tilemap.tileSize; y++) {
        for(let x = 0; x < tilemap.width/tilemap.tileSize; x++) {
            ctx.drawImage(tilemap.tilemap[y][x], x*(tilemap.tileSize), y*(tilemap.tileSize), tilemap.tileSize, tilemap.tileSize);
        }
    }
});
