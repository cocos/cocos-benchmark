
import { _decorator, Component, Node } from 'cc';
import { GameManager } from './gameManager';
const { ccclass } = _decorator;

@ccclass('Player')
export class Player extends Component {

    speedX = 0;
    speedY = 0;

    start () {
        // [3]
        this.speedX = Math.random() * 10;
        this.speedY = (Math.random() * 10) - 5;
    }

    show () {
        this.node.setPosition(GameManager.minX + 10, GameManager.maxY * 0.7, 0);
    }

    move () {
        let speedX = this.speedX;
        let speedY = this.speedY;
        let x = this.node.position.x + speedX;
        let y = this.node.position.y - speedY;

        if (x > GameManager.maxX) {
            speedX = -1 * speedX;
            x = GameManager.maxX;
        } else if (x < GameManager.minX) {
            speedX = -1 * speedX;
            x = GameManager.minX;
        }

        if (y < GameManager.minY) {
            speedY = -1 * speedY;
            y = GameManager.minY;
        } else if (y > GameManager.maxY) {
            speedY = -1 * speedY;
            y = GameManager.maxY;
        }
        this.speedX = speedX;
        this.speedY = speedY;
        this.node.setPosition(x, y, 0);
    }
}
