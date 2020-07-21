import { _decorator, Component, Node, Material } from 'cc';
import { instacingMaterial } from '../model-animation/script/fight/instacingMaterial';
const { ccclass, property } = _decorator;

@ccclass('ModelInfo')
export class ModelInfo extends Component {

    @property
    triangles = 0;

    @property
    vertices = 0;

    public changeInstancingBatch(isEnable = true){
        let arrInstancing = this.node.getComponentsInChildren(instacingMaterial);
        arrInstancing.forEach((instancing) => {
            instancing.enableInstancing = isEnable;
        });
    }
}
