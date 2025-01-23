import { Game } from "./game.js";
import { InputHandler } from "./input.js";
import { Screen } from "./screen.js";
import { render, Sprite } from "./sprite.js";
import { AssetLoader } from "./assetloader.js";
import { SequenceCallback } from "./sequence.js";
import Keys from "./keys.js";

/**
 * Represents a cyclic animation that loops through a series of frames.
 */
export class CyclicAnimation {
    #frames: Array<Sprite>;
    #startTime: number;
    #duration: number;

    /**
     * Creates a new CyclicAnimation instance.
     * @param frames - An array of Sprite objects representing the frames of the animation.
     * @param duration - The duration of the animation in milliseconds.
     */
    constructor(frames: Array<Sprite>, duration: number) {
        this.#frames = frames;
        this.#duration = duration;
        this.#startTime = 0;
    }

    /**
     * Renders the current frame of the animation.
     * @param ctx - The CanvasRenderingContext2D used for rendering.
     * @param assetLoader - The AssetLoader used to load sprites.
     * @param x - The x-coordinate of the top-left corner of the rendered frame.
     * @param y - The y-coordinate of the top-left corner of the rendered frame.
     * @param width - The width of the rendered frame.
     * @param height - The height of the rendered frame.
     */
    render(ctx: CanvasRenderingContext2D, assetLoader: AssetLoader, x: number, y: number, width: number, height: number) {
        if(this.#startTime == 0) {
            this.#startTime = Date.now();
        }
        let frameIndex = Math.floor(Math.floor((Date.now() - this.#startTime) % this.#duration) / (this.#duration / this.#frames.length));
        
        let sprite = this.#frames[frameIndex];
        ctx.drawImage(assetLoader.getSpriteSheet(sprite.spriteSheetSrc)!.getSprite(sprite.xOffset, sprite.yOffset), x, y, width, height);
    }
}

/**
 * Represents an animation that plays through a series of frames and triggers a callback when finished.
 */
export class Animation extends SequenceCallback {
    #frames: Array<Sprite>;
    #startTime: number;
    #duration: number;

    /**
     * Creates a new Animation instance.
     * @param frames - An array of Sprite objects representing the frames of the animation.
     * @param duration - The duration of the animation in milliseconds.
     * @param onFinish - A callback function to be called when the animation finishes.
     */
    constructor(frames: Array<Sprite>, duration: number) {
        super();
        this.#frames = frames;
        this.#duration = duration;
        this.#startTime = 0;
    }

    /**
     * Renders the current frame of the animation.
     * @param ctx - The CanvasRenderingContext2D used for rendering.
     * @param assetLoader - The AssetLoader used to load sprites.
     * @param screen - The Screen object representing the game screen.
     * @param x - The x-coordinate of the top-left corner of the rendered frame.
     * @param y - The y-coordinate of the top-left corner of the rendered frame.
     * @param width - The width of the rendered frame.
     * @param height - The height of the rendered frame.
     */
    render(ctx: CanvasRenderingContext2D, assetLoader: AssetLoader, screen: Screen, x: number, y: number, width: number, height: number) {
        if(this.#startTime == 0) {
            this.#startTime = Date.now();
        }
            this.onFinish();


        const frameIndex = Math.floor((Date.now() - this.#startTime) / this.#duration * this.#frames.length);
        
        let sprite = this.#frames[frameIndex];
        ctx.drawImage(assetLoader.getSpriteSheet(sprite.spriteSheetSrc)!.getSprite(sprite.xOffset, sprite.yOffset), x, y, width, height);
    }
}

/**
 * Represents a player animation consisting of a head animation and a feet animation.
 */
export class PlayerAnimation {
    #head: CyclicAnimation;
    #feet: CyclicAnimation;

    /**
     * Creates a new PlayerAnimation instance.
     * @param head - The CyclicAnimation representing the head animation.
     * @param feet - The CyclicAnimation representing the feet animation.
     */
    constructor(head: CyclicAnimation, feet: CyclicAnimation) {
        this.#head = head;
        this.#feet = feet;
    }

    /**
     * Renders the player animation.
     * @param ctx - The CanvasRenderingContext2D used for rendering.
     * @param assetLoader - The AssetLoader used to load sprites.
     * @param x - The x-coordinate of the top-left corner of the rendered animation.
     * @param y - The y-coordinate of the top-left corner of the rendered animation.
     * @param width - The width of the rendered animation.
     * @param height - The height of the rendered animation.
     */
    render(ctx: CanvasRenderingContext2D, assetLoader: AssetLoader, x: number, y: number, width: number, height: number) {
        let centerX = x - width / 2;

        this.#head.render(ctx, assetLoader, centerX, y - 2*height, width, height);
        this.#feet.render(ctx, assetLoader, centerX, y - 1*height, width, height);
    }
}

/**
 * Represents a NPC talking sprite made up of 4 sprites rendered in a 2x2 grid.
 */
export class BigSprite {
    topLeft: Sprite;
    topRight: Sprite;
    bottomLeft: Sprite;
    bottomRight: Sprite;

    /**
     * Creates a new NPCTalkingSprite instance.
     * @param topLeft - The Sprite representing the top-left corner of the sprite grid.
     * @param topRight - The Sprite representing the top-right corner of the sprite grid.
     * @param bottomLeft - The Sprite representing the bottom-left corner of the sprite grid.
     * @param bottomRight - The Sprite representing the bottom-right corner of the sprite grid.
     */
    constructor(topLeft: Sprite, topRight: Sprite, bottomLeft: Sprite, bottomRight: Sprite) {
        this.topLeft = topLeft;
        this.topRight = topRight;
        this.bottomLeft = bottomLeft;
        this.bottomRight = bottomRight;
    }

    /**
     * Renders the NPC talking sprite.
     * @param ctx - The CanvasRenderingContext2D used for rendering.
     * @param assetLoader - The AssetLoader used to load sprites.
     * @param x - The x-coordinate of the top-left corner of the rendered sprite.
     * @param y - The y-coordinate of the top-left corner of the rendered sprite.
     * @param width - The width of the rendered sprite.
     * @param height - The height of the rendered sprite.
     */
    render(ctx: CanvasRenderingContext2D, assetLoader: AssetLoader, x: number, y: number, width: number, height: number) {
        render(ctx, assetLoader, this.topLeft, x, y, width / 2, height / 2);
        render(ctx, assetLoader, this.topRight, x + width / 2, y, width / 2, height / 2);
        render(ctx, assetLoader, this.bottomLeft, x, y + height / 2, width / 2, height / 2);
        render(ctx, assetLoader, this.bottomRight, x + width / 2, y + height / 2, width / 2, height / 2);
    }
}

/**
 * Represents an animation for displaying NPC text.
 */
export class NPCTextAnimation extends SequenceCallback {
    talkingSprite: BigSprite;
    text: string;
    duration: number;
    startTime: number;
    inputHandler: InputHandler;

    /**
     * Creates a new NPCTextAnimation instance.
     * @param talkingSprite - The NPCTalkingSprite to be displayed during the animation.
     * @param text - The text to be displayed.
     * @param duration - The duration of the animation in milliseconds.
     * @param inputHandler - The InputHandler used for handling user input.
     */
    constructor(talkingSprite: BigSprite, text: string, duration: number, inputHandler: InputHandler) {
        super();
        this.talkingSprite = talkingSprite;
        this.text = text;
        this.duration = duration;
        this.startTime = 0;
        this.inputHandler = inputHandler;

    }
    /**
     * Renders the NPC text animation.
     * @param ctx - The CanvasRenderingContext2D used for rendering.
     * @param game - The Game object representing the game.
     * @param screen - The Screen object representing the game screen.
     */
    render(ctx: CanvasRenderingContext2D, game: Game) {
        const textPadding = 16;

        let screen = game.getScreen()
        // Make text print out according to time
        if(this.startTime == 0) {
            this.startTime = Date.now();
        }

        // This is a horrible way to do this, but it works for now
        this.inputHandler.onClick(Keys.Interact, () => {
            if(Date.now() - this.startTime > this.duration) {
                this.onFinish();
            }
        }, true);
        this.inputHandler.onClick(Keys.SkipText, () => {
            this.startTime = Date.now() - this.duration;
        }, true);


        // render a "modal" that takes up the bottom 1/3 of the screen
        ctx.fillStyle = "black";
        ctx.globalAlpha = 0.7;
        ctx.fillRect(0, screen.height - screen.height / 3, screen.width, screen.height / 3);
        ctx.globalAlpha = 1;
        
        let textAreaWidth = screen.width * 3/4 - textPadding;
        let NPCSpriteAreaWidth = screen.width * 1/4;
        let NPCSpriteSide = Math.min(NPCSpriteAreaWidth * 3/4, screen.height / 3);

        // render the NPC sprite
        this.talkingSprite.render(ctx, game.getAssetLoader(), (NPCSpriteAreaWidth-NPCSpriteSide)/2, screen.height - screen.height / 3,NPCSpriteSide, NPCSpriteSide);

        // render the text with wrapping if the text is too long and padding
        ctx.fillStyle = "white";
        ctx.font = "30px underschool";
        let words = this.text.substring(0, Math.floor((Date.now() - this.startTime) / this.duration * this.text.length)).split(" ");
        let lines = [];
        let line = "";
        for(let word of words) {
            if(ctx.measureText(line + word).width < textAreaWidth - 16) {
                line += word + " ";
            } else {
                lines.push(line);
                line = word + " ";
            }
        }
        
        lines.push(line);
        for(let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], 8 + NPCSpriteAreaWidth, screen.height - screen.height / 3 + 30 + 30 * i + textPadding * (i + 1));
        }
    }
}


export class TextAnimation extends SequenceCallback {
    text: string;
    duration: number;
    startTime: number;
    inputHandler: InputHandler;

    constructor(text: string, duration: number, inputHandler: InputHandler) {
        super();
        this.text = text;
        this.duration = duration;
        this.startTime = 0;
        this.inputHandler = inputHandler;
    }

 /**
     * Renders the NPC text animation.
     * @param ctx - The CanvasRenderingContext2D used for rendering.
     * @param game - The Game object representing the game.
     * @param screen - The Screen object representing the game screen.
     */
 render(ctx: CanvasRenderingContext2D, game: Game) {
    const textPaddingY = 16;
    const textPaddingX = 16;

    let screen = game.getScreen()
    // Make text print out according to time
    if(this.startTime == 0) {
        this.startTime = Date.now();
    }

    // This is a horrible way to do this, but it works for now
    this.inputHandler.onClick(Keys.Interact, () => {
        if(Date.now() - this.startTime > this.duration) {
            this.onFinish();
        }
    }, true);
    this.inputHandler.onClick(Keys.SkipText, () => {
        this.startTime = Date.now() - this.duration;
    }, true);


    // render a "modal" that takes up the bottom 1/3 of the screen
    ctx.fillStyle = "black";
    ctx.globalAlpha = 0.7;
    ctx.fillRect(0, screen.height - screen.height / 3, screen.width, screen.height / 3);
    ctx.globalAlpha = 1;
    
    let textAreaWidth = screen.width * 3/4 - textPaddingX;
    // render the NPC sprite
    // render the text with wrapping if the text is too long and padding
    ctx.fillStyle = "white";
    ctx.font = "30px underschool";
    let words = this.text.substring(0, Math.floor((Date.now() - this.startTime) / this.duration * this.text.length)).split(" ");
    let lines = [];
    let line = "";
    for(let word of words) {
        if(ctx.measureText(line + word).width < textAreaWidth - 16) {
            line += word + " ";
        } else {
            lines.push(line);
            line = word + " ";
        }
    }
    
    lines.push(line);
    for(let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], (screen.width - textAreaWidth) / 2, screen.height - screen.height / 3 + 30 + 30 * i + textPaddingY * (i + 1));
    }
}

}

export class TextAnimationNoInteract extends SequenceCallback {
    text: string;
    duration: number;
    startTime: number;
    pause: number;

