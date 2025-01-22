import { BigSprite, NPCTextAnimation } from "../animate.js";
import { Game, Particle, Pos } from "../game.js";
import { CollisionRule, fadeIn, fadeOut, ObjectBehaviour, Scene, SceneScript, ScriptedObject, TileCoordinate } from "../scene.js";
import { AsyncCodeSequenceItem, CodeSequenceItem, Sequence, SequenceItem, WaitSequenceItem } from "../sequence.js";
import { Sprite } from "../sprite.js";

export default class Script implements SceneScript {
    name: string = "intro.js";
    
    async onEnter(prevScene: Scene, game: Game, currentScene: Scene){
        
        currentScene.addManyScriptedObjects(
            new ScriptedObject(new Pos(-2, -7).multiply(16), ObjectBehaviour.Sign, "GOLI WAS HERE!!!!!!!!!!!!!!", new Sprite("assets/saker.png", 6, 0, 0)),
            new ScriptedObject(new Pos(27, -3).multiply(16), ObjectBehaviour.ChangeScene, "assets/teknik.json", new Sprite("assets/teknik.png", 0, 0, 0)),
            new ScriptedObject(new Pos(27, -4).multiply(16), ObjectBehaviour.ChangeScene, "assets/teknik.json", new Sprite("assets/teknik.png", 0, 0, 0))
        );
    
        if(prevScene.getScriptName() === "mainmenu.js"){
            goliCutScene(game, currentScene);
        }

        await fadeOut(game, 5000);
    };

    // 27, -3; 27, -4
    onExit (game: Game, currentScene: Scene) {

    };
    render(game: Game, currentScene: Scene) {

    };

    getStartTile(): Map<String, [TileCoordinate, (game: Game) => boolean]> {
        return new Map([
            ["teknik.js", [new TileCoordinate(26.5, -3), (game: Game) => true]],
            ["default", [new TileCoordinate(-1, 6.5), (game: Game) => true]]
        ]);
    };
}

function goliCutScene(game: Game, currentScene: Scene) {
    let goli = {
        top: new Sprite("assets/people.png", 0, 0, 10),
        bottom: new Sprite("assets/people.png", 0, 1, 10),
        tilecoord: new TileCoordinate(-1, 3)
    }

    let charecter = new BigSprite(
        new Sprite("assets/faces.png", 8, 0, 0),
        new Sprite("assets/faces.png", 9, 0, 0),
        new Sprite("assets/faces.png", 8, 1, 0),
        new Sprite("assets/faces.png", 9, 1, 0)
    );

    let feet = currentScene.getTile(goli.tilecoord.add(new TileCoordinate(0, 1)))!;
    let head = currentScene.getTile(goli.tilecoord)!;

    game.getPlayer().freezeMovment();
    game.getInputHandler().preventInteraction();

    feet.setCollisonRule(CollisionRule.Solid);
    head.setCollisonRule(CollisionRule.Solid);
    feet.getSprites().push(goli.bottom);
    head.getSprites().push(goli.top);

    let sequence = new Sequence([
        new SequenceItem(
            new WaitSequenceItem(1000),
            (item, ctx) => {
                (item as WaitSequenceItem).run();
            }
        ),
        new SequenceItem(
            new NPCTextAnimation(charecter, "Hej, jag heter Göran men du kan kalla mig GOLI..... använd dig av WASD för att röra dig och klicka på K för att interagera med objekt och dialog.", 8000, game.getInputHandler()),
            (item, ctx) => {
                (item as NPCTextAnimation).render(ctx, game);
            }
        ),
        new SequenceItem(
            new NPCTextAnimation(charecter, "Om du tycker jag pratar för långsamt kan du snabbspola dialog genom att trycka på L.", 5000, game.getInputHandler()),
            (item, ctx) => {
                (item as NPCTextAnimation).render(ctx, game);
            }
        ),
        new SequenceItem(
            new NPCTextAnimation(charecter, "Men i varje fall varmt välkommen till Åva gymmnasium där alla är välkomna. *mumlar för sig själv* Förutom tibble elever...", 5000, game.getInputHandler()),
            (item, ctx) => {
                (item as NPCTextAnimation).render(ctx, game);
            }
        ),
        new SequenceItem(
            new NPCTextAnimation(charecter, "Men jag ska inte störa dig mer, jag hörde att du var på väg till teknikhallen, den ligger till höger rakt fram.", 5000, game.getInputHandler()),
            (item, ctx) => {
                (item as NPCTextAnimation).render(ctx, game);
            }
        ),
        new SequenceItem(
            new NPCTextAnimation(charecter, "Hejdå!", 800, game.getInputHandler()),
            (item, ctx) => {
                (item as NPCTextAnimation).render(ctx, game);
            }
        ),
        new SequenceItem(new AsyncCodeSequenceItem(() => {
            return fadeIn(game, 1000);
        }), (item, ctx) => {
            (item as AsyncCodeSequenceItem).run();
        }),
        new SequenceItem(
            new CodeSequenceItem(() => {
                feet.setCollisonRule(CollisionRule.None);
                head.setCollisonRule(CollisionRule.None);
                feet.getSprites().splice(feet.getSprites().indexOf(goli.bottom), 1);
                head.getSprites().splice(head.getSprites().indexOf(goli.top), 1);

                game.getPlayer().unfreezeMovment();
                game.getInputHandler().allowInteraction();
            }),
            (item, ctx) => {
                (item as CodeSequenceItem).run();
            }
        ),
        new SequenceItem(new AsyncCodeSequenceItem(() => {
            return fadeOut(game, 4000);
        }), (item, ctx) => {
            (item as AsyncCodeSequenceItem).run();
        }),

    ])
    game.getSequenceExecutor().setSequence(sequence);
}

