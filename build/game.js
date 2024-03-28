import * as Sprites from './sprite.js';
import { deserilizeScene } from './scene.js';
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const spriteSheetLoader = new Sprites.SpriteSheetLoader([
    new Sprites.SpriteSheet("assets/tilemap.png", 16),
    new Sprites.SpriteSheet("assets/mcwalk.png", 16),
], () => {
    var _a;
    // remove loading screen
    (_a = document.getElementById('loading')) === null || _a === void 0 ? void 0 : _a.remove();
    // show the canvas
    canvas.style.display = 'block';
    // start the game
    const scene = deserilizeScene(JSON.parse(localStorage.getItem('scene') || '{}'));
});