    constructor(text: string, duration: number, pause: number) {
        super();
        this.text = text;
        this.duration = duration;
        this.pause = pause;
        this.startTime = 0;
    }

    render(ctx: CanvasRenderingContext2D, game: Game) {
        const textPaddingY = 16;
        const textPaddingX = 16;

        let screen = game.getScreen()
        // Make text print out according to time
        if(this.startTime == 0) {
            this.startTime = Date.now();
        }

        if(Date.now() - this.startTime > this.duration + this.pause) {
            this.onFinish();
        }

        // render a "modal" that takes up the bottom 1/3 of the screen
        ctx.fillStyle = "black";
        ctx.globalAlpha = 0.7;
        ctx.fillRect(0, screen.height - screen.height / 3, screen.width, screen.height / 3);
        ctx.globalAlpha = 1;
        
        let textAreaWidth = screen.width * 3/4 - textPaddingX;
        // render the NPC sprite
        // render the text with wrapping if the text is too long and padding
        ctx.fillStyle = "white";
        ctx.font = "30px underschool";
        let words = this.text.substring(0, Math.floor((Date.now() - this.startTime) / this.duration * this.text.length)).split(" ");
        let lines = [];
        let line = "";
        for(let word of words) {
            if(ctx.measureText(line + word).width < textAreaWidth - 16) {
                line += word + " ";
            } else {
                lines.push(line);
                line = word + " ";
            }
        }
        
        lines.push(line);
        for(let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], (screen.width - textAreaWidth) / 2, screen.height - screen.height / 3 + 30 + 30 * i + textPaddingY * (i + 1));
        }
    }
}