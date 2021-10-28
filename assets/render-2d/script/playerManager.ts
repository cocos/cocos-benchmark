
import { _decorator, Component, Node, view, Prefab, instantiate, EditBox } from 'cc';
import { Player } from './player';
const { ccclass, property } = _decorator;

@ccclass('PlayerManager')
export class PlayerManager extends Component {

    @property([Prefab])
    playerPrefabs: Prefab[] = [];

    @property(EditBox)
    numberInput: EditBox | null = null;

    playerList: Player[] = [];
    spriteNum = 0;

    update () {
        this.playerMove();
    }

    playerMove () {
        let num = this.playerList.length;
        for (let i = 0; i < num; i++) {
            const player = this.playerList[i];
            player.move();
        }
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
            for (let i =  0; i < addNum; i++) {
                const pfPlayer = this.playerPrefabs[i%this.playerPrefabs.length];
                let sprite = instantiate(pfPlayer) as Node;
                sprite.parent = this.node;
                let playerScript = sprite.getComponent(Player) as Player;
                playerScript.show();
                this.playerList.push(playerScript);
            }

            this.spriteNum = num;
        } else { // reduce
            const deleteNum = this.spriteNum - num;
            for (let i = 0; i < deleteNum; i++) {
                const playerScript = this.playerList.pop();
                if (!playerScript) {
                    return;
                }
                playerScript.node.destroy();
            }
            this.spriteNum = num;
        }
    }
}

