import { _decorator, Component, Node, Animation, Enum } from "cc";
const { ccclass, property } = _decorator;
import { BackPackUIComp } from "./BackPackUIComp";
import { ShopUI } from "./ShopUI";
import { PanelType } from "./PanelType";

@ccclass
export class HomeUI extends Component {
    @property(Animation)
    menuAnim: Animation = null!;
    @property([Node])
    homeBtnGroups: Node[] = [];
    @property(BackPackUIComp)
    backPackUI: BackPackUIComp = null!;
    @property(ShopUI)
    shopUI: ShopUI = null!;

    public curPanel = PanelType.Home;

    // use this for initialization
    onLoad() {
        this.curPanel = PanelType.Home;
        this.menuAnim.play('menu_reset');
    }

    start() {
        this.backPackUI.init(this);
        this.shopUI.init(this, PanelType.Shop);
        this.scheduleOnce(() => {
            this.menuAnim.play('menu_intro');
            this.showAllUI();
        }, 0.5);
    }

    showAllUI() {
        this.gotoShop();
        this.homeBtnGroups[0].getChildByName("sub_btns").getComponent("SubBtnsUI").showSubBtns();
        this.node.parent.getChildByName("chargePanel").getComponent("ChargeUI").show();
        this.node.parent.getChildByName("backPack").getComponent("BackPackUIComp").show();
    }

    gotoShop() {
        if (this.curPanel !== PanelType.Shop) {
            this.shopUI.show();
        }
    }

    gotoHome() {
        if (this.curPanel === PanelType.Shop) {
            this.shopUI.hide();
            this.curPanel = PanelType.Home;
        }
    }
}
