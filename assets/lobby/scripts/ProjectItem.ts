import { _decorator, Component, Node, SpriteComponent, LabelComponent, loader, SpriteFrame, UITransformComponent } from 'cc';
const { ccclass, property } = _decorator;

export interface IProjectData {
    name: string;
    coverImgUrl: string;
    sceneUrl: string;
    tips: string;
}


@ccclass('ProjectItem')
export class ProjectItem extends Component {
    @property({type:SpriteComponent})
    public coverSprite: SpriteComponent = null;

    @property({type: LabelComponent})
    public projectNameLabel: LabelComponent = null;
    
    @property({type: LabelComponent})
    public projectTipsLabel: LabelComponent = null;

    start () {
        // Your initialization goes here.
    }

    public setProjectData(data: IProjectData) {
        if (data.name) {
            this.projectNameLabel.string = data.name;
        }

        if (data.coverImgUrl) {
            loader.loadRes(data.coverImgUrl, SpriteFrame, (err, spr: SpriteFrame) => {
                if (err) {
                    console.error(err);
                    return;
                }
                this.coverSprite.spriteFrame = spr;
                const trans = this.coverSprite.node.getComponent(UITransformComponent);
                // trans.width = spr.width;
                // trans.height = spr.height;
            });
        }

        if (data.tips) {
            this.projectTipsLabel.string = data.tips;
        }
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
