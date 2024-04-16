import * as Sprites from './sprite.js';
import { deserilizeScene, Scene, serilizeScene, Tile, TileCoordinate } from './scene.js';
import { InputHandler } from './input.js';
import { AssetLoader } from './assetloader.js';

const canvas: HTMLCanvasElement = document.getElementById('game') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
const tileSize = 16; // size of tile and sprite
const renderScale = 4;

const spriteModal = document.getElementById('sprite-modal') as HTMLDivElement;
const objectModal = document.getElementById('object-modal') as HTMLDivElement;

let selectSpriteModalActive = false;
let placeScriptedObjectModalActive = false;
let selectedSprite: Sprites.Sprite | null = null;

// what collision rule to set when clicking r on a tile or t on a selection
let selectedCollisionRule: number = 1;
// should render collision boxes
let renderCollision: boolean = true;


if(!ctx) {
    throw new Error('Canvas not found');   
}
// load all assets
const spriteSheetManager = new AssetLoader (
    [
        //new Sprites.SpriteSheet("assets/tilemap.png", tileSize),
        new Sprites.SpriteSheet("assets/mcwalk.png", tileSize),
        new Sprites.SpriteSheet("assets/goli.png", 16),
        new Sprites.SpriteSheet("assets/collision_boxes.png", tileSize),
    ], () => { 
        // callback when all assets are loaded

        // delete loading screen when loading is finished
        document.getElementById('loading')!.style.display = 'none';
        canvas.style.display = 'block';

        // load data from session storage, if data is null load an empty object        
        let scene: Scene = deserilizeScene(sessionStorage.getItem("data") || '{ "tileData": {}, "objectData": {} }');

        // selection object
        // allows the user to select an area of the map and prefore actions on it
        const selection: { startX: number, startY: number, endX: number, endY: number, active: boolean } = { startX: 0, startY: 0, endX: 0, endY: 0, active: false };
        const mouse = { x: 0, y: 0 }
        // init camera to 0,0
        const camera = { x: 0, y: 0 };

        //create an input handler
        let input = new InputHandler();
        
        // toggle modal and prevent default spacebar scroll because it's annoying
        document.addEventListener("keydown", (event) => {
            if(event.code != "Space") { return; }
            event.preventDefault();
            selectSpriteModalActive = !selectSpriteModalActive;
            spriteModal.style.display = selectSpriteModalActive ? 'block' : 'none';
        });
        
        //movement
        input.onHold('KeyW', () => {
            if(selectSpriteModalActive){ return; }
            camera.y -= (1.5*renderScale)/(( window.outerWidth - 10 ) / window.innerWidth);
        });
        input.onHold('KeyS', () => {
            if(selectSpriteModalActive){ return; }
            camera.y += (1.5*renderScale)/(( window.outerWidth - 10 ) / window.innerWidth);
        });
        input.onHold('KeyA', () => {
            if(selectSpriteModalActive){ return; }
            camera.x -= (1.5*renderScale)/(( window.outerWidth - 10 ) / window.innerWidth);
        });
        input.onHold('KeyD', () => {
            if(selectSpriteModalActive){ return; }
            camera.x += (1.5*renderScale)/(( window.outerWidth - 10 ) / window.innerWidth);
        });

        // change collision rule with arrow keys
        // selected collision rule is the value that will be set when the user clicks r on a tile or t on a selection
        const setCollisionRule = (rule: number) => {
            if(!(rule >= 0 && rule <= 10)){ return; }
            if(!renderCollision){ return; }
            selectedCollisionRule = rule;
        }
        input.onClick('ArrowUp', () => setCollisionRule(selectedCollisionRule + 1));
        input.onClick('ArrowDown', () => setCollisionRule(selectedCollisionRule - 1));

        // toggle render collision
        input.onClick('KeyE', () => {
            if(selectSpriteModalActive){ return; }
            renderCollision = !renderCollision;
        });

        // set collision rule on tile from selectedCollisionRule
        input.onClick('KeyR', () => {
            if(selectSpriteModalActive){ return; }
            if(!renderCollision) { return; }
            let x = Math.floor(((camera.x - canvas.width / 2) + mouse.x) / (tileSize * renderScale));
            let y = Math.floor(((camera.y - canvas.height / 2) + mouse.y) / (tileSize * renderScale));

            let tile = scene.getTile(new TileCoordinate(x, y));
            if(tile == null){ return; }
            let currentRule = tile.getCollisonRule();
            tile.setCollisonRule(selectedCollisionRule);
        });

        // copy scene to clipboard as json string
        input.onClick('KeyC', () => {
            if(selectSpriteModalActive){ return; }
            if(confirm("Do you want to copy the current scene? as a JSON string")){
                let serilizedScene = serilizeScene(scene);
                sessionStorage.setItem("data", serilizedScene);
                navigator.clipboard.writeText(serilizedScene);
            }
        });

        // load scene from clipboard json string
        input.onClick('KeyV', () => {
            if(selectSpriteModalActive){ return; }
            if(confirm("Do you want to paste to the current scene? from a JSON string")){
                navigator.clipboard.readText().then((text) => {
                    scene = deserilizeScene(text);
                });
            }
        });

        // clear scene
        input.onClick('KeyX', () => {
            if(selectSpriteModalActive){ return; }
            if(confirm("Do you want to clear the current scene?")){
                scene = new Scene();
            }
        });


        // area selection with f, g, h, t
        const handleSelection = (mode : "remove" | "add" | "random" | "col") => {
            if(selectSpriteModalActive){ return; }
            if(!selectedSprite && (mode == "random" || mode == "add")){ return; }
            selection.active = !selection.active;

            if(selection.active){
                // get tile cooardinates of the start of the selection
                selection.startX =  Math.floor(((camera.x - canvas.width / 2) + mouse.x) / (tileSize * renderScale));
                selection.startY =  Math.floor(((camera.y - canvas.height / 2) + mouse.y) / (tileSize * renderScale));
            } else {
                // get tile cooardinates of the end of the selection
                selection.endX =  Math.floor(((camera.x - canvas.width / 2) + mouse.x) / (tileSize * renderScale));
                selection.endY =  Math.floor(((camera.y - canvas.height / 2) + mouse.y) / (tileSize * renderScale));

                let minX = Math.min(selection.startX, selection.endX);
                let maxX = Math.max(selection.startX, selection.endX);
                let minY = Math.min(selection.startY, selection.endY);
                let maxY = Math.max(selection.startY, selection.endY);
                let scalar = 1;
                if(mode == "random") {
                    let scalarString = prompt("Enter number 0-1", "1");
                    scalar = Number(scalarString);
                }
                // loop through all tiles in the selection and preform the action
                for(let x = minX; x <= maxX; x++){
                    for(let y = minY; y <= maxY; y++){
                        // diffrent actions for diffrent modes
                        if(mode == "remove"){
                            scene.removeTile(new TileCoordinate(x, y));
                        } else if(mode == "add"){
                            scene.setTile(new TileCoordinate(x, y), 0, [selectedSprite!]);
                        } else if(mode == "random"){
                            if(Math.random() < scalar){
                                scene.setTile(new TileCoordinate(x, y), 0, [selectedSprite!]);
                            }
                        } else if(mode == "col"){
                            scene.getTile(new TileCoordinate(x, y))?.setCollisonRule(selectedCollisionRule);
                        }
                    }
                }
            }
        }
        // bind the selection functions to keys
        input.onClick('KeyF', () => handleSelection("remove"));
        input.onClick('KeyG', () => handleSelection("add"));
        input.onClick('KeyH', () => handleSelection("random"));
        input.onClick('KeyT', () => handleSelection("col"));

        // place 
        canvas.addEventListener('click', (event) => {
            if(selectedSprite == null){ return; }
            let x = Math.floor(((camera.x - canvas.width / 2) + event.clientX) / (tileSize * renderScale));
            let y = Math.floor(((camera.y - canvas.height / 2) + event.clientY) / (tileSize * renderScale));
            // when holding shift add a sprite to the top of the tile
            // if not holding shift create/replace tile
            if(input.isKeyDown("ShiftLeft")){
                let tile = scene.getTile(new TileCoordinate(x, y));
                if(tile != null ){
                    let zindex = tile.getSprites().sort((a,b) => a.zindex - b.zindex)[0].zindex // get the zindex of the top sprite
                    tile.getSprites().push(new Sprites.Sprite(selectedSprite.spriteSheetSrc, selectedSprite.xOffset, selectedSprite.yOffset, zindex)); // create new sprite on the laste sprite
                    return;
                }
            }
            scene.setTile(new TileCoordinate(x, y), 0, [selectedSprite!]);
        });

        // remove
        canvas.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            let x = Math.floor(((camera.x - canvas.width / 2) + event.clientX) / (tileSize * renderScale));
            let y = Math.floor(((camera.y - canvas.height / 2) + event.clientY) / (tileSize * renderScale));
            // when holding shift remove the top sprite from the tile
            // if not holding shift delete the tile
            if(input.isKeyDown("ShiftLeft")){
                let tile = scene.getTile(new TileCoordinate(x, y));
                if(tile != null ){
                    if(tile.getSprites().length == 1){
                        scene.removeTile(new TileCoordinate(x, y));
                        return;
                    }
                    tile.getSprites().sort((a,b) => a.zindex - b.zindex).pop(); // remove the last sprite
                    return;
                }
            }
            scene.removeTile(new TileCoordinate(x, y));
        })

        input.onClick('KeyJ', () => {
            if(selectSpriteModalActive){ return; }
            let x = Math.floor(((camera.x - canvas.width / 2) + mouse.x) / (tileSize * renderScale));
            let y = Math.floor(((camera.y - canvas.height / 2) + mouse.y) / (tileSize * renderScale));
            let tile = scene.getTile(new TileCoordinate(x, y));
            placeScriptedObjectModalActive = !placeScriptedObjectModalActive;
            objectModal.style.display = placeScriptedObjectModalActive ? 'block' : 'none';

        });

        document.getElementById('object-save')!.addEventListener('click', (event) => {
            event.preventDefault();
            placeScriptedObjectModalActive = false;
            objectModal.style.display = placeScriptedObjectModalActive ? 'block' : 'none';
            let objectType = (document.getElementById('object-type') as HTMLInputElement).value;
            let objectData = (document.getElementById('object-data') as HTMLInputElement).value;
            console.log(objectType, objectData);
        });

        document.getElementById('object-type')!.addEventListener('change', (event) => {
            let hasData: Array<string> = [
                "NPC",
                "ChangeScene",
                "Sign",
                "Chest",
                "ConveyorBelt"
            ]
            let type = (event.target as HTMLInputElement).value;
            let dataInput = document.getElementById('object-data') as HTMLInputElement;
            if(hasData.indexOf(type) != -1 ){
                dataInput.style.display = 'block';
            } else {
                dataInput.style.display = 'none';
            }
        });

        // some methods need this to work
        document.addEventListener('mousemove', (event) => {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        });
        // Save every 5 seconds so that the user does not loose their work and cry
        setInterval(() => {
            sessionStorage.setItem("data", serilizeScene(scene));
        }, 5000);

        // populate the modal with sprites to select from
        populateSpritesheetModal(spriteSheetManager);

        // game loop
        requestAnimationFrame(function gameLoop() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            ctx.imageSmoothingEnabled = false; // For some reason this has to be done every frame when setting the canvas size to prevent blurring
            input.update();
            render(camera, scene);

            if(selection.active){
                renderSelection(selection, camera, ctx!, tileSize, renderScale, mouse);
            }

            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(35-3, 14-3, 16+6, 16+6);
            ctx.font = "lighter 20px Arial";
            ctx.fillText(`${selectedCollisionRule}`, 10, 30);
            ctx.drawImage(spriteSheetManager.getSpriteSheet("assets/collision_boxes.png")!.getSprite(selectedCollisionRule, 0), 35, 14, 16, 16);

            requestAnimationFrame(gameLoop);
        });
    }
);

