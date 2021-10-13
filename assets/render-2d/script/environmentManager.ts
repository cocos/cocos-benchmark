
import { _decorator, Component, Node, Prefab, instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EnvironmentManager')
export class EnvironmentManager extends Component {

    @property([Prefab])
    envPrefabs: Prefab[] = [];

    envList: Node[] = [];
    spriteNum = 0;

    @property([Node])
    rootList: Node[] = [];
    currentRoot: Node | null = null;

    start () {
        // [3]
        this.currentRoot = this.rootList[0];
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
                const pfSprite = this.envPrefabs[i%this.envPrefabs.length];
                let sprite = instantiate(pfSprite) as Node;
                sprite.parent = this.currentRoot;
                this.envList.push(sprite);
            }
            this.spriteNum = num;
        } else { // reduce
            const deleteNum = this.spriteNum - num;
            for (let i = 0; i < deleteNum; i++) {
                const sprite = this.envList.pop();
                if (!sprite) {
                    return;
                }
                sprite.destroy();
            }
            this.spriteNum = num;
        }
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}
