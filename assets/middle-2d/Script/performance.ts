import { _decorator, Component, Node, director, instantiate, Prefab, isPropertyModifier, Label , view, Vec3} from 'cc';
const { ccclass, property } = _decorator;


var addCount = 10;
var delCount = 10;

@ccclass('Performance')
export class Performance extends Component {

    @property({ type: [Prefab] })
    prefabArr: Prefab[] = [];

    @property({ type: Node })
    container: Node | null = null;

    @property({ type: Label })
    num: Label | null = null;

    objArr:Node[] = [];

    start () {
        this.objArr = [];
        this.num!.string = "0";
    }

    add () {
        let viewSize = view.getVisibleSize();
        for (var i = 0;i < addCount;i++) {
            var node = instantiate(this.prefabArr[i%this.prefabArr.length]);
            let pos = new Vec3();
            pos.x = (Math.random() - 0.5) * viewSize.width;
            pos.y = (Math.random() - 0.5) * viewSize.height;
            node.setPosition(pos);
            node.setScale(0.3, 0.3, 1.0);
            this.container!.addChild(node);
            this.objArr.push(node);
        }
        this.num!.string = this.objArr.length + "";
    }

    del () {
        for (var i = 0;i < delCount; i++) {
            var node = this.objArr.pop();
            if (node) {
                node.destroy();
            }
        }
        this.num!.string = this.objArr.length +"";
    }
 
    back () {
        director.loadScene('start');
    }

}