function render(camera: { x: number, y: number}, scene: Scene): void {
    // Camera bounds
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    let bounds = { 
        // Devison by renderScale to get the correct tile coordinate 
        minX: Math.floor((camera.x - canvas.width / 2) / (tileSize * renderScale)),
        maxX: Math.floor((camera.x + canvas.width / 2) / (tileSize * renderScale)),
        minY: Math.floor((camera.y - canvas.height / 2) / (tileSize * renderScale)),
        maxY: Math.floor((camera.y + canvas.height / 2) / (tileSize * renderScale))
    }
    scene.getTiles().forEach((row, ys) => {
        row.forEach((tile, xs) => {
            // Get current x and y as int
            let x =  Number(xs);
            let y =  Number(ys); 
            
            // Check if the tile is outside the camera view
            if(x < bounds.minX || x > bounds.maxX || y < bounds.minY || y > bounds.maxY) {
                return;
            }
            
            // Sort tiles after zindex so that the tiles with the highest zindex are drawn last
            Sprites.renderMany(ctx!, spriteSheetManager, tile.getSprites(), x * tileSize * renderScale - camera.x + canvas.width / 2, y * tileSize * renderScale - camera.y + canvas.height / 2, tileSize * renderScale, tileSize * renderScale);
        
            // render collision box
            if(renderCollision){
                renderCollisionBox(ctx!, tile.getCollisonRule(), x * tileSize * renderScale - camera.x + canvas.width / 2, y * tileSize * renderScale - camera.y + canvas.height / 2, tileSize * renderScale, tileSize * renderScale);
                render
            }
        });
    });
}


