import { _decorator, Label, Component, SpriteFrame, rect, Sprite, Node, SystemEventType, Layers } from 'cc';
const { ccclass, property } = _decorator;

let bunnyType = 0;
let gravity = 0;
let maxX = 0;
let minX = 0;
let maxY = 0;
let minY = 0;
let isAdding = false;
let count = 0;
let amount = 0;
@ccclass('BunnyTest')
export class BunnyTest extends Component {

    @property([SpriteFrame])
    bunnyFrames: SpriteFrame[] = [];

    @property(Label)
    public number:Label | null = null;

    currentFrame: any;
    bunnys: any[];

    onLoad () {
        this.reset();
        this.node.on(SystemEventType.TOUCH_START, () => {
           isAdding = true;
        });
        this.node.on(SystemEventType.TOUCH_END, () => {
           bunnyType++;
           bunnyType %= 5;
           this.currentFrame = this.bunnyFrames[bunnyType];
           isAdding = false;
        });
        this.node.on(SystemEventType.TOUCH_CANCEL, () => {
           bunnyType++;
           bunnyType %= 5;
           this.currentFrame = this.bunnyFrames[bunnyType];
           isAdding = false;
        });
    }

    reset () {
        this.bunnys = [];
        this.currentFrame = this.bunnyFrames[0];
        bunnyType = 0;
        gravity = 0.5;
        maxX = cc.winSize.width / 2;
        maxY = cc.winSize.height / 2;
        minX = -maxX;
        minY = -maxY;
        isAdding = false;
        count = 0;
        amount = 100;
    }

    update (dt: any) {
        let bunny, bunnysp, i;
        if (isAdding) {
           for (i = 0; i < amount; i++) {
               bunny = new Node();
               bunny.layer = Layers.Enum.UI_2D;
               bunnysp = bunny.addComponent(Sprite);
               bunnysp.spriteFrame = this.currentFrame;
               bunny.speedX = Math.random() * 10;
               bunny.speedY = (Math.random() * 10) - 5;
               let x = minX + 10;
               let y = maxY * 0.7;
               bunny.setPosition(x, y, 0);
               this.bunnys.push(bunny);
               this.node.addChild(bunny);
               count++;
           }
           this.number.string = count;
        }
        for (i = 0; i < this.bunnys.length; i++) {
           bunny = this.bunnys[i];
           let x = bunny.x + bunny.speedX;
           let y = bunny.y - bunny.speedY;
           bunny.speedY += gravity;
           if (x > maxX) {
               bunny.speedX *= -1;
               x = maxX;
           }
           else if (x < minX) {
               bunny.speedX *= -1;
               x = minX;
           }
           if (y < minY) {
               bunny.speedY *= -0.85;
               y = minY;
               if (Math.random() > 0.5) {
                   bunny.speedY -= Math.random() * 6;
               }
           }
           else if (y > maxY) {
               bunny.speedY = 0;
               y = maxY;
           }
           bunny.setPosition(x, y);
        }
    }

}
