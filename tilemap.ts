
export class Tilemap {
    tilemap: Array<Array<ImageBitmap>>;
    width: number;
    height: number;
    tileSize: number;

    constructor(src: string, tileSize: number, callback: (src: string) => void) {
        let image = new Image();
        image.src = src;
        this.tileSize = tileSize;
        this.width = 0;
        this.height = 0;
        this.tilemap = [];

        image.onload = async (event) => {
            this.width = (image.width - (image.width % this.tileSize));
            this.height = (image.height - (image.height % this.tileSize));

            for(let y = 0; y < this.height; y += this.tileSize) {
                this.tilemap[y / this.tileSize] = [];
                for(let x = 0; x < this.width; x += this.tileSize) {
                    let img: ImageBitmap = await createImageBitmap(image, x, y, this.tileSize, this.tileSize);
                    this.tilemap[y / this.tileSize][x / this.tileSize] = img;                                
                }
            }
            callback(src);
        }
    }
}

export class TilemapLoader {
    constructor(tilemaps: Array<{ src: string, tileSize: number }>, onLoad: () => void) {
        let remaining: number = tilemaps.length;
        setTimeout(() => {
            if(remaining > 0) {
                throw new Error('Tilemap loading timeout');
            }
        }, 3000)
        tilemaps.forEach((tilemap) => {
            let tilemapObj: Tilemap = new Tilemap(tilemap.src, tilemap.tileSize, (src: string) => {
                remaining--;
                if(remaining == 0) {
                    onLoad();
                }
            });        
        });
    }
}