function populateSpritesheetModal(spriteSheetManager: AssetLoader) {
    spriteSheetManager.getSpriteSheets().forEach((spritesheet, src) => {
        const margin = 10*(spritesheet.width/spritesheet.spriteSize);
        const width = Math.min(100, (window.innerWidth - margin) / (spritesheet.width/spritesheet.spriteSize));

        const tileMapSrcText = document.createElement('p');
        tileMapSrcText.innerText = src;
        spriteModal.appendChild(tileMapSrcText);

        spritesheet.getSprites().forEach((row, y) => {
            
            const rowDiv = document.createElement('div');
            row.forEach((sprite, x) => {
                let a = document.createElement('a');
                a.onclick = () => {
                    selectSprite(src, x, y);
                };
                let c = document.createElement('canvas');
                let cx: CanvasRenderingContext2D = c.getContext('2d')!;
                cx.imageSmoothingEnabled = false;
                c.width = width;
                c.height = width;
                cx?.drawImage(sprite, 0, 0, width, width);
                a.appendChild(c);
                rowDiv.appendChild(a);
            });
            spriteModal.appendChild(rowDiv);
        });
    });   
}

function selectSprite(src: string, x: number, y: number) {
    selectedSprite = new Sprites.Sprite(src, x, y, 5);
}


