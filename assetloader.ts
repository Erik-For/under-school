import { SceneAsset } from "./scene.js";
import { SpriteSheet } from "./sprite.js";

export interface Asset {
    src: string;
    load(): Promise<string>;
}

export class TextAsset implements Asset {
    src: string;
    data: string;
    
    /**
     * TextAsset is a class that loads a text file
     * @param src - the source of the text file
     * the data of the text file is stored in the data field
     */
    constructor(src: string) {
        this.src = src;
        this.data = "";
    }

    /** 
     * @returns a promise that resolves when the text file is loaded
     * the promise resolves with the src of the text file
     * the promise rejects with an error message
     */
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

    /**
     * AssetLoader is a class that loads multiple assets and stores them in a dictionary
     * @param assets - an array of assets to load
     * @param onLoad - a callback that is called when all assets are loaded
     * the callback is called with no arguments
     */
    constructor(assets: Array<Asset>, onLoad: () => void) {
        let remaining: number = assets.length;
        this.assets = new Map();
        setTimeout(() => {
            if(remaining > 0) {
                throw new Error('Assetloader loading timeout');
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

    /**
     * @param src - the source of the spritesheet
     * @returns the spritesheet with the key 'src'
     */
    getSpriteSheet(src: string): SpriteSheet | undefined {
        if(this.assets.get(src) instanceof SpriteSheet) {
            return this.assets.get(src)! as SpriteSheet;
        }
    }
   
    /**
     * @param src - the source of the text file
     * @returns the text file with the key 'src'
     */
    getTextAsset(src: string): TextAsset | undefined {
        if(this.assets.get(src) instanceof TextAsset) {
            return this.assets.get(src) as TextAsset;
        }
    }

    getSceneAsset(src: string): SceneAsset | undefined {
        if(this.assets.get(src) instanceof SceneAsset) {
            return this.assets.get(src) as SceneAsset;
        }
    }
    
    /**
     * @returns a map of assets that are instances of SpriteSheet
     * the key is the src of the spritesheet
     * this is here for use in the editor
     */
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
