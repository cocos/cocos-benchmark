import { _decorator, Node, SpriteFrame, LabelComponent, SpriteComponent, Vec3, Component, UITransformComponent, Layers } from "cc";
const { ccclass, property } = _decorator;

class BunnyMarkData {
    speedX = 0;
    speedY = 0;
    owner: Node = null;
    innerText = '';

    get x (){
        return this.owner.position.x;
    }

    get y (){
        return this.owner.position.y;
    }
}

const bunnys: any[] = [];
let currentFrame = null;
let bunnyType = 0;
const gravity = 0.5;
let originNodeCount= 0;

let maxX = 0;
let minX = 0;
let maxY = 0;
let minY = 0;

let isAdding = false;
let count = 0;
let number: LabelComponent = null;

const amount = 500;

let checking = false;
let totalDt = 0;
let frames = 0;
let startTime = 0;

function beforeUpdate() {
    if (checking) {
        startTime = Date.now();
    }
}

function afterDraw() {
    if (checking) {
        if (startTime === 0) {
            return;
        }
        const endTime = Date.now();
        totalDt += endTime - startTime;
        frames++;
    }
}

@ccclass("BunnyMark")
export class BunnyMark extends Component {
    @property([SpriteFrame])
    frames: SpriteFrame[] = [];
    @property
    levelCount = 10;
    @property(LabelComponent)
    number: LabelComponent = null;

    _euler = new Vec3();

    onLoad() {
        number = this.number;
        number.node.active = true;
        const pos = number.node.position;
        number.node.setPosition(pos.x, pos.y, 100);

        maxX = cc.winSize.width / 2;
        maxY = cc.winSize.height / 2;
        minX = -maxX;
        minY = -maxY;

        for (let i = 0; i < this.levelCount; i++) {
            bunnys[i] = [];
        }

        currentFrame = this.frames[0];
        originNodeCount = this.node.children.length;
        // this.node.on(Node.EventType.TOUCH_START, function () {
        //     isAdding = true;
        // });
        // this.node.on(Node.EventType.TOUCH_END, function () {
        //     isAdding = false;
        //     bunnyType++;
        //     bunnyType %= 5;
        //     currentFrame = this.frames[bunnyType];
        // }, this);
        // this.node.on(Node.EventType.TOUCH_CANCEL, function () {
        //     isAdding = false;
        // });

        // this.add();
        // this.addOne();

        // if (this.showFPS) {
        //     let now = Date.now();
        //     _fpsCounter = new PerfCounter('fps', { average: 500 }, now);
        //     _fps = this.fps;

        //     director.on(director.EVENT_AFTER_DRAW, fpsAfterDraw);
        //     director.setDisplayStats(false);
        // }
        // else {
        //     this.fps.node.active = false;
        // }

        // this._createBackUI('BunnyMark');
    }

    // add() {
    //     this.addOnce();
    //     this.scheduleOnce(this.check, 5);
    // }

    // check() {
    //     checking = true;
    //     totalDt = 0;
    //     frames = 0;
    //     startTime = 0;
    //     director.on(Director.EVENT_BEFORE_UPDATE, beforeUpdate);
    //     director.on(Director.EVENT_AFTER_DRAW, afterDraw);
    //     this.scheduleOnce(this.checkEnd, 3);
    // }

    // checkEnd() {
    //     checking = false;
    //     director.off(Director.EVENT_BEFORE_UPDATE, beforeUpdate);
    //     director.off(Director.EVENT_AFTER_DRAW, afterDraw);
    //     let dt = totalDt / frames;
    //     if (dt > 20) {
    //         number.string = "STOPPED !!! \nFINAL SCORE : " + count;
    //     }
    //     else {
    //         bunnyType++;
    //         bunnyType %= this.frames.length;
    //         currentFrame = this.frames[bunnyType];
    //         if (dt < 1) dt = 1;
    //         const extra = Math.floor(20 / dt);
    //         for (let i = 0; i < extra; i++) {
    //             this.addOnce();
    //         }
    //         this.add();
    //     }
    // }

