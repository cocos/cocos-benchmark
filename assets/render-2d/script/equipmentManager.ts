
import { _decorator, Component, Node, Prefab, instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EquipmentManager')
export class EquipmentManager extends Component {

    @property([Prefab])
    equPrefabs: Prefab[] = [];

    @property(Node)
    listNode: Node | null = null;

    equList: Node[] = [];
    spriteNum = 0;

    start () {
        // [3]
    }

    updateSpriteNumber (num: number) {
        if (this.spriteNum === num) {
            return;
        }
        if (num < 0) {
            num = 0;
        }

        // add
        if (num > this.spriteNum) {
            const addNum = num - this.spriteNum;
            for (let i = 0; i < addNum; i++) {
                const pfSprite = this.equPrefabs[i%this.equPrefabs.length];
                let sprite = instantiate(pfSprite) as Node;
                sprite.parent = this.listNode!;
                this.equList.push(sprite);
            }
            this.spriteNum = num;
        } else { // reduce
            const deleteNum = this.spriteNum - num;
            for (let i = 0; i < deleteNum; i++) {
                const sprite = this.equList.pop();
                if (!sprite) {
                    return;
                }
                sprite.destroy();
            }
            this.spriteNum = num;
        }
    }

    showBackPack () {
        this.node.active = true;
    }

    closeBcakPack () {
        this.node.active = false;
    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.3/manual/zh/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.3/manual/zh/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.3/manual/zh/scripting/life-cycle-callbacks.html
 */
