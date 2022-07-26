import { _decorator, Component, SpriteFrame, Sprite, Animation } from 'cc';
import { SpriteNoRender } from './spriteNoRender';
const { ccclass, property } = _decorator;

let maxX = 0;
let minX = 0;
let maxY = 0;
let minY = 0;
@ccclass('PrefabAnimationBunnyNoRender')
export class PrefabAnimationBunnyNoRender extends Component {
    @property
    public bunnySpriteFrames:SpriteFrame[] = [];

    @property(SpriteNoRender)
    sprite: SpriteNoRender = null;

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
    }

}
