import { Tilemap, TilemapLoader } from './tilemap.js';
const canvas = document.getElementById('game');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
if (!ctx) {
    throw new Error('Canvas not found');
}
ctx.clearRect(0, 0, canvas.width, canvas.height);
let tilemap = new Tilemap("assets/tilemap.png", 16, (src) => {
    document.getElementById('loading').style.display = 'none';
    canvas.style.display = 'block';
});
new TilemapLoader([
    { src: "assets/tilemap.png", tileSize: 16 },
], () => {
    document.getElementById('loading').style.display = 'none';
    canvas.style.display = 'block';
});
