import { _decorator, Component, Prefab, ScrollView, Node, instantiate, Label } from "cc";
const { ccclass, property } = _decorator;

@ccclass
export class BackPackUI extends Component {
    @property({
        type: Prefab
    })
    slotPrefab: Prefab = null!;
    @property({
        type: ScrollView
    })
    scrollView: ScrollView = null!;
    @property
    totalCount = 0;

    @property({type: Label})
    totalCountLabel: Label|null = null;

    public heroSlots: Node[] = [];

    start() {
        this.heroSlots.length = 0;
        for (let i = 0; i < this.totalCount; ++i) {
            let heroSlot = this.addHeroSlot();
            this.heroSlots.push(heroSlot);
        }
        this.totalCountLabel!.string = "items: " + this.totalCount;
    }

    addHeroSlot() {
        let heroSlot = instantiate(this.slotPrefab);
        this.scrollView.content!.addChild(heroSlot);
        return heroSlot;
    }

    add() {
        for (let i = 0; i < 10; ++i) {
            let heroSlot = this.addHeroSlot();
            this.heroSlots.push(heroSlot);
        }
        this.totalCount += 10;
        this.totalCountLabel!.string = "items: " + this.totalCount;
    }

    delete() {
        if (this.heroSlots.length <= 0 ) return;
        for (let i = 0; i < 10; ++i) {
            const hero = this.heroSlots.pop()!;
            this.scrollView.content!.removeChild(hero);
            hero.destroy();
        }
        this.totalCount -= 10;
        this.totalCountLabel!.string = "items: " + this.totalCount
    }

    reset () {
        this.scrollView.content!.removeAllChildren();
        while (this.heroSlots.length > 0) {
            const hero = this.heroSlots.pop()!;
            hero.destroy();            
        }
        this.totalCount = 0;
        this.totalCountLabel!.string = "items: " + this.totalCount;
    }
}
