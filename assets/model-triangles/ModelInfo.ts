import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ModelInfo')
export class ModelInfo extends Component {

    @property
    triangles = 0;

    @property
    vertices = 0;
}
