import { _decorator, Component, Node, CameraComponent, Prefab, loader, instantiate, LabelComponent, Vec3, SliderComponent, EventTouch, profiler, ToggleContainerComponent, ToggleComponent, Tween, CCString, EditBoxComponent, clamp } from 'cc';
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
    @property({type:CCString})
    public resPath: string = 'model-triangles/model/';
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

    get count () {
        return this._count;
    }

    set count(value: number) {
        this._count = value;
        this.numberInput.string = ''+value;
        this.updateStr();
    }

    start () {
        loader.loadRes(this.resPath+'9.8', Prefab, (err: any, asset: Prefab)=>{
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

        //@ts-ignore
        if (profiler._rootNode) {
            //@ts-ignore
            profiler._rootNode.active = false;
        }

    }

    onBtnClear(){
        const childArr = this.modelRoot.children;
        const len = childArr.length;
        for (let i = len - 1; i >= 0; i--) {
            const child = childArr[i];
            child.destroy();
        }

        this.camera.node.setPosition(this.cameraPos);
        this.trianglesStr = 0;
        this.verticesStr = 0;
        this.count = 0;
        this.currLevel = 0;
        this.updateStr();
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
            loader.loadRes(this.resPath+`${this.currModelName}`, Prefab, (err: any, asset: Prefab)=>{
                if(err){
                    console.warn(err);
                    return;
                }

                this.prefabList.set(asset.data.name, asset);
                this.replaceModel(count);
            });
            return;
        }

        this.replaceModel(count);
    }

    replaceModel(childArr: number){
        childArr = Math.round(childArr);
        const prefab = this.prefabList.get(this.currModelName);
        let vertex = 0;
        for (let i = 0; i < childArr; i++) {
            const element = instantiate(prefab) as Node;
            element.parent = this.modelRoot;
            vertex = vertex || element.getComponent(ModelInfo).vertices;
            this.verticesStr += vertex;
            let x = (-8 - 3 * this.currLevel) + Math.random() * (12 + 6 * this.currLevel);
            let z = -16 + Math.random() * (18 + 5 * this.currLevel);
            let pos = new Vec3(x, 0, z);
            element.setPosition(pos);
        }

        this.count = childArr;
        this.updateStr();
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
        this.currLevel++;

        let direction = this.camera.node.forward.clone().negative().multiplyScalar(8);
        direction.add(this.camera.node.position);


        if (this.tweenCamera) {
            this.tweenCamera.stop();
            this.tweenCamera = null;
        }

        this.tweenCamera = new Tween(this.camera.node).to(0.2, { position: direction }).start();
    }

    updateModelNumber(num: number) {
        if (this.count === num) { return; }

        if (num < 0) {
            num = 0;
        }

        if (num > this.count) {
            const prefab = this.prefabList.get(this.currModelName);
            let vertex = 0;
            const addNum = num - this.count;
            for (let i = 0; i < addNum; i++) {
                const model = instantiate(prefab) as Node;
                model.parent = this.modelRoot;
                vertex = vertex || model.getComponent(ModelInfo).vertices;
                this.verticesStr += vertex;
                //x: -8~8
                //z: -16~2
                let x = (-8 - 3 * this.currLevel) + Math.random() * (12 + 6 * this.currLevel);
                let z = -16 + Math.random() * (18 + 5 * this.currLevel);
                let pos = new Vec3(x, 0, z);
                model.setPosition(pos);
    
                if (Math.floor(this.count / CAMERA_MOVE_PER_MODEL) > this.currLevel) {
                    //触发镜头拉高
                    this.moveUpCamera();
                }
            }
    
        } else {
            const models = this.modelRoot.children;
            let len = models.length - 1;
            let vertex = 0;
            const deleteNum = this.count - num;
            for (let i = 0; i < deleteNum; i++) {
                const model = models[len - i];
                vertex = vertex || model.getComponent(ModelInfo).vertices;
                this.verticesStr += vertex;
                model.destroy();
    
                if (this.currLevel > Math.floor(this.count / CAMERA_MOVE_PER_MODEL)) {
                    this.currLevel = Math.floor(this.count / CAMERA_MOVE_PER_MODEL);
    
                    let pos = this.camera.node.forward.clone().negative().multiplyScalar(8 * this.currLevel);
    
                    pos.add(this.cameraPos);
    
                    if (this.tweenCamera) {
                        this.tweenCamera.stop();
                        this.tweenCamera = null;
                    }
    
                    this.tweenCamera = new Tween(this.camera.node).to(0.2, { position: pos }).start();
                }
            }
        }

        this.count = num;
    }

    onNumberInputEnd() {
        let num = Number.parseInt(this.numberInput.string);

        this.updateModelNumber(num);
    }
}
