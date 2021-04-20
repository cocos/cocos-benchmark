import { _decorator, Component, SpriteFrame, Sprite, Animation } from 'cc';
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

    @property(Animation)
    ani: Animation = null;
    
    private aniType = 0;

    start () {
        if (this.aniType === 0) {
            this.ani.play('bunnyTransform');
        } else if (this.aniType === 1) {
            this.ani.play('bunnyFrame');
        }
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
