
import { _decorator, Component, Node, EditBox, instantiate, randomRange, SphereLightComponent, Vec3, Color, MeshRenderer } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = CreateObject
 * DateTime = Thu Dec 23 2021 17:44:49 GMT+0800 (GMT+08:00)
 * Author = xu58895777
 * FileBasename = CreateObject.ts
 * FileBasenameNoExtension = CreateObject
 * URL = db://assets/scripts/CreateObject.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */
 
@ccclass('CreateObject')
export class CreateObject extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    @property(Node)
    object: Node = null!;
    private _initP = new Vec3(0.0, 0.0, 0.0);
    private _nowP = new Vec3(0.0, 0.0, 0.0);
    @property(Number)
    range: number = 20;
    start () 
    {
        
        
    }
    createObject(box:EditBox)
    {
        let lightCnt = parseInt(box.string);
        for(let i = 0; i < lightCnt; i++){
            const lightInst = instantiate(this.object!) as Node;
            lightInst.parent = this.node;
            const rangex = randomRange(-this.range,this.range);
            const rangey = randomRange(-this.range,this.range);
            const rangez = randomRange(-this.range,this.range);
            console.log(rangex);
            lightInst.position = new Vec3(rangex, rangey, rangez);
            lightInst.getWorldPosition(this._initP);
        }
        
    }
    removeAll()
    {
        this.node.removeAllChildren();
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/zh/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/zh/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/zh/scripting/life-cycle-callbacks.html
 */
