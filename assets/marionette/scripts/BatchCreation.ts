import { _decorator, Component, Node, Prefab, instantiate, profiler, EditBox } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BatchCreation')
export class BatchCreation extends Component {
    @property(Prefab)
    public prefab!: Prefab;

    @property
    public maxIncrementsPerFrame = 500;

    @property
    public expectedCount = 0;

    start() {
        if (!profiler._stats) {
            profiler.showStats();
        }
    }

    update(_deltaTime: number) {
        this._resize();
    }

    public setAmountFromEditBox(editBox: EditBox) {
        const amount = Number.parseInt(editBox.string);
        if (Number.isNaN(amount)) {
            return;
        }
        this.expectedCount = amount;
    }

    private _instances: Node[] = [];

    private _resize() {
        const { _instances: instances, expectedCount } = this;
        const dCount = expectedCount - instances.length;
        if (dCount === 0) {
            return;
        }
        if (dCount > 0) {
            const c = Math.min(this.maxIncrementsPerFrame, dCount);
            for (let i = 0; i < c; ++i) {
                const instance = instantiate(this.prefab);
                this.node.addChild(instance);
                this._instances.push(instance);
            }
        } else {
            for (let i = expectedCount; i < instances.length; ++i) {
                this._instances[i].destroy();
            }
            this._instances.length = expectedCount;
        }
    }
}