function renderSelection(selection: { startX: number; startY: number; endX: number; endY: number; active: boolean; }, camera: { x: number; y: number; }, ctx: CanvasRenderingContext2D, tileSize: number, renderScale: number, mouse: { x: number; y: number; }) {
    const endX =  Math.floor(((camera.x - canvas.width / 2) + mouse.x) / (tileSize * renderScale));
    const endY =  Math.floor(((camera.y - canvas.height / 2) + mouse.y) / (tileSize * renderScale));

    let minX = Math.min(selection.startX, endX) * tileSize * renderScale - camera.x + canvas.width / 2;
    let maxX = (Math.max(selection.startX, endX) + 1)* renderScale*tileSize - camera.x + canvas.width / 2;

    let minY = Math.min(selection.startY, endY) * renderScale*tileSize - camera.y + canvas.height / 2;
    let maxY = (Math.max(selection.startY, endY) + 1) * renderScale*tileSize- camera.y + canvas.height / 2;

    ctx.strokeStyle = "#ff0000";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(minX, minY);
    ctx.lineTo(maxX, minY);
    ctx.lineTo(maxX, maxY);
    ctx.lineTo(minX, maxY);
    ctx.lineTo(minX, minY);
    ctx.stroke();
}

function renderCollisionBox(ctx: CanvasRenderingContext2D, collisonRule: number, x: number, y: number, w: number, h: number) {
    ctx.globalAlpha = 0.4;
    ctx.drawImage(spriteSheetManager.getSpriteSheet("assets/collision_boxes.png")!.getSprite(collisonRule, 0), x, y, w, h);
    ctx.globalAlpha = 1;
}

function renderActionZones(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    ctx.fillStyle = "#FFA500";

    ctx.globalAlpha = 0.4;
    ctx.fillRect(x, y, w, h);
    ctx.globalAlpha = 1;
}