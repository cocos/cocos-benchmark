import { _decorator, Component, Node, Prefab, instantiate, Vec2, EventTouch, EditBoxComponent, Vec3, randomRange, random, LabelComponent, Quat, ToggleComponent, PhysicsSystem, profiler, RigidBodyComponent } from "cc";
const { ccclass, property, menu } = _decorator;

export const KEY_INIT_STR = "KEY_INIT_STR";
const v3_0 = new Vec3(0, 3, 0);

declare var CC_PHYSICS_AMMO: any;
declare var CC_PHYSICS_CANNON: any;

enum ElementType {
    BOX = 0,
    SPHERE,
    BOX_RB,
    SPHERE_RB,
    MAX,
}

@ccclass("BENCHMARK.Benchmark")
@menu("demo/benchmark/Benchmark")
export class Benchmark extends Component {

    /** PREFAB */
    @property({type: Prefab})
    elementPrefabs: Prefab[] = [];

    /** CONTAINER */
    @property({ type: Node })
    elementContainers: Node[] = []

    /** RANGE */

    @property({ type: Vec2 })
    readonly rangeY = new Vec2(10, 100);

    @property({ type: Vec2 })
    readonly rangeXZ = new Vec2(-50, 50);

    @property({ type: Vec2 })
    readonly rangeSize = new Vec2(0.5, 5);

    /** LEFT */

    @property({ type: EditBoxComponent })
    readonly l_editBox: EditBoxComponent = null;

    @property({ type: LabelComponent })
    readonly l_current: LabelComponent = null;

    /** RIGHT */

    @property({ type: ToggleComponent })
    readonly r_rotateToggle: ToggleComponent = null;

    @property({ type: ToggleComponent })
    readonly r_useFixToggle: ToggleComponent = null;

    @property({ type: EditBoxComponent })
    readonly r_frameRateEditBox: EditBoxComponent = null;

    @property({ type: EditBoxComponent })
    readonly r_subStepEditBox: EditBoxComponent = null;

    @property({ type: EditBoxComponent })
    readonly r_IntervalEditBox: EditBoxComponent = null;

    @property({ type: RigidBodyComponent })
    readonly rotateDynamics: RigidBodyComponent = null;


    private intervalCurrent: number = 0;
    private intervalNumber: number = 0;

    private enableRotate = true;
    private addOnceNum = 10;
    private curElementNum: number[] = [0, 0, 0, 0];

    start () {

        profiler.showStats();
        for (let i = 0; i < ElementType.MAX; i++) {
            this.curElementNum[i] = 0;
        }

        const item = null;//localStorage.getItem(KEY_INIT_STR);
        let value = '';
        if (item != null && item != '') {
            this.l_editBox.string = value = item;
        } else {
            value = this.l_editBox.string;
        }

        this.updateAllElementsNumber(value);

        this.onRotateToggle(this.r_rotateToggle);
        this.onEditFrameRate(this.r_frameRateEditBox);
        this.onEditSubStep(this.r_subStepEditBox);
        this.onEditInterval(this.r_IntervalEditBox);
    }

    update () {
        if (this.intervalCurrent == 0) {
            PhysicsSystem.instance.enable = true;
            this.intervalCurrent = this.intervalNumber;
        } else {
            this.intervalCurrent--;
            PhysicsSystem.instance.enable = false;
        }

        if (this.enableRotate)
            this.rotateDynamics.setAngularVelocity(v3_0);
        else
            this.rotateDynamics.setAngularVelocity(Vec3.ZERO);
    }

    private updateAllElementsNumber(inputString: string) {
        if (inputString != '') {
            const arr = inputString.split('-');
            if (arr && arr.length > 0) {
                for (let i = 0; i < arr.length; i++) {
                    const count = parseInt(arr[i]);
                    if (isNaN(count)) continue;

                    switch (i) {
                        case 0: 
                            this.updateElementNumber(ElementType.BOX, count); 
                            break;
                        case 1: 
                            this.updateElementNumber(ElementType.SPHERE, count);
                            break;
                        case 2: 
                            this.updateElementNumber(ElementType.BOX_RB, count); 
                            break;
                        case 3: 
                            this.updateElementNumber(ElementType.SPHERE_RB, count); 
                            break;
                    }
                }
            }

            this.updateCurrentLab();
        }
    }

