import { _decorator, Component, Node, Prefab, instantiate, loader, JsonAsset, ButtonComponent, EventHandler, EventTouch, director, find } from 'cc';
import { IProjectData, ProjectItem } from './ProjectItem';
const { ccclass, property } = _decorator;

@ccclass('LobbyManager')
export class LobbyManager extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    @property({type: Prefab})
    public projectItemPrfb: Prefab = null;

    @property({type: Node})
    public scrollViewContent: Node = null;

    private _projectData: IProjectData[] = [];

    start () {
        // Your initialization goes here.
        const persistCanvas = find('PersistCanvas')
        persistCanvas.active = false;

        loader.loadRes('lobby/projects.json', JsonAsset, (err, jsonObj) => {
            if (Array.isArray(jsonObj.json)) {
                this._projectData = jsonObj.json;
                this.generateProjectList(jsonObj.json);
            }
        });
    }

    generateProjectList(projectData: IProjectData[]) {
        projectData.forEach((data: IProjectData, index: Number) => {
            const projectItem: Node = instantiate(this.projectItemPrfb) as Node;
            projectItem.parent = this.scrollViewContent;
            const item: ProjectItem = projectItem.getComponent(ProjectItem);
            item.setProjectData(data);
            const buttons: ButtonComponent[] = projectItem.getComponentsInChildren(ButtonComponent);
            
            const clickEventHandler = new EventHandler();
            clickEventHandler.target = this.node;
            clickEventHandler.component = 'LobbyManager';
            clickEventHandler.customEventData = ''+index;
            clickEventHandler.handler = 'onItemClicked';
            buttons.forEach((button)=> {
                button.clickEvents.push(clickEventHandler);
            });
        });
    }

    onItemClicked(event: EventTouch, customEventData) {
        //console.log(customEventData);
        const data = this._projectData[customEventData];
        if (director.loadScene(data.sceneUrl)) {
            const persistCanvas = find('PersistCanvas')
            persistCanvas.active = true;
        }
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
