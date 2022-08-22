
import * as cc from 'cc';
const { ccclass, property } = cc._decorator;

/**
 * Predefined variables
 * Name = Test
 * DateTime = Thu Mar 10 2022 16:23:13 GMT+0800 (中国标准时间)
 * Author = warde.huang
 * FileBasename = Test.ts
 * FileBasenameNoExtension = Test
 * URL = db://assets/Test.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */

@ccclass('Test')
export class Test extends cc.Component {

    private label: cc.Label;
    private label1: cc.Label;
    private label10: cc.Label;

    private nodePool: cc.NodePool;

    private elapse: number = 0;

    start() {
        
        cc.find("Load", this.node).on("click", this.load, this);
        cc.find("Unload", this.node).on("click", this.unLoad, this);
        cc.find("Show", this.node).on("click", this.show, this);

        this.label = cc.find("Label", this.node).getComponent(cc.Label);
        this.label1 = cc.find("Label1", this.node).getComponent(cc.Label);
        this.nodePool = new cc.NodePool();
    }

    show() {
        cc.resources.load("LordLavaArea", cc.Prefab, null, (error, asset) => {
            if (error) {
                console.error('load asset failed', error);
                return;
            }
            let node: cc.Node = cc.instantiate(asset);
            node.setParent(cc.find("Node"));
            node.setPosition(0, 0, 0);
        });
    }

    load() {
        let time = Date.now();

        cc.resources.load("LordLavaArea", cc.Prefab, null, (error, asset) => {
            if (error) {
                console.error('load asset failed', error);
                return;
            }
            for (let i = 0; i < 10; ++i) {
                let node: any = cc.instantiate(asset);
                this.nodePool.put(node);
            }

            this.label.string = "池大小：" + this.nodePool.size() + " \n此次耗时：" + (Date.now() - time);
            console.log("池大小：" + this.nodePool.size() + " 此次耗时：" + (Date.now() - time))
        });
    }

    unLoad() {
        this.nodePool.clear();
        this.label.string = "池大小：" + this.nodePool.size();
        this.elapse = 0;
        cc.sys.garbageCollect();
        // wx.triggerGC();
    }

    update(dt) {
        // this.elapse += dt;
        // this.label1.string = "时间：" + this.elapse;
    }

    load10() {
        let time = Date.now();
        let sumTime = 0;

        for (let n = 1; n < 11; ++n) {
            cc.resources.load("LordLavaArea", cc.Prefab, null, (error, asset) => {
                if (error) {
                    console.error('load asset failed', error);
                    return;
                }
                for (let i = 0; i < 10; ++i) {
                    let node: any = cc.instantiate(asset);
                    this.nodePool.put(node);
                }

                this.label.string = "池大小：" + this.nodePool.size() + "\n累计" +  n + "次耗时：" + (Date.now() - time) + "\n平均耗时：" + ((Date.now() - time)/n).toFixed(2);
                console.log("池大小：" + this.nodePool.size() + "  累计" +  n + "次耗时：" + (Date.now() - time) + "  平均耗时：" + ((Date.now() - time)/n).toFixed(2))
                sumTime += (Date.now() - time);
            });
        }

        // this.label.string = "池大小：" + this.nodePool.size() + " 耗时：" + (Date.now() - time + "平均耗时：" + sumTime/10);
        // console.log("池大小：" + this.nodePool.size() + " 耗时：" + (Date.now() - time) + "平均耗时：" + sumTime/10)

    }

}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.3/manual/zh/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.3/manual/zh/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.3/manual/zh/scripting/life-cycle-callbacks.html
 */