    private updateElementNumber(elemType: ElementType, num: number) {
        const container = this.elementContainers[elemType];
        const prefab = this.elementPrefabs[elemType];
        const curNum = container.children.length;

        if (curNum === num) {
            return;
        }

        if (num < 0) { num = 0;}

        // add
        if (num > curNum) {
            const addNum = num - curNum;

            for (let i = 0; i < addNum; i++) {
                const entity = instantiate(prefab) as Node;
                this.resetTransformSingle(entity);
                container.addChild(entity);
            }
        } else {    // delete
            const deleteNum = curNum - num;

            for (let i = 0; i < deleteNum; i++) {
                const node = container.children[curNum - 1 - i];
                node.destroy();
            }
        }

        this.curElementNum[elemType] = num;
    }

    private resetTransforms () {
        this.elementContainers.forEach((container: Node) => {
            for (let i = 0; i < container.children.length; i++) {
                const entity = container.children[i];
                this.resetTransformSingle(entity);
            }
        });
    }

    private resetTransformSingle (entity: Node) {
        let y = randomRange(this.rangeY.x, this.rangeY.y);
        let x = randomRange(this.rangeXZ.x, this.rangeXZ.y);
        let z = randomRange(this.rangeXZ.x, this.rangeXZ.y);
        entity.setWorldPosition(x, y, z);
        x = randomRange(0, 360);
        y = randomRange(0, 360);
        z = randomRange(0, 360);
        entity.setRotationFromEuler(x, y, z);
        if (Math.random() > 0.3) {
            x = randomRange(this.rangeSize.x, this.rangeSize.y);
            y = randomRange(this.rangeSize.x, this.rangeSize.y);
            z = randomRange(this.rangeSize.x, this.rangeSize.y);
            if (entity.name == "Sphere" || entity.name == "Sphere-RB") {
                entity.setWorldScale(x, x, x);
            } else {
                entity.setWorldScale(x, y, z);
            }
        }
    }

    private updateCurrentLab () {
        const a = this.curElementNum[ElementType.BOX];
        const b = this.curElementNum[ElementType.SPHERE];
        const c = this.curElementNum[ElementType.BOX_RB];
        const d = this.curElementNum[ElementType.SPHERE_RB];
        const numString = a + "-" + b + "-" + c + "-" + d
        this.l_current.string = "目前数量：" + numString;
        this.l_editBox.string = numString;
    }

    addElement(elemType: ElementType) {
        this.updateElementNumber(elemType, this.elementContainers[elemType].children.length + this.addOnceNum);
        this.updateCurrentLab();
    }

    onAddBox (touch: EventTouch, custom?: string) {
        this.addElement(ElementType.BOX);
    }

    onAddSphere (touch: EventTouch, custom?: string) {
        this.addElement(ElementType.SPHERE);
    }

    onAddBoxRB (touch: EventTouch, custom?: string) {
        this.addElement(ElementType.BOX_RB);
    }

    onAddSphereRB (touch: EventTouch, custom?: string) {
        this.addElement(ElementType.SPHERE_RB);
    }

    onEditFinish (editBox: EditBoxComponent) {
        const str = editBox.string;
        if (str != '') {
            //localStorage.setItem(KEY_INIT_STR, str);
            this.updateAllElementsNumber(str);
        }
    }

    onReset (touch: EventTouch, custom?: string) {
        this.resetTransforms();
    }

    onRotateToggle (toggle: ToggleComponent) {
        this.enableRotate = toggle.isChecked;
    }

    onEditFrameRate (editBox: EditBoxComponent) {
        const v = parseInt(editBox.string);
        if (isNaN(v)) return;

        if (v > 0) {
            PhysicsSystem.instance.fixedTimeStep = 1 / v;
        }
    }

    onEditSubStep (editBox: EditBoxComponent) {
        const v = parseInt(editBox.string);
        if (isNaN(v)) return;

        if (v >= 0) {
            PhysicsSystem.instance.maxSubSteps = v;
        }
    }

    onEditInterval (editBox: EditBoxComponent) {
        const v = parseInt(editBox.string);
        if (isNaN(v)) return;

        if (v >= 0) {
            this.intervalNumber = v;
        }
    }
}
