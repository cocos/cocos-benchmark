
import { _decorator, Component, Node, Event, Toggle, EditBox, view, Label, CCInteger, profiler } from 'cc';
import { EnvironmentManager } from './environmentManager';
import { EquipmentManager } from './equipmentManager';
import { MonsterManager } from './monsterManager';
import { PlayerManager } from './playerManager';
const { ccclass, property } = _decorator;

enum ObjectType {
    Player,
    Monster,
    Environment,
    Equipment,
}

@ccclass('GameManager')
export class GameManager extends Component {

    static maxX = 0;
    static minX = 0;
    static maxY = 0;
    static minY = 0;

    @property (PlayerManager)
    playerManager: PlayerManager | null = null;
    @property (EnvironmentManager)
    environmentManager: EnvironmentManager | null = null;
    @property (MonsterManager)
    monsterManager: MonsterManager | null = null;
    @property (EquipmentManager)
    equipmentManager: EquipmentManager | null = null;

    @property (Label)
    playerCount: Label | null = null;
    @property (Label)
    monsterCount: Label | null = null;
    @property (Label)
    BGCount: Label | null = null;
    @property (Label)
    backPackCount: Label | null = null;

    @property(CCInteger)
    addNum = 10;

    @property(EditBox)
    numberInput: EditBox | null = null;

    private _controlType: ObjectType = ObjectType.Player;
    private _currentManager: PlayerManager | EnvironmentManager | MonsterManager | EquipmentManager;
    private _currentLabel: Label;
    get controlType () {
        return this._controlType;
    }
    set controlType (val: ObjectType) {
        if (this._controlType === val) {
            return;
        }
        this._controlType = val;
        this.updateControlType();
    }

    onLoad () {
        const visibleSize = view.getVisibleSize();
        GameManager.maxX = visibleSize.width / 2;
        GameManager.minX = -GameManager.maxX;
        GameManager.maxY = visibleSize.height / 2;
        GameManager.minY = -GameManager.maxY;
        if (!profiler._stats) {
            profiler.showStats();
        }
    }

    start () {
        // [3]
        this.updateControlType();
    }

    // update (deltaTime: number) {
    //     // [4]
    // }

    changeControlType (comp: Toggle, type: string) {
        if(!comp.isChecked) {
            return;
        }
        const cType = Number.parseInt(type) as ObjectType;
        this.controlType = cType;
    }

    updateControlType () {
        switch (this._controlType) {
            case ObjectType.Equipment:
                this._currentManager = this.equipmentManager!;
                this._currentManager.showBackPack();
                this._currentLabel = this.backPackCount!;
                break;
            case ObjectType.Environment:
                this._currentManager = this.environmentManager!;
                this._currentLabel = this.BGCount!;
                break;
            case ObjectType.Monster:
                this._currentManager = this.monsterManager!;
                this._currentLabel = this.monsterCount!;
                break;
            case ObjectType.Player:
            default:
                this._currentManager = this.playerManager!;
                this._currentLabel = this.playerCount!;
                break;
        }
    }

    // interface
    addFunction() {
        const num = this._currentManager.spriteNum + this.addNum;
        this._currentManager.updateSpriteNumber(num);
        this._currentLabel.string = this._currentManager.spriteNum.toString();
    }
    reduceFunction() {
        const num = this._currentManager.spriteNum - this.addNum;
        this._currentManager.updateSpriteNumber(num);
        this._currentLabel.string = this._currentManager.spriteNum.toString();
    }
    resetFunction() {
        this._currentManager.updateSpriteNumber(0);
        this._currentLabel.string = this._currentManager.spriteNum.toString();
    }
    onNumberInputEnd() {
        const num = Number.parseInt(this.numberInput!.string);
        this._currentManager.updateSpriteNumber(num);
        this._currentLabel.string = this._currentManager.spriteNum.toString();
    }
}

