export abstract class SequenceCallback {
    onFinish(): void {};
}

export class SequenceItem {
    execute: (item: SequenceCallback) => void
    item: SequenceCallback;

    constructor(item: SequenceCallback, execute: (item: SequenceCallback) => void) {
        this.execute = execute;
        this.item = item;
    }
}

export class SequenceExecutor {
    sequence: Sequence | undefined;

    constructor() {
        this.sequence = undefined;
    }

    execute() {
        this.sequence?.execute();
    }

    setSequence(sequence: Sequence) {
        this.sequence = sequence;
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

    execute() {
        if(this.currentIndex >= this.items.length){
            return;
        }
        this.items[this.currentIndex].execute(this.items[this.currentIndex].item);
    }
}
