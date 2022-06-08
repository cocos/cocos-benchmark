import { _decorator, Component, Node, profiler, LabelComponent, SpriteFrame, SpriteComponent, EditBoxComponent, game, director, Director } from 'cc';
import { playerManager } from '../../fight/playerManager';
import { confirmBox } from './confirmBox';
import { constants } from '../../framework/util/constants';
const { ccclass, property } = _decorator;

@ccclass('mainUI')
export class mainUI extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    @property (playerManager)
    manager: playerManager = null; 

    @property (LabelComponent)
    lbFps: LabelComponent = null;

    @property (LabelComponent)
    lbDrawcall: LabelComponent = null;

    @property (LabelComponent)
    lbInstancing: LabelComponent = null;

    @property (LabelComponent)
    lbTriangle: LabelComponent = null;

    @property (LabelComponent)
    lbGFXMem: LabelComponent = null;

    @property (LabelComponent)
    lbGameLogic: LabelComponent = null;

    @property (LabelComponent)
    lbArtTriangle: LabelComponent = null;

    @property (LabelComponent)
    lbModelTriangle: LabelComponent = null;

    @property (LabelComponent)
    lbPeople: LabelComponent = null;

    @property (SpriteFrame)
    imgOn: SpriteFrame = null;

    @property(SpriteFrame)
    imgOff: SpriteFrame = null;

    @property(SpriteComponent)
    spInstacing: SpriteComponent = null;

    @property(SpriteComponent)
    spShadow: SpriteComponent = null;

    @property(SpriteComponent)
    spAliasing: SpriteComponent = null;

    @property(Node)
    nodeConfirmBox: Node = null;

    @property(LabelComponent)
    lbVersion: LabelComponent = null;
    @property(EditBoxComponent)
    numberInput: EditBoxComponent = null;

    count: number = 0;
    curClickLogoTimes: number = 0;
    maxClickLogoTimes: number = 3;

    set enableInstancing (value: boolean) {
        this.manager.enableInstancing = value;

        this.spInstacing.spriteFrame = value ? this.imgOn : this.imgOff;
    }

    get enableInstancing () {
        return this.manager.enableInstancing;
    }

    set enableShadow (value: boolean) {
        this.manager.enableShadow = value;

        this.spShadow.spriteFrame = value ? this.imgOn : this.imgOff;
    }

    get enableShadow () {
        return this.manager.enableShadow;
    }

    private _profilerEnabled = false;

    shareGame (title, imageUrl) {
        if (!window.wx) {
            return;
        }

        window.wx.showShareMenu({
            withShareTicket: true,
            complete: ()=>{

            }
        });

        window.wx.onShareAppMessage(function () {
            // 用户点击了“转发”按钮
            return {
                title: title,
                imageUrl: imageUrl,
                
            };
        });
        
        var updateManager = window['wx'].getUpdateManager();
        updateManager.onUpdateReady(()=>{
            window['wx'].showModal({
                title: '温馨提示',
                content: '新的版本已经准备好, 请重新启动',
                success: (res)=>{
                    if (res.confirm) {
                        updateManager.applyUpdate();
                    }
                }
            })
        })
    }

    start () {
        if (window.cocosAnalytics) {
            window.cocosAnalytics.init({
                appID: "697959573",              // 游戏ID
                version: constants.VERSION,           // 游戏/应用版本号
                storeID: "wechat",     // 分发渠道
                engine: "cocos",            // 游戏引擎
            });
        }

        // Your initialization goes here.

        this.shareGame("更多精彩游戏等你来发现！", "https://res.592you.com/game-shares/cake/imgs/40.jpg");

        if (!profiler.isShowingStats()) {
            this._profilerEnabled = false;
            profiler.showStats();
            profiler._meshRenderer.model.enabled = false;
        }
        else {
            this._profilerEnabled = true;
        }
        
        this.lbVersion.string = 'Version: ' + constants.VERSION;

        this.updateSwitch();

        if (this.manager) {
            this.manager.onPeopleNumChanged = this.onPeopleNumberChanged.bind(this);
        }
    }

    updateSwitch () {
        this.spShadow.spriteFrame = this.enableShadow ? this.imgOn : this.imgOff;

        this.spInstacing.spriteFrame = this.enableInstancing ? this.imgOn : this.imgOff;

        this.spAliasing.spriteFrame = this.manager.enableAntiAliasing ? this.imgOn : this.imgOff;
    }

    onBtnAddClick () {
        this.manager.addPlayerGroup();
    }

    onBtnResetClick () {
        this.manager.resetPlayer();
        this.curClickLogoTimes = 0;
    }

    onBtnReduceClick () {
        //减人
        this.manager.reducePlayer();
    }

    onLogoClick () {
        this.curClickLogoTimes += 1;
        if (this.curClickLogoTimes === this.maxClickLogoTimes) {
            this.manager.addDancer();
        }
    }

    switchInstancing () {
        // this.spInstacing.spriteFrame

        this.enableInstancing = !this.enableInstancing;
    }

    switchAliasing () {
        //跳出提示框
        let str = this.manager.enableAntiAliasing ? '关闭' : '开启';

        this.nodeConfirmBox.getComponent(confirmBox).show(`${str}抗锯齿需要重启游戏`, ()=>{
            this.manager.enableAntiAliasing = !this.manager.enableAntiAliasing;
        }, ()=>{

        });

        this.nodeConfirmBox.active = true;
    }

    switchShadow () {
        this.enableShadow = !this.enableShadow;
    }

    onNumberInputEnd() {
        const num = Number.parseInt(this.numberInput.string);
        this.manager.updatePlayerNumber(num);
    }

    onPeopleNumberChanged(num: number) {
        if (this.numberInput) {
            this.numberInput.string = num.toString();
        }
    }

    update (deltaTime: number) {
        // Your update function goes here.
        this.count++;
        if (this.count > 10 && profiler._stats) {
            this.count = 0;

            //fps
            this.lbFps.string = Math.round(profiler._stats.fps.counter.value).toString();
            
            //drawcall
            this.lbDrawcall.string = profiler._stats.draws.counter.value.toString();
            this.lbInstancing.string = profiler._stats.instances.counter.value.toString();
            this.lbTriangle.string = profiler._stats.tricount.counter.value.toString();
            this.lbGFXMem.string = profiler._stats.textureMemory.counter.value.toFixed(1).toString();
            this.lbGameLogic.string = profiler._stats.logic.counter.value.toFixed(2).toString();
            this.lbArtTriangle.string = this.manager.artTriangle.toString();
            // this.lbVertex.string = this.manager.artVertex.toString();
            this.lbModelTriangle.string = this.manager.artTriangle.toString();
            this.lbPeople.string = this.manager.people.toString();
        }

        
        
        //
    }

    onDestroy() {
        // @ts-ignore
        if (this._profilerEnabled) {
            // @ts-ignore
            profiler.showStats();
        }
    }
}
