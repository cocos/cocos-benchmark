import { _decorator, Component, SpriteFrame, Sprite, Animation, macro } from 'cc';
const { ccclass, property } = _decorator;

let maxX = 0;
let minX = 0;
let maxY = 0;
let minY = 0;
@ccclass('PrefabAnimationBunny')
export class PrefabAnimationBunny extends Component {
    @property
    public bunnySpriteFrames:SpriteFrame[] = [];

    @property(Sprite)
    sprite: Sprite = null;

    frameType = 0;

    start () {
        this.schedule(this.changeSprite, 1, macro.REPEAT_FOREVER, 1);
    }

    init (bunnyType: any, aniType: any) {
        this.aniType = aniType;
        maxX = cc.winSize.width / 2;
        maxY = cc.winSize.height / 2;
        minX = -maxX;
        minY = -maxY;
        let bunnySpriteFrame = this.bunnySpriteFrames[bunnyType];
        this.sprite.spriteFrame = bunnySpriteFrame;
        let x = Math.random() * (maxX - minX) + minX;
        let y = Math.random() * (maxY - minY) + minY;
        this.node.setPosition(x, y, 0);
        // this.node.anchorY = 1;
    }

    changeSprite () {
        this.frameType++;
        let type = this.frameType % 5;
        let bunnySpriteFrame = this.bunnySpriteFrames[type];
        this.sprite.spriteFrame = bunnySpriteFrame;
    }

}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// let maxX = 0;
// let minX = 0;
// let maxY = 0;
// let minY = 0;
// 
// cc.Class({
//     extends: cc.Component,
// 
//     properties: {
//         bunnySpriteFrames:[cc.SpriteFrame],
//     },
// 
//     // use this for initialization
//     onLoad: function () {
//         if (this.aniType === 0) {
//             this.node.getComponent(cc.Animation).play("bunnyTransform");    
//         }else if (this.aniType === 1) {
//             this.node.getComponent(cc.Animation).play("bunnyFrame");
//         }
//     },
// 
//     init: function (bunnyType, aniType) {
//         this.aniType = aniType;
// 
//         maxX = cc.winSize.width / 2;
//         maxY = cc.winSize.height / 2;
//         minX = -maxX;
//         minY = -maxY;
// 
//         let bunnySpriteFrame = this.bunnySpriteFrames[bunnyType];
//         this.node.getComponent(cc.Sprite).spriteFrame = bunnySpriteFrame;
//         
//         this.node.x = Math.random() * (maxX - minX) + minX;
//         this.node.y = Math.random() * (maxY - minY) + minY;
//         this.node.anchorY = 1;
//         //bunny.alpha = 0.3 + Math.random() * 0.7;
//         // this.node.scale = 0.5 + Math.random() * 0.5;
//         // this.node.rotation = 360 * (Math.random() * 0.2 - 0.1);
//     },
// });
