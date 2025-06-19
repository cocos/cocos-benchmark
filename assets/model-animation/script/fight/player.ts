import { _decorator, Component, Node, Vec3, Tween, ModelComponent, SkinningModelComponent, SkeletalAnimationComponent } from 'cc';
import { playerManager } from './playerManager';
import { instacingMaterial } from './instacingMaterial';
const { ccclass, property } = _decorator;

@ccclass('player')
export class player extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    @property
    triangle: number = 0;

    @property
    vertex: number = 0;

    manager: playerManager;
    tweenMove: Tween;
    lerpMoveNode: LerpMoveNode = null!;

    transformTimeMsInOneFrame: number = 0;

    protected onLoad(): void {
        this.lerpMoveNode = new LerpMoveNode(this.node);
    }

    start() {
        // Your initialization goes here.
    }

    show(manager: playerManager) {
        //x: -5~5
        //z: -20~6
        this.manager = manager;

        let x = (-8 - 3 * this.manager.currentLevel) + Math.random() * (16 + 6 * this.manager.currentLevel);
        let z = -20 + Math.random() * (26 + 5 * this.manager.currentLevel);

        let pos = new Vec3(x, 0, z);

        this.node.position = pos;

        //TODO 开始随机移动
        this.move();

        if (this.manager.enableInstancing) {
            this.changeInstancingBatch(true); //如果当前开启合批，则跟随开启
        }

        this.changeShadow(this.manager.enableShadow);
    }

    onDestroy() {
        if (this.tweenMove) {
            this.tweenMove.stop();
            this.tweenMove = null;
        }
    }

    move() {
        let nextPoint = new Vec3((-8 - 3 * this.manager.currentLevel) + Math.random() * (16 + 6 * this.manager.currentLevel), 0, -20 + Math.random() * (26 + 5 * this.manager.currentLevel));

        let offset = nextPoint.clone().subtract(this.node.position);

        this.node.forward = offset.clone().normalize().negative();

        let costTime = offset.length() / 2;

        if (this.tweenMove) {
            this.tweenMove.stop();
            this.tweenMove = null;
        }

        this.lerpMoveNode.start(costTime, nextPoint, this.move.bind(this));
    }

    changeInstancingBatch(isEnable) {
        let arrInstancing = this.node.getComponentsInChildren(instacingMaterial);
        arrInstancing.forEach((instancing) => {
            instancing.enableInstancing = isEnable;
        });

        if (isEnable) {
            this.node.getComponent(SkeletalAnimationComponent).play();
        }
    }

    changeShadow(isEnable: boolean) {
        let arrModel = this.node.getComponentsInChildren(SkinningModelComponent);
        arrModel.forEach((model) => {
            model.shadowCastingMode = isEnable ? SkinningModelComponent.ShadowCastingMode.ON : SkinningModelComponent.ShadowCastingMode.OFF;
        });


    }

    update (dt: number) {
        const now = performance.now();
        this.lerpMoveNode.update(dt);
        this.transformTimeMsInOneFrame = performance.now() - now;
    }
}

class LerpMoveNode {
    private from: Vec3 = new Vec3();
    private target: Vec3 = new Vec3();
    private duration: number = 0;
    private isRunning: boolean = false;
    private time: number = 0;
    private arrivedCallback: () => void = null!;

    constructor(private node: Node) { }

    start(duration: number, target: Vec3, arrivedCallback: () => void) {
        this.from = this.node.position.clone();
        this.target = target;
        this.duration = duration;
        this.isRunning = true;
        this.time = 0;
        this.arrivedCallback = arrivedCallback;
    }

    update(dt: number) {
        if (!this.isRunning) return;

        this.time += dt;
        if (this.time >= this.duration) {
            this.node.setPosition(this.target);
            this.isRunning = false;
            this.arrivedCallback?.();
            return;
        }

        let t = this.time / this.duration;
        let newPos = Vec3.lerp(new Vec3(), this.from, this.target, t);
        this.node.setPosition(newPos);
    }
}