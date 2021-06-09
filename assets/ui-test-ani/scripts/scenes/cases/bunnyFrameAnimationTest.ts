import { _decorator, Prefab, Label, Component, instantiate, Node, profiler } from 'cc';
const { ccclass, property } = _decorator;

let bunnyType = 0;
let totalCount = 0;
let count = 0;
let amount = 0;
@ccclass('BunnyFrameAnimationTest')
export class BunnyFrameAnimationTest extends Component {
    @property(Prefab)
    public prefabBunny:Prefab | null = null;
    @property(Label)
    public number:Label | null = null;
    @property(Node)
    public root:Node | null = null;

    private bunnys: Node[] = [];

    onLoad () {
        this.reset();
        if (!profiler._stats) {
            profiler.showStats();
        }
    }

    reset () {
        this.bunnys = [];
        bunnyType = 0;
        totalCount = 100;
        count = 0;
        amount = 50;
    }

    update (dt: any) {
        let bunny: Node, i;
        if (this.bunnys.length < totalCount) {
           for (i = 0; i < amount; i++) {
               bunny = instantiate(this.prefabBunny);
               bunny.getComponent("PrefabAnimationBunny").init(bunnyType, 1);
               this.root!.addChild(bunny);
               this.bunnys.push(bunny);
               count++;
           }
           this.number.string = count;
           bunnyType++;
           bunnyType %= 5;
        }
    }

    addItem () {
        totalCount += 100;
    }

    reduceItem () {
        totalCount -= 100;
    }

}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// const baseRenderScene = require("baseRenderScene");
// let config = require("config");
// 
// let bunnyType = 0;
// let totalCount = 0;
// let count = 0;
// let amount = 0;
// 
// cc.Class({
//     extends: baseRenderScene,
// 
//     properties: {
//         prefabBunny: cc.Prefab,
//         number: cc.Label
//     },
// 
//     // use this for initialization
//     onLoad: function () {
//         this._super(this.name.match(/<(\S*)>/)[1]);
// 
//         this.number.node.zIndex = config.HIGHEST_ZINDEX;
// 
//         this.reset();
//     },
// 
//     reset: function () {
//         this.bunnys = [];
//         
//         bunnyType = 0;
//         totalCount = config.SCENE_ARGS.count;
//         count = 0;
//         amount = 50;
//     },
// 
//     // called every frame, uncomment this function to activate update callback
//     update: function (dt) {
//         let bunny, i;
//         if (this.bunnys.length < totalCount) {
//             for (i = 0; i < amount; i++) {
//                 bunny = cc.instantiate(this.prefabBunny);
//                 bunny.getComponent("prefabAnimationBunny").init(bunnyType, 1);
//                 this.node.addChild(bunny);
//                 this.bunnys.push(bunny);
//                 count++;
//             }
//             this.number.string = count;
//             bunnyType++;
//             bunnyType %= 5;
//         }
//     },
// });
