## Pos and TileCoordinate
>The Pos class is a simple class that represents a position in a 2D space.
>It has two properties, x and y, that represent the x and y coordinates of the position.
>It can be used to represent the coordinates in a scene, canvas or any arbitrary 2D space.
```ts
let a: Pos = new Pos(5,2);
```

>The TileCoordinate class is a simple class that represents a position in a 2D grid, where the x and y coordinates are integers.
>TileCoordinate is used to represent the coordinates of a tile in a tilemap and isn't meant to be used in a continuous space.

>In the context of the game the TileCoordinate is 1/16 of the size of a Pos because the tilesize is 16x16.
```ts
let a: TileCoordinate = new TileCoordinate(5,2);
```

> You can convert between Pos and TileCoordinate using the [Util](modules/util.html) methods
```ts
let a: Pos = new Pos(5,2);
let b: TileCoordinate = Util.convertWorldPosToTileCoordinate(a, screen);
let c: Pos = Util.convertTileCoordinateToWorldPos(b, screen);

//equivalent to (given that the tilesize is 16x16)

let a: Pos = new Pos(5,2);
let b: TileCoordinate = new TileCoordinate(Math.floor(pos.x/16), Math.floor(pos.y/16));
let c: Pos = new Pos(b.x*16, b.y*16);
```
> However, you will lose precision when converting from Pos to TileCoordinate, as the TileCoordinate class only stores integer values.

## Screen
>The Screen class holds information about the size of the screen and scaling such as tilesize and render scale.
>Render scale is used to zoom the game in and out.
```ts
// Create a screen with a resolution of 800x600 and a tilesize of 16
let screen: Screen = new Screen(800, 600, 16);
```
> The screen is supposed to be updated every frame with the new size of the canvas.
>this would look something like this:
```ts
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
let screen: Screen = new Screen(800, 600, 16);
requestAnimationFrame(function renderGame() => {
    screen.width = window.innerWidth;
    screen.height = window.innerHeight;
    canvas.width = screen.innerWidth;
    canvas.height = screen.innerHeight;
    //draw stuff
    requestAnimationFrame(renderGame);
});
```
> This ensures that the game is always rendered at the correct aspect ratio and resolution.

## Scene
>The Scene class holds information about the objects in the game.
>It has a Matrix(Array of Arrays) of Tiles that represent the tiles in the game.
>Each Tile has an Array of Sprites and a CollisionRule.
>CollisionRule is an enum that represents the collision type of the tile. this will be explained later on
```ts
// one way to create a scene
let scene: Scene = new Scene();

// more common way to create a scene
Scene.deserilizeScene(jsonString); // jsonString is a string that represents a scene

// you can also save the scene as a json string
let jsonString: string = scene.serializeScene();
```

## CollisionRule
>The CollisionRule enum represents the collision type of a tile. [Read more](enums/scene.CollisionRule.html)

## Tile
>The Tile class holds information about the sprites and collisionRule of a tile.
>It has an Array of Sprites and a CollisionRule.
```ts
let x: number = 5;
let y: number = 2;
let zindex: number = 0;
let collisionRule: CollisionRule = CollisionRule.None;

// new Tile(TileCoordinate, CollisionRule, Sprite[]);
let tile: Tile = new Tile(new TileCoordinate(x, y), collisionRule, [new Sprite("spritesheet1", 0, 0, zindex)]);
```
> This creates a tile with a coordinate of 5,2, a collisionRule of None and a sprite from the spritesheet "spritesheet1", at x:0, y:0 on the spritesheet and the sprite zindex has a zindex of 0 

## Sprite
>The Sprite class holds information about the sprites in the game.
>It has a spritesheet name, x and y coordinates on the spritesheet and a zindex.
```ts
let xOffset: number = 0;
let yOffset: number = 0;
let zindex: number = 0;
let spritesheet: string = "spritesheet1";

// new Sprite(spritesheet, xOffset, yOffset, zindex);
let sprite: Sprite = new Sprite(spritesheet, xOffset, yOffset, zindex);
```
>Note that Sprites dont store the actual image data, they only store the information needed to fetch the image data from the spritesheet.
> 
> Spritesheets can be loaded in 2 ways
```ts
// load a single spritesheet
// new Spritesheet(src, tilesize);
// src is the path to the spritesheet image
// tilesize is the size of the tiles in the spritesheet
const spritesheet: Spritesheet = new Spritesheet("spritesheet1", 16);
spritesheet.load().then(() => {
    let sprite: Sprite = new Sprite("spritesheet1", 2, 2, 3);
});

// load multiple spritesheets
const assetLoader: AssetLoader = new AssetLoader(
    [
        new Spritesheet("spritesheet1", 16),
        new Spritesheet("spritesheet2", 16),
        new Spritesheet("spritesheet3", 16)
    ],
    () => {
        // all spritesheets are loaded
        let sprite1: Sprite = new Sprite("spritesheet1", 2, 2, 3);
        let sprite2: Sprite = new Sprite("spritesheet2", 5, 2, 3);
        let sprite3: Sprite = new Sprite("spritesheet3", 2, 7, 3);
    }
);
```
>You can also load other assets like text
>Here is an example of loading a text asset and a usage example
```ts
const assetLoader: AssetLoader = new AssetLoader(
    [
        new TextAsset("scene.json"),
    ],
    () => {
        // all text assets are loaded
        const text1: string = assetLoader.getTextAsset("scene.json");
        const scene: Scene = Scene.deserializeScene(text1);
    }
);
```
>When rendering a sprite, you can use the Sprite.render()) method to render the sprite on the screen.
```ts
import * as Sprite from "./sprite";

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

const assetLoader: AssetLoader = new AssetLoader(
    [
        new Spritesheet("spritesheet1", 16),
    ],
    () => {
        // all spritesheets are loaded
        let sprite: Sprite = new Sprite("spritesheet1", 2, 2, 3);
        // render the sprite at 5,5 with a size of 16x16
        sprite.render(ctx, assetLoader, sprite, 5, 5, 16, 16);
    }
);
```
>The reason we pass the assetLoader is that the sprite needs to fetch the image data from the spritesheet
>The function render looks something like this:
```ts
render(ctx: CanvasRenderingContext2D, spriteSheetLoader: AssetLoader, sprite: Sprite, x: number, y: number, width: number, height: number) {
    let spritesheet: SpriteSheet = spriteSheetLoader.getSpriteSheet(sprite.spriteSheetSrc)!;
    let spritesheetImage: HTMLImageElement = spritesheet.getSprite(sprite.x, sprite.y);
    // ... draw the sprite on the canvas at x,y with width and height
}
```
>This is again because the sprite only stores the information needed to fetch the image data from the spritesheet.

## Input
>The Input class is used to get input from the user.
>You can register onKey, onRealease and onHold
>onKey is called when a key is pressed
>onRelease is called when a key is released
>onHold is called every tick (Ticks are seperate from frames to ensure that the game runs at a consistent speed and not dependent on the framerate)
```ts
let input: Input = new Input();
input.onKey("KeyW", () => {
    console.log("w is pressed");
});
input.onRelease("KeyW", () => {
    console.log("w is released");
});
input.onHold("KeyW", () => {
    console.log("w is held");
});
```
> You can also get the mouse position and if the mouse buttons are pressed
```ts
let input: Input = new Input();
console.log(input.getMousePos());
console.log(input.isKeyDown("keyW"));
// isKeyDown is useful when checking if for example
// the shift key is pressed when another key event is ran
input.onKey("KeyW", () => {
    if(input.isKeyDown("ShiftLeft")) {
        console.log("shift + w is pressed");
    }
});
```