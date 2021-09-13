
import { _decorator, Component, Node, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Start')
export class Start extends Component {

    start () {
        cc.debug.setDisplayStats(true);
    }

    changeScene (event, sceneType) {
        switch(sceneType)
        {
            case 'spine':
                director.loadScene('spine');
                break;
            case 'dragonbones':
                director.loadScene('dragonbones');
                break;

        }
    }

}
