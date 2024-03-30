export interface Asset {
    src: string;
    load(): Promise<string>;
}

export class SpriteSheet implements Asset {
    #spritemap: Array<Array<ImageBitmap>>;
    src: string;
    width: number;
    height: number;
    spriteSize: number;

    constructor(src: string, spriteSize: number){
        this.src = src;
        this.spriteSize = spriteSize;
        this.width = 0;
        this.height = 0;
        this.#spritemap = [];
    }

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

export class TextAsset implements Asset {
    src: string;
    data: string;
    
    constructor(src: string) {
        this.src = src;
        this.data = "";
    }

    load(): Promise<string> {
        const promise = new Promise<string>((reslove, reject) => {
            fetch(this.src).then((response) => {
                response.text().then((data) => {
                    this.data = data;
                    reslove(this.src);
                });
            });
        });
        return promise;
    }

}

/**
 * AssetLoader is a class that loads multiple spritesheets and stores them in a dictionary
 * it calls the @param onLoad callback when all spritesheets are loaded
 */
export class AssetLoader {
    assets: Map<string, Asset>;

    constructor(assets: Array<Asset>, onLoad: () => void) {
        let remaining: number = assets.length;
        this.assets = new Map();
        setTimeout(() => {
            if(remaining > 0) {
                throw new Error('Spritesheet loading timeout');
            }
        }, 10*1000)
        assets.forEach((asset) => {
            asset.load().then((src) => {
                this.assets.set(src, asset);
                remaining--;
                if(remaining == 0) {
                    onLoad();
                }
            });
        });
        this.assets
    }

    getSpriteSheet(src: string): SpriteSheet | undefined {
        if(this.assets.get(src) instanceof SpriteSheet) {
            return this.assets.get(src)! as SpriteSheet;
        }
    }

    getTextAsset(src: string): TextAsset | undefined {
        if(this.assets.get(src) instanceof TextAsset) {
            return this.assets.get(src) as TextAsset;
        }
    }

    getSpriteSheets() {
        // return map of assets that are instances of SpriteSheet
        let spritesheets = new Map<string, SpriteSheet>();
        this.assets.forEach((asset) => {
            if(asset instanceof SpriteSheet) {
                spritesheets.set(asset.src, asset);
            }
        });
        return spritesheets;
    }
}

export class Sprite {
    spriteSheetSrc: string;
    xOffset: number;
    yOffset: number;
    zindex: number;

    constructor(spriteSheetSrc: string, x: number, y: number, zindex: number) {
        this.spriteSheetSrc = spriteSheetSrc;
        this.xOffset = x;
        this.yOffset = y;
        this.zindex = zindex;
    }
}

/**
* Renders ONE and only ONE sprite per tile
*/
export function render(ctx: CanvasRenderingContext2D, spriteSheetLoader: AssetLoader, sprite: Sprite, x: number, y: number, width: number, height: number) {
    let spritesheet: SpriteSheet = spriteSheetLoader.getSpriteSheet(sprite.spriteSheetSrc)!;
    if(!spritesheet) {
        throw new Error('Spritesheet not found');
    }    
    ctx.drawImage(spritesheet.getSprite(sprite.xOffset, sprite.yOffset), x, y, width, height);
}

/**
* Renders multiple sprites on the same tile ordered by ascending z-index 
*/
export function renderMany(ctx: CanvasRenderingContext2D, spriteSheetLoader: AssetLoader, sprites: Array<Sprite>, x: number, y: number, width: number, height: number) {
    sprites.sort((a,b) => a.zindex - b.zindex).forEach((sprite) => {
        render(ctx, spriteSheetLoader, sprite, x, y, width, height);
    });
}