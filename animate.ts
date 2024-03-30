import { Screen } from "./screen.js";
import { AssetLoader, Sprite } from "./sprite.js";

export class CyclicAnimation {
    #frames: Array<Sprite>;
    #startTime: number;
    #duration: number;

    constructor(frames: Array<Sprite>, duration: number) {
        this.#frames = frames;
        this.#duration = duration;
        this.#startTime = 0;
    }

    render(ctx: CanvasRenderingContext2D, assetLoader: AssetLoader, x: number, y: number, width: number, height: number) {
        if(this.#startTime == 0) {
            this.#startTime = Date.now();
        }
        let frameIndex = Math.floor(Math.floor((Date.now() - this.#startTime) % this.#duration) / (this.#duration / this.#frames.length));
        
        let sprite = this.#frames[frameIndex];
        ctx.drawImage(assetLoader.getSpriteSheet(sprite.spriteSheetSrc)!.getSprite(sprite.xOffset, sprite.yOffset), x, y, width, height);
    }
}

export class Animation {
    #frames: Array<Sprite>;
    #startTime: number;
    #duration: number;
    #onFinish: () => void;

    constructor(frames: Array<Sprite>, duration: number, onFinish: () => void) {
        this.#frames = frames;
        this.#duration = duration;
        this.#startTime = 0;
        this.#onFinish = onFinish;
    }

    render(ctx: CanvasRenderingContext2D, assetLoader: AssetLoader, screen: Screen, x: number, y: number, width: number, height: number) {
        if(this.#startTime == 0) {
            this.#startTime = Date.now();
        }
        if(Date.now() - this.#startTime > this.#duration) {
            this.#onFinish();
            return;
        }

        const frameIndex = Math.floor((Date.now() - this.#startTime) / this.#duration * this.#frames.length);
        console.log(frameIndex);
        
        let sprite = this.#frames[frameIndex];
        ctx.drawImage(assetLoader.getSpriteSheet(sprite.spriteSheetSrc)!.getSprite(sprite.xOffset, sprite.yOffset), x, y, width, height);
    }
}

export class PlayerAnimation {
    #head: CyclicAnimation;
    #feet: CyclicAnimation;

    constructor(head: CyclicAnimation, feet: CyclicAnimation) {
        this.#head = head;
        this.#feet = feet;
    }

    render(ctx: CanvasRenderingContext2D, assetLoader: AssetLoader, x: number, y: number, width: number, height: number) {
        let centerX = x - width / 2;

        this.#head.render(ctx, assetLoader, centerX, y - 2*height, width, height);
        this.#feet.render(ctx, assetLoader, centerX, y - 1*height, width, height);
    }
}
