
import { _decorator, Component, Node, director, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LoadScene')
export class LoadScene extends Component {

    onLoad () {
        view.setDesignResolutionSize(640, 960, 2);
    }
    public loadBunny () {
        director.loadScene('BunnyTest');
    }
    public loadFrame () {
        director.loadScene('BunnyFrameAnimationTest');
    }
    public loadTransform () {
        director.loadScene('BunnyTransformAnimationTest');
    }
    public loadUI () {
        director.loadScene('UITest');
    }
    public loadSpine () {
        director.loadScene('spine');
    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */
