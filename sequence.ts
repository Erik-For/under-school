export abstract class SequenceCallback {
    onFinish(): void {};
}

export class SequenceItem {
    execute: (item: SequenceCallback, ctx: CanvasRenderingContext2D) => void
    item: SequenceCallback;
    
    constructor(item: SequenceCallback, execute: (item: SequenceCallback, ctx: CanvasRenderingContext2D) => void) {
        this.execute = execute;
        this.item = item;
    }
}

export class SequenceExecutor {
    sequence: Sequence | undefined;

    constructor() {
        this.sequence = undefined;
    }

    execute(ctx: CanvasRenderingContext2D) {
        this.sequence?.execute(ctx);
    }

    setSequence(sequence: Sequence) {
        this.sequence = sequence;
    }
}

export class CodeSequenceItem extends SequenceCallback {
    #code: () => void;

    constructor(code: () => void) {
        super();
        this.#code = code;
    }

    run() {
        this.#code();
        this.onFinish();
    }


}

export class Sequence {
    items: SequenceItem[];
    currentIndex: number;

    constructor(items: SequenceItem[]) {
        this.items = items;
        this.currentIndex = 0;
        items.forEach((item) => {
            item.item.onFinish = () => {
                item.item.onFinish = () => {};
                this.currentIndex++;
            }
        })
    }

    execute(ctx: CanvasRenderingContext2D) {
        if(this.currentIndex >= this.items.length){
            return;
        }
        this.items[this.currentIndex].execute(this.items[this.currentIndex].item, ctx);
    }

    reset() {
        this.currentIndex = 0;
        this.items.forEach((item) => {
            item.item.onFinish = () => {
                item.item.onFinish = () => {};
                this.currentIndex++;
            }
        })
    }
}
