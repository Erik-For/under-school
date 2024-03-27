
export class SpriteSheet {
    tilemap: Array<Array<ImageBitmap>>;
    width: number;
    height: number;
    tileSize: number;

    constructor(src: string, tileSize: number, onLoad: (src: string) => void){
        let image = new Image();
        image.src = src;
        this.tileSize = tileSize;
        this.width = 0;
        this.height = 0;
        this.tilemap = [];

        image.onload = async (event) => {
            this.width = (image.width - (image.width % this.tileSize));
            this.height = (image.height - (image.height % this.tileSize));

            const asyncRun = async () => {
                for(let y = 0; y < this.height/this.tileSize; y++) {
                    this.tilemap[y] = [];
                    for(let x = 0; x < this.width/this.tileSize; x++) {
                        let img: ImageBitmap = await createImageBitmap(image, x*tileSize, y*tileSize, this.tileSize, this.tileSize);
                        this.tilemap[y][x] = img;
                    }
                }
            }
            await asyncRun();
            onLoad(src);
        }
    }

    getTile(x: number, y: number): ImageBitmap {
        return this.tilemap[y][x];
    }
}

export class SpriteSheetLoader {
    tilemaps: Record<string, SpriteSheet> = {};

    constructor(tilemaps: Array<{ src: string, tileSize: number }>, onLoad: () => void) {
        let remaining: number = tilemaps.length;
        setTimeout(() => {
            if(remaining > 0) {
                throw new Error('Tilemap loading timeout');
            }
        }, 3000)
        tilemaps.forEach((tilemap) => {
            let tilemapObj: SpriteSheet = new SpriteSheet(tilemap.src, tilemap.tileSize, (src: string) => {
                this.tilemaps[src] = tilemapObj;
                remaining--;
                if(remaining == 0) {
                    onLoad();
                }
            });        
        });
        this.tilemaps
    }

    getTextureTilemap(src: string): SpriteSheet {
        return this.tilemaps[src];
    }
}

export class Sprite {
    spriteSheetSrc: string;
    xOffset: number;
    yOffset: number;
    zindex: number;

    constructor(textureTileMapName: string, x: number, y: number, zindex: number) {
        this.spriteSheetSrc = textureTileMapName;
        this.xOffset = x;
        this.yOffset = y;
        this.zindex = zindex;
    }
}

/**
* Renders ONE and only ONE image per tilemap coordinate
*/
export function render(ctx: CanvasRenderingContext2D, spriteSheetLoader: SpriteSheetLoader, sprite: Sprite, x: number, y: number, width: number, height: number) {
    let tilemap: SpriteSheet = spriteSheetLoader.getTextureTilemap(sprite.spriteSheetSrc);
    if(!tilemap) {
        throw new Error('Tilemap not found');
    }
    ctx.drawImage(tilemap.getTile(sprite.xOffset, sprite.yOffset), x, y, width, height);
}

/**
* Renders multiple images on the same world coordinates ordered by ascending z-index 
*/
export function renderMany(ctx: CanvasRenderingContext2D, spriteSheetLoader: SpriteSheetLoader, sprites: Array<Sprite>, x: number, y: number, width: number, height: number) {
    sprites.sort((a,b) => a.zindex - b.zindex).forEach((sprite) => {
        render(ctx, spriteSheetLoader, sprite, x, y, width, height);
    });
}