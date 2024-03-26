import Tilemap from './tilemap.js';
const canvas = document.getElementById('game');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
if (!ctx) {
    throw new Error('Canvas not found');
}
let tilemap = new Tilemap("assets/tilemap.png", 16, (src) => {
    console.log(tilemap.width, tilemap.height);
    for (let y = 0; y < tilemap.height / tilemap.tileSize; y++) {
        for (let x = 0; x < tilemap.width / tilemap.tileSize; x++) {
            ctx.drawImage(tilemap.tilemap[y][x], x * (tilemap.tileSize), y * (tilemap.tileSize), tilemap.tileSize, tilemap.tileSize);
        }
    }
});
