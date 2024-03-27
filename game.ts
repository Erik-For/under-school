import { Tilemap, TilemapLoader, TilemapItemEnum} from './tilemap.js';


const canvas: HTMLCanvasElement | null = document.getElementById('game') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx: CanvasRenderingContext2D | null = canvas!.getContext('2d');
if(!ctx) {
    throw new Error('Canvas not found');   
}
ctx.clearRect(0, 0, canvas.width, canvas.height);

let tilemap: Tilemap = new Tilemap("assets/tilemap.png", 16, (src: string) => {
    document.getElementById('loading')!.style.display = 'none';
    canvas.style.display = 'block';
});

new TilemapLoader(
    [
        { src: "assets/tilemap.png", tileSize: 16 },

    ], () => {
        document.getElementById('loading')!.style.display = 'none';
        canvas.style.display = 'block';
    }
)

const tm1 = Object.freeze({
    WATER: new TilemapItemEnum("assets/tilemap.png", 0, 0),
});