    // addOne() {
    //     let bunny: Node, bunnysp: SpriteComponent;
    //     bunny = new Node();
    //     bunnysp = bunny.addComponent(SpriteComponent);
    //     bunnysp.spriteFrame = currentFrame;
    //     const data = new BunnyMarkData();
    //     data.speedX = Math.random() * 10;
    //     data.speedY = (Math.random() * 10) - 5;
    //     data.x = minX + 10;
    //     data.y = maxY * 0.7;
    //     data.owner = bunny;
    //     bunny.anchorY = 1;
    //     bunnys.push(data);
    //     bunny.setScale(0.3, 0.3, 1);
    //     this._euler.set(0, 0, 360 * (Math.random() * 0.2 - 0.1));
    //     bunny.eulerAngles = this._euler;

    //     this.node.addChild(bunny);
    //     count++;
    //     number.string = count.toString();
    // }

    addOnce() {
        let amountPerLevel = Math.floor(amount / this.levelCount);
        let parent = this.node as Node;

        let bunny: Node, bunnysp, i;
        // Add bunnys
        for (let i = 0; i < this.levelCount; i++) {
            const lbunnys = bunnys[i];
            for (let j = 0; j < amountPerLevel; j++) {
                bunny = new Node();
                bunny.layer = Layers.Enum.UI_2D;
                bunnysp = bunny.addComponent(SpriteComponent);
                bunnysp.spriteFrame = currentFrame;
                const data = new BunnyMarkData();
                data.speedX = Math.random() * 10;
                data.speedY = (Math.random() * 10) - 5;
                data.owner = bunny;
                bunny.setPosition(minX + 10, maxY * 0.7, 0);
                bunny.anchorY = 1;
                //bunny.alpha = 0.3 + Math.random() * 0.7;
                lbunnys.push(data);
                bunny.setScale(0.3, 0.3, 1);
                this._euler.set(0, 0, 360 * (Math.random() * 0.2 - 0.1));
                bunny.eulerAngles = this._euler;

                bunny.parent = parent;
                count++;
            }
            const nextContainer = new Node();
            nextContainer.addComponent(UITransformComponent);
            parent.addChild(nextContainer);
            parent = nextContainer;
        }
        number.string = count.toString();
    }

    reduceOnce() {
        // the one is container
        let amountPerLevel = Math.floor(amount / this.levelCount);
        let children = this.node.children;
        let len = children.length;
        // reduce bunnys
        const startNum = len - 1 - originNodeCount;
        for (let j = 0; j < amountPerLevel + 1; j++) {
            const child = children[startNum - j];
            child.destroy();
        }

        count -= amount;
        number.string = count.toString();

        for (let i = 0; i < this.levelCount; i++) {
            const lbunnys = bunnys[i] as Array<any>;
            if(lbunnys.length >= amountPerLevel){
                lbunnys.splice(lbunnys.length - amountPerLevel, amountPerLevel);
            }
        }

    }

    // called every frame, uncomment this function to activate update callback
    update(dt) {
        if (isAdding) {
            this.addOnce();
            isAdding = false;
        }

        // var start = new Date().getTime();
        for (let i = 0; i < this.levelCount; i++) {
            const lbunnys = bunnys[i] as BunnyMarkData[];
            for (let j = 0; j < lbunnys.length; j++) {
                const bunny = lbunnys[j];

                let speedX = bunny.speedX;
                let speedY = bunny.speedY;
                let x = bunny.x + speedX;
                let y = bunny.y - speedY;
                speedY += gravity;

                if (x > maxX) {
                    speedX = -1 * speedX;
                    x = maxX;
                } else if (x < minX) {
                    speedX = -1 * speedX;
                    x = minX;
                }

                if (y < minY) {
                    speedY = -0.85 * speedY;
                    y = minY;
                    if (Math.random() > 0.5) {
                        speedY = speedY - Math.random() * 6.0;
                    }
                } else if (y > maxY) {
                    speedY = 0.0;
                    y = maxY;
                }
                bunny.speedX = speedX;
                bunny.speedY = speedY;
                bunny.owner.setPosition(x, y, 0);
            }
        }
    }

    public btnAdd(){
        isAdding = true;
        bunnyType++;
        bunnyType %= 5;
        currentFrame = this.frames[bunnyType];
    }

    public btnReduce(){
        this.reduceOnce();
    }
}


