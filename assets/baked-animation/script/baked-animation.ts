import { _decorator, Component, director, EventTouch, find, instantiate, Label, Node, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('baked_animation')
export class baked_animation extends Component {
    @property(Prefab)
    prefab: Prefab = null!;

    private labFpsTime: Label = null!;
    private labCount: Label = null!;
    private labLogicTime: Label = null!;
    private prefabRoot: Node = null!;

    private updateNodesTime = 0;

    protected onLoad(): void {
        this.labFpsTime = find('Canvas/labFpsTime')!.getComponent(Label)!;
        this.labCount = find('Canvas/labCount')!.getComponent(Label)!;
        this.labLogicTime = find('Canvas/labLogicTime')!.getComponent(Label)!;
        this.prefabRoot = find('prefabRoot')!;
        this.schedule(this.updateStats, 0.5);
    }

    update() {
        this.updateNodes();
    }

    private updateNodes() {
        const rand = (Math.random() - 0.5) * 0.01;
        const now = performance.now();
        this.prefabRoot.children.forEach(child => {
            let { x, y, z } = child.position;
            child.setPosition(x + rand, y + rand, z + rand);
            child.angle += rand;
        });
        this.updateNodesTime = performance.now() - now;
    }

    private updateStats() {
        this.labFpsTime.string = `fps: ${director.root!.fps.toFixed(2)}ms`;
        this.labLogicTime.string = `耗时: ${this.updateNodesTime.toFixed(2)}ms`;
        this.labCount.string = '数量: ' + this.prefabRoot.children.length;
    }

    onClickAddNode(e: EventTouch) {
        const count = Number((e.target! as Node).children[0]!.getComponent(Label)!.string);
        const parent = this.prefabRoot;
        for (let i = 0; i < count; i++) {
            const node = instantiate(this.prefab);
            const idx = parent.children.length;
            const x = -5 + 10 * (idx % 51) / 50;
            const z = 0 + 0.6 * (Math.floor(idx / 50));
            node.parent = parent;
            node.setPosition(x, 1, z);
        }
    }

    onClickClearNodes() {
        this.prefabRoot.children.forEach(child => {
            child.destroy();
        });
    }
}

