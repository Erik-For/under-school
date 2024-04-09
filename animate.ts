import { Game } from "./game.js";
import { InputHandler } from "./input.js";
import { Screen } from "./screen.js";
import { AssetLoader, Sprite, render } from "./sprite.js";

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

export class NPCTalkingSprite {
    topLeft: Sprite;
    topRight: Sprite;
    bottomLeft: Sprite;
    bottomRight: Sprite;

    constructor(topLeft: Sprite, topRight: Sprite, bottomLeft: Sprite, bottomRight: Sprite) {
        this.topLeft = topLeft;
        this.topRight = topRight;
        this.bottomLeft = bottomLeft;
        this.bottomRight = bottomRight;
    }

    render(ctx: CanvasRenderingContext2D, assetLoader: AssetLoader, x: number, y: number, width: number, height: number) {
        render(ctx, assetLoader, this.topLeft, x, y, width / 2, height / 2);
        render(ctx, assetLoader, this.topRight, x + width / 2, y, width / 2, height / 2);
        render(ctx, assetLoader, this.bottomLeft, x, y + height / 2, width / 2, height / 2);
        render(ctx, assetLoader, this.bottomRight, x + width / 2, y + height / 2, width / 2, height / 2);
    }
}

export class NPCTextAnimation {
    talkingSprite: NPCTalkingSprite;
    text: string;
    duration: number;
    startTime: number;
    onFinish: () => void;
    inputHandler: InputHandler;

    constructor(talkingSprite: NPCTalkingSprite, text: string, duration: number, inputHandler: InputHandler, onFinish: () => void) {
        this.talkingSprite = talkingSprite;
        this.text = text;
        this.duration = duration;
        this.startTime = 0;
        this.onFinish = onFinish;
        this.inputHandler = inputHandler;
    }

    render(ctx: CanvasRenderingContext2D, game: Game, screen: Screen) {
        // Make text print out acording to time
        if(this.startTime == 0) {
            this.startTime = Date.now();
        }
        if(Date.now() - this.startTime > this.duration) {
            this.onFinish();
            return;
        }
        
        if(this.inputHandler.isKeyDown("KeyZ") || this.inputHandler.isKeyDown("Enter")) {
            this.onFinish();
            return;
        };

        // render a "modal" that takes up the bottom 1/3 of the screen
        ctx.fillStyle = "black";
        ctx.globalAlpha = 0.7;
        ctx.fillRect(0, screen.height - screen.height / 3, screen.width, screen.height / 3);
        ctx.globalAlpha = 1;
        
        // render the text with wraping if the text is too long and padding
        ctx.fillStyle = "white";
        ctx.font = "30px underschool";
        let words = this.text.split(" ");
        let lines = [];
        let line = "";
        for(let word of words) {
            if(ctx.measureText(line + word).width < screen.width - 16) {
                line += word + " ";
            } else {
                lines.push(line);
                line = word + " ";
            }
        }
        
        lines.push(line);
        for(let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], 8, screen.height - screen.height / 3 + 30 + 30 * i);
        }

        this.talkingSprite.render(ctx, game.getAssetLoader(), screen.width - 64, screen.height - 64, 64, 64);
    }
}