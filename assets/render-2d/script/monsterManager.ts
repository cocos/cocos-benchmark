
import { _decorator, Component, Node, Prefab, instantiate } from 'cc';
import { GameManager } from './gameManager';
const { ccclass, property } = _decorator;

@ccclass('MonsterManager')
export class MonsterManager extends Component {

    @property([Prefab])
    monPrefabs: Prefab[] = [];

    monList: Node[] = [];
    spriteNum = 0;

    randomX = 0;
    randomY = 0;

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
                const pfSprite = this.monPrefabs[i%this.monPrefabs.length];
                let sprite = instantiate(pfSprite) as Node;
                sprite.parent = this.node;
                this.randomX = Math.random() * (GameManager.maxX - GameManager.minX) + GameManager.minX;
                this.randomY = Math.random() * (GameManager.maxY - GameManager.minY) + GameManager.minY;
                sprite.setPosition(this.randomX, this.randomY, 0);
                this.monList.push(sprite);
            }
            this.spriteNum = num;
        } else { // reduce
            const deleteNum = this.spriteNum - num;
            for (let i = 0; i < deleteNum; i++) {
                const sprite = this.monList.pop();
                if (!sprite) {
                    return;
                }
                sprite.destroy();
            }
            this.spriteNum = num;
        }
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
