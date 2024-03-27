var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class SpriteSheet {
    constructor(src, tileSize, onLoad) {
        let image = new Image();
        image.src = src;
        this.tileSize = tileSize;
        this.width = 0;
        this.height = 0;
        this.tilemap = [];
        image.onload = (event) => __awaiter(this, void 0, void 0, function* () {
            this.width = (image.width - (image.width % this.tileSize));
            this.height = (image.height - (image.height % this.tileSize));
            const asyncRun = () => __awaiter(this, void 0, void 0, function* () {
                for (let y = 0; y < this.height / this.tileSize; y++) {
                    this.tilemap[y] = [];
                    for (let x = 0; x < this.width / this.tileSize; x++) {
                        let img = yield createImageBitmap(image, x * tileSize, y * tileSize, this.tileSize, this.tileSize);
                        this.tilemap[y][x] = img;
                    }
                }
            });
            yield asyncRun();
            onLoad(src);
        });
    }
    getTile(x, y) {
        return this.tilemap[y][x];
    }
}
export class SpriteSheetLoader {
    constructor(tilemaps, onLoad) {
        this.tilemaps = {};
        let remaining = tilemaps.length;
        setTimeout(() => {
            if (remaining > 0) {
                throw new Error('Tilemap loading timeout');
            }
        }, 3000);
        tilemaps.forEach((tilemap) => {
            let tilemapObj = new SpriteSheet(tilemap.src, tilemap.tileSize, (src) => {
                this.tilemaps[src] = tilemapObj;
                remaining--;
                if (remaining == 0) {
                    onLoad();
                }
            });
        });
        this.tilemaps;
    }
    getTextureTilemap(src) {
        return this.tilemaps[src];
    }
}
export class Sprite {
    constructor(textureTileMapName, x, y, zindex) {
        this.spriteSheetSrc = textureTileMapName;
        this.xOffset = x;
        this.yOffset = y;
        this.zindex = zindex;
    }
}
/**
* Renders ONE and only ONE image per tilemap coordinate
*/
export function render(ctx, spriteSheetLoader, sprite, x, y, width, height) {
    let tilemap = spriteSheetLoader.getTextureTilemap(sprite.spriteSheetSrc);
    if (!tilemap) {
        throw new Error('Tilemap not found');
    }
    ctx.drawImage(tilemap.getTile(sprite.xOffset, sprite.yOffset), x, y, width, height);
}
/**
* Renders multiple images on the same world coordinates ordered by ascending z-index
*/
export function renderMany(ctx, spriteSheetLoader, sprites, x, y, width, height) {
    sprites.sort((a, b) => a.zindex - b.zindex).forEach((sprite) => {
        render(ctx, spriteSheetLoader, sprite, x, y, width, height);
    });
}
