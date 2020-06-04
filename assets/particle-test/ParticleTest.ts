import { _decorator, Component, Node, Prefab, instantiate, LabelComponent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TestParticle')
export class TestParticle extends Component {
    @property(Prefab)
    particleCPU: Prefab = null;
    @property(Prefab)
    particleGPU: Prefab = null;
    @property(Node)
    rootNode: Node = null;
    @property(LabelComponent)
    numLabel: LabelComponent = null;

    private _particleNum = 0;
    
    start () {
        this.numLabel.string = "粒子节点数量："+this._particleNum;
    }

    randomPositionX () {
        return (Math.random() - 0.5) * 20;
    }

    randomPositionY () {
        return (Math.random() - 0.5) * 10;
    }

    addCPU () {
        for (let i = 0; i < 5; i++) {
            const x = this.randomPositionX();
            const y = this.randomPositionY();
            let node = instantiate(this.particleCPU);
            this.rootNode.addChild(node);
            node.setPosition(x, y, 0);
        }

        this._particleNum += 10;
        this.numLabel.string = "粒子节点数量："+this._particleNum;
    }

    addGPU () {
        for (let i = 0; i < 5; i++) {
            const x = this.randomPositionX();
            const y = this.randomPositionY();
            let node = instantiate(this.particleGPU);
            this.rootNode.addChild(node);
            node.setPosition(x, y, 0);
        }

        this._particleNum += 10;
        this.numLabel.string = "粒子节点数量："+this._particleNum;
    }

    clear () {
        this.rootNode.removeAllChildren();
        this._particleNum = 0;
        this.numLabel.string = "粒子节点数量："+this._particleNum;
    }
}
