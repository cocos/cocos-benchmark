
import { _decorator, Component, Node } from 'cc';
import { boundingBox } from './boundingBox';
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
        this.node.setPosition(boundingBox.minX + 10, boundingBox.maxY * 0.7, 0);
    }

    move () {
        let speedX = this.speedX;
        let speedY = this.speedY;
        let x = this.node.position.x + speedX;
        let y = this.node.position.y - speedY;

        if (x > boundingBox.maxX) {
            speedX = -1 * speedX;
            x = boundingBox.maxX;
        } else if (x < boundingBox.minX) {
            speedX = -1 * speedX;
            x = boundingBox.minX;
        }

        if (y < boundingBox.minY) {
            speedY = -1 * speedY;
            y = boundingBox.minY;
        } else if (y > boundingBox.maxY) {
            speedY = -1 * speedY;
            y = boundingBox.maxY;
        }
        this.speedX = speedX;
        this.speedY = speedY;
        this.node.setPosition(x, y, 0);
    }
}
