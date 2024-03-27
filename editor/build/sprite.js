var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _SpriteSheet_spritemap;
export class SpriteSheet {
    constructor(src, spriteSize, onLoad) {
        _SpriteSheet_spritemap.set(this, void 0);
        let image = new Image();
        image.src = src;
        this.spriteSize = spriteSize;
        this.width = 0;
        this.height = 0;
        __classPrivateFieldSet(this, _SpriteSheet_spritemap, [], "f");
        image.onload = (event) => __awaiter(this, void 0, void 0, function* () {
            this.width = (image.width - (image.width % this.spriteSize));
            this.height = (image.height - (image.height % this.spriteSize));
            const asyncRun = () => __awaiter(this, void 0, void 0, function* () {
                for (let y = 0; y < this.height / this.spriteSize; y++) {
                    __classPrivateFieldGet(this, _SpriteSheet_spritemap, "f")[y] = [];
                    for (let x = 0; x < this.width / this.spriteSize; x++) {
                        let img = yield createImageBitmap(image, x * spriteSize, y * spriteSize, this.spriteSize, this.spriteSize);
                        __classPrivateFieldGet(this, _SpriteSheet_spritemap, "f")[y][x] = img;
                    }
                }
            });
            yield asyncRun();
            onLoad(src);
        });
    }
    getSprite(x, y) {
        return __classPrivateFieldGet(this, _SpriteSheet_spritemap, "f")[y][x];
    }
    /**
     * @returns a 2D array of ImageBitmaps
     * the first index is the y coordinate and the second index is the x coordinate
     * the ImageBitmaps are the sprites in the spritesheet
    */
    getSprites() {
        return __classPrivateFieldGet(this, _SpriteSheet_spritemap, "f");
    }
}
_SpriteSheet_spritemap = new WeakMap();
/**
 * SpriteSheetLoader is a class that loads multiple spritesheets and stores them in a dictionary
 * it calls the @param onLoad callback when all spritesheets are loaded
 */
export class SpriteSheetLoader {
    constructor(spritesheets, onLoad) {
        let remaining = spritesheets.length;
        this.spritesheets = new Map();
        setTimeout(() => {
            if (remaining > 0) {
                throw new Error('Spritesheet loading timeout');
            }
        }, 5000);
        spritesheets.forEach((spritesheet) => {
            let spritesheetMap = new SpriteSheet(spritesheet.src, spritesheet.spriteSize, (src) => {
                this.spritesheets.set(src, spritesheetMap);
                remaining--;
                if (remaining == 0) {
                    onLoad();
                }
            });
        });
        this.spritesheets;
    }
    getSpriteSheet(src) {
        return this.spritesheets.get(src);
    }
}
export class Sprite {
    constructor(spriteSheetSrc, x, y, zindex) {
        this.spriteSheetSrc = spriteSheetSrc;
        this.xOffset = x;
        this.yOffset = y;
        this.zindex = zindex;
    }
}
/**
* Renders ONE and only ONE sprite per tile
*/
export function render(ctx, spriteSheetLoader, sprite, x, y, width, height) {
    let spritesheet = spriteSheetLoader.getSpriteSheet(sprite.spriteSheetSrc);
    if (!spritesheet) {
        throw new Error('Spritesheet not found');
    }
    ctx.drawImage(spritesheet.getSprite(sprite.xOffset, sprite.yOffset), x, y, width, height);
}
/**
* Renders multiple sprites on the same tile ordered by ascending z-index
*/
export function renderMany(ctx, spriteSheetLoader, sprites, x, y, width, height) {
    sprites.sort((a, b) => a.zindex - b.zindex).forEach((sprite) => {
        render(ctx, spriteSheetLoader, sprite, x, y, width, height);
    });
}
