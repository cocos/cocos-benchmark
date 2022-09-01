
import { _decorator, Component, Node, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SpriteNoRender')
export class SpriteNoRender extends Sprite {
    get spriteFrame () {
        return this._spriteFrame;
    }
    set spriteFrame (value) {
        return;
    }
}
