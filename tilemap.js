var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Tilemap {
    constructor(src, tileSize, callback) {
        let image = new Image();
        image.src = src;
        this.tileSize = tileSize;
        this.width = 0;
        this.height = 0;
        this.tilemap = [];
        console.log("Tilemap created");
        image.onload = (event) => __awaiter(this, void 0, void 0, function* () {
            this.width = (image.width - (image.width % this.tileSize));
            this.height = (image.height - (image.height % this.tileSize));
            for (let y = 0; y < this.height; y += this.tileSize) {
                this.tilemap[y / this.tileSize] = [];
                for (let x = 0; x < this.width; x += this.tileSize) {
                    let img = yield createImageBitmap(image, x, y, this.tileSize, this.tileSize);
                    this.tilemap[y / this.tileSize][x / this.tileSize] = img;
                }
            }
            callback(src);
        });
    }
}
export default Tilemap;
