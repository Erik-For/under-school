import { Asset, AssetLoader } from "./assetloader";

export class SpriteSheet implements Asset {
    #spritemap: Array<Array<ImageBitmap>>;
    src: string;
    width: number;
    height: number;
    spriteSize: number;

    /**
     * SpriteSheet is a class that loads a spritesheet and stores the sprites in a 2D array
     * @param src - the source of the spritesheet
     * @param spriteSize - the size of the sprites in the spritesheet
    */
    constructor(src: string, spriteSize: number){
        this.src = src;
        this.spriteSize = spriteSize;
        this.width = 0;
        this.height = 0;
        this.#spritemap = [];
    }

    /** 
     * @returns a promise that resolves when the spritesheet is loaded
     * the promise resolves with the src of the spritesheet
     * the promise rejects with an error message
     */
    load(): Promise<string> {
        const promise = new Promise<string>((reslove, reject) => {

            let image = new Image();
            image.src = this.src;
            image.onload = async (event) => {
                this.width = (image.width - (image.width % this.spriteSize));
                this.height = (image.height - (image.height % this.spriteSize));
    
                const asyncRun = async () => {
                    for(let y = 0; y < this.height/this.spriteSize; y++) {
                        this.#spritemap[y] = [];
                        for(let x = 0; x < this.width/this.spriteSize; x++) {
                            let img: ImageBitmap = await createImageBitmap(image, x*this.spriteSize, y*this.spriteSize, this.spriteSize, this.spriteSize);
                            this.#spritemap[y][x] = img;
                        }
                    }
                }
                await asyncRun();
                reslove(this.src);
            }
        });
        return promise;
    }

    /**
     * @param x - the x coordinate of the sprite in the spritesheet
     * @param y - the y coordinate of the sprite in the spritesheet
     * @returns the ImageBitmap of the sprite at the x and y coordinates
     */
    getSprite(x: number, y: number): ImageBitmap {
        return this.#spritemap[y][x];
    }

    /**
     * @returns a 2D array of ImageBitmaps
     * the first index is the y coordinate and the second index is the x coordinate
     * the ImageBitmaps are the sprites in the spritesheet
    */
    getSprites(): Array<Array<ImageBitmap>> {
        return this.#spritemap;
    }
}

export class Sprite {
    spriteSheetSrc: string;
    xOffset: number;
    yOffset: number;
    zindex: number;
    /**
     * Sprite is a class that represents a sprite
     * @param spriteSheetSrc - the source of the spritesheet
     * @param x - the x coordinate of the sprite in the spritesheet
     * @param y - the y coordinate of the sprite in the spritesheet
     * @param zindex - the zindex of the sprite
     * the zindex is used to determine the order of rendering
     * the lower the zindex the earlier the sprite is rendered
     * the higher the zindex the later the sprite is rendered
     * the sprite class dosen't store the ImageBitmap of the sprite
     * the ImageBitmap is stored in the SpriteSheet class
     * the sprite class only stores the coordinates of the ImageBitmap in the spritesheet
     */
    constructor(spriteSheetSrc: string, x: number, y: number, zindex: number) {
        this.spriteSheetSrc = spriteSheetSrc;
        this.xOffset = x;
        this.yOffset = y;
        this.zindex = zindex;
    }
}


/**
* Renders a sprite on the canvas
* @param ctx - the canvas rendering context
* @param spriteSheetLoader - the asset loader that contains the spritesheet
* @param sprite - the sprite to render
* @param x - the x coordinate to render the sprite
* @param y - the y coordinate to render the sprite
* @param width - the width to render the sprite
* @param height - the height to render the sprite
* the width and height are used to scale the sprite
*/
export function render(ctx: CanvasRenderingContext2D, spriteSheetLoader: AssetLoader, sprite: Sprite, x: number, y: number, width: number, height: number) {
    let spritesheet: SpriteSheet = spriteSheetLoader.getSpriteSheet(sprite.spriteSheetSrc)!;
    if(!spritesheet) {
        throw new Error('Spritesheet not found' + sprite.spriteSheetSrc);
    }    
    ctx.drawImage(spritesheet.getSprite(sprite.xOffset, sprite.yOffset), x, y, width, height);
}

/**
* Renders multiple sprites on the canvas
* @param ctx - the canvas rendering context
* @param spriteSheetLoader - the asset loader that contains the spritesheet
* @param sprites - the sprites to render
* @param x - the x coordinate to render the sprites
* @param y - the y coordinate to render the sprites
* @param width - the width to render the sprites
* @param height - the height to render the sprites
* the width and height are used to scale the sprites
* the sprites are rendered in the order of their zindex
* the lower the zindex the earlier the sprite is rendered
* the higher the zindex the later the sprite is rendered
*/
export function renderMany(ctx: CanvasRenderingContext2D, spriteSheetLoader: AssetLoader, sprites: Array<Sprite>, x: number, y: number, width: number, height: number) {
    sprites.sort((a,b) => a.zindex - b.zindex).forEach((sprite) => {
        render(ctx, spriteSheetLoader, sprite, x, y, width, height);
    });
}