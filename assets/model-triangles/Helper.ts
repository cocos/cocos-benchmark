import { _decorator, Component, Node, CameraComponent, Prefab, loader, instantiate, LabelComponent, Vec3, SliderComponent, EventTouch, profiler, ToggleContainerComponent, ToggleComponent, Tween, CCString, EditBoxComponent, clamp, BatchingUtility, ModelComponent } from 'cc';
import { ModelInfo } from './ModelInfo';
const { ccclass, property } = _decorator;

const CAMERA_MOVE_PER_MODEL = 80;
const maxCount = 6;

@ccclass('Helper')
export class Helper extends Component {
    @property(CameraComponent)
    camera: CameraComponent = null;

    @property(LabelComponent)
    fps: LabelComponent = null;

    @property(LabelComponent)
    drawcall: LabelComponent = null;

    @property(LabelComponent)
    triangle: LabelComponent = null;

    @property(LabelComponent)
    vertices: LabelComponent = null;

    @property(LabelComponent)
    countLabel: LabelComponent = null;

    @property(ToggleContainerComponent)
    container: ToggleContainerComponent = null;

    @property(Node)
    btn: Node = null;

    @property(Node)
    modelRoot: Node = null;
    @property
    public resPath = 'model-triangles/model/';
    @property(EditBoxComponent)
    numberInput: EditBoxComponent = null;

    prefabList = new Map<string, Prefab>();

    originPos = new Vec3(-30, 0, -120);
    cameraPos = new Vec3();
    tweenCamera: Tween;
    currModelName = '';
    currLevel = 0;
    trianglesStr = 0;
    verticesStr = 0;
    private _count = 0;
    num = 0;
    enableInstancing = true;
    delaySchedule = -1;

    get count () {
        return this._count;
    }

    set count(value: number) {
        this._count = value;
        this.numberInput.string = ''+value;
        this.updateStr();
    }

    start () {
        loader.loadRes(this.resPath + '9.8', Prefab, (err: any, asset: Prefab) => {
            if(err){
                console.warn(err);
                return;
            }

            this.currModelName = asset.data.name;
            this.prefabList.set(asset.data.name, asset);
            this.onBtnAdd();
            this.btn.active = true;
        });

        this.cameraPos.set(this.camera.node.worldPosition);
        this.btn.active = false;
        if (!profiler._stats) {
            profiler.showStats();
        }

    }

    onBtnClear(){
        this.modelRoot.destroyAllChildren();
        this.modelRoot.removeAllChildren();
        this.camera.node.setPosition(this.cameraPos);
        this.trianglesStr = 0;
        this.verticesStr = 0;
        this.count = 0;
        this.currLevel = 0;
    }

    onBtnAdd(){
        this.updateModelNumber(this.count + maxCount);
    }

    onBtnReduce(){
        this.updateModelNumber(this.count - maxCount);
    }

    onBtnChanged(toggle: ToggleComponent){
        //x: -8~8
        //z: -16~2
        this.currModelName = toggle.node.name;
        const count = this.modelRoot.children.length;
        this.onBtnClear();
        if(!this.prefabList.get(this.currModelName)){
            this.btn.active = false;
            loader.loadRes(this.resPath+`${this.currModelName}`, Prefab, (err: any, asset: Prefab)=>{
                if(err){
                    console.warn(err);
                    return;
                }

                this.prefabList.set(asset.data.name, asset);
                this.updateModelNumber(count);
                this.btn.active = true;
            });
            return;
        }

        this.updateModelNumber(count);
    }

    onBtnUseGpu(toggle: ToggleComponent) {
        this.enableInstancing = toggle.isChecked;

        const models = this.modelRoot.children;
        const len = models.length;

        for (let i = 0; i < len; i++) {
            const model = models[i];
            const info = model.getComponent(ModelInfo);
            info.changeInstancingBatch(this.enableInstancing);
        }
    }

    updateStr(){
        this.vertices.string = `${Math.round(this.verticesStr * 1000)}`;
        this.countLabel.string = `${this.count}`;
    }

    update(){
        this.num++;
        if (this.num > 10 && profiler._stats) {
            this.num = 0;
            this.drawcall.string = profiler._stats.draws.counter.value.toString();
            this.fps.string = Math.round(profiler._stats.fps.counter.value).toString();
            this.triangle.string = profiler._stats.tricount.counter.value.toString();
        }
    }

    moveUpCamera() {
        this.currLevel = Math.floor(this.modelRoot.children.length / CAMERA_MOVE_PER_MODEL);

        let direction = this.camera.node.forward.clone().negative().multiplyScalar(8 * this.currLevel);
        direction.add(this.cameraPos);


        if (this.tweenCamera) {
            this.tweenCamera.stop();
            this.tweenCamera = null;
        }

        if(this.tweenCamera){
            this.tweenCamera.stop();
        }

        this.tweenCamera = new Tween(this.camera.node).to(0.2, { position: direction }).start();
    }

    updateModelNumber(num: number) {
        if (this.count === num) { return; }

        if (num < 0 || this.count === num) {
            return;
        }

        const addNum = num - this.count;

        if (addNum > 0) {
            const prefab = this.prefabList.get(this.currModelName);
            for (let i = 0; i < addNum; i++) {
                const model = instantiate(prefab) as Node;
                model.parent = this.modelRoot;
                const info = model.getComponent(ModelInfo);
                if(!this.enableInstancing){
                    info.changeInstancingBatch(false);
                }

                const vertex = info.vertices;
                this.verticesStr += vertex;
                //x: -8~8
                //z: -16~2
                const curL = Math.floor(this.modelRoot.children.length / CAMERA_MOVE_PER_MODEL);
                let x = (-8 - 3 * curL) + Math.random() * (12 + 6 * curL);
                let z = -16 + Math.random() * (18 + 5 * curL);
                let pos = new Vec3(x, 0, z);
                model.setPosition(pos);
            }

            if (Math.floor(num / CAMERA_MOVE_PER_MODEL) > this.currLevel) {
                //触发镜头拉高
                this.moveUpCamera();
            }
        } else {
            const models = this.modelRoot.children;
            let len = models.length - 1;
            let vertex = 0;
            const deleteNum = Math.abs(addNum);
            for (let i = 0; i < deleteNum; i++) {
                const model = models[len - i];
                vertex = vertex || model.getComponent(ModelInfo).vertices;
                this.verticesStr -= vertex;
                model.removeFromParent();
                model.destroy();
            }

            if (this.currLevel > Math.floor(num / CAMERA_MOVE_PER_MODEL)) {
                this.moveUpCamera();
            }
        }

        this.count = num;
    }

    onNumberInputEnd() {
        let num = Number.parseInt(this.numberInput.string);

        this.updateModelNumber(num);
    }
}
