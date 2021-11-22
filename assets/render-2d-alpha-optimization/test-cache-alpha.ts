
import { _decorator, Component, Node, Sprite, find, instantiate, Prefab, math, Canvas, random, CCInteger, Vec3, color, ButtonComponent, Button, UITransformComponent, UITransform, size, Label } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = TestCacheAlpha
 * DateTime = Mon Nov 15 2021 15:32:15 GMT+0800 (中国标准时间)
 * Author = zmzczy
 * FileBasename = test-cache-alpha.ts
 * FileBasenameNoExtension = test-cache-alpha
 * URL = db://assets/test-update-alpha/test-cache-alpha.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */
 
@ccclass('TestCacheAlpha')
export class TestCacheAlpha extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    _root: Node = null!;
    _rootSprite: Sprite = null!;
    _modeButton1: Button = null!;
    _modeButton2: Button = null!;
    _countLabel: Label = null!;

    @property([Prefab])
    playerPrefabs: Prefab[] = [];

    //data
    _totalDepth: number = 7;//7
    _minWidth: number = 4;//4
    _maxWidth: number = 4;//4

    _spriteCounter: number = 0;

    readonly _ceilWidth = 50;
    readonly _ceilHeight =50;

    _generatedNodes: Node[] = [];
    _lastModifiedIndex = -1;

    _curMode = 0;

    start () {
        // [3]
        this._root = find('Canvas/root');
        this._rootSprite = this._root.getComponent<Sprite>(Sprite);
        this.generateSpriteNodes([this._root], this._totalDepth);

        this._modeButton1 = find('Canvas/ModeButton1').getComponent<Button>(Button);
        this._modeButton1.node.on('click', () => { this.switchMode(0) }, this);
        this._modeButton2 = find('Canvas/ModeButton2').getComponent<Button>(Button);
        this._modeButton2.node.on('click', () => { this.switchMode(1) }, this);

        this._countLabel = find('Canvas/CountLabel').getComponent<Label>(Label);
        this._countLabel.string =`当前sprite数量：${this._generatedNodes.length.toString()}`;
    }

    update (deltaTime: number) {
        // [4]
        if(this._curMode == 0) {
            this.testRandomNodeAlpha_mode1();
        } else if (this._curMode == 1) {
            this.testTotalNodeRandomAlpha_mode2();
        }
    }

    switchMode (mode: number) {
        this._curMode = mode;
    }

    testTotalNodeRandomAlpha_mode2 () {
        if(this._lastModifiedIndex>=0 && this._lastModifiedIndex<this._generatedNodes.length) {
            const lastNode = this._generatedNodes[this._lastModifiedIndex];
            const lastSprite = lastNode.getComponent<Sprite>(Sprite);
            lastSprite.color = color(255,255,255,255);
            this._lastModifiedIndex = -1;
        }
        const randomAlpha = math.randomRangeInt(0,256);
        this._rootSprite.color = color(255,255,255,randomAlpha);
    }

    testRandomNodeAlpha_mode1() {
        if(this._lastModifiedIndex>=0 && this._lastModifiedIndex<this._generatedNodes.length) {
            const lastNode = this._generatedNodes[this._lastModifiedIndex];
            const lastSprite = lastNode.getComponent<Sprite>(Sprite);
            lastSprite.color = color(255,255,255,255);
        }
        if(this._rootSprite.color.a !== 255) {
            this._rootSprite.color = color(255,255,255,255);
        }

        const randomIndex = math.randomRangeInt(0,this._generatedNodes.length);
        const node = this._generatedNodes[randomIndex];
        const sprite = node.getComponent<Sprite>(Sprite);
        sprite.color = color(255,255,255,128);

        this._lastModifiedIndex = randomIndex;
    }

    generateSpriteNodes(parents: Node[], curDepth: number) {
        if(curDepth <= 0) {
            return;
        }

        let thisFloorNodes = [];
        for(let k = 0; k < parents.length; k++){        
            const thisWidth = math.randomRangeInt(this._minWidth, this._maxWidth + 1);
            for (let i = 0; i<thisWidth;i++) {
                const randomVal = math.randomRangeInt(0,this.playerPrefabs.length);
                const tempNode = instantiate(this.playerPrefabs[randomVal]);
                tempNode.parent = parents[k];
                tempNode.getComponent<UITransform>(UITransform).contentSize = size(30,30);
                thisFloorNodes.push(tempNode);
                tempNode.name = `${tempNode.name}-index${this._spriteCounter}`;

                const pos = this.setSpriteNodePos(tempNode, curDepth, thisWidth, i);

                this._spriteCounter++;
                this._generatedNodes.push(tempNode);
                console.log(`sprite-${this._spriteCounter}: curDepth = ${this._totalDepth - curDepth}, widthIndex = ${i}, spriteIndex = ${randomVal}, pos = ${pos}`);   
            }
        }

        this.generateSpriteNodes(thisFloorNodes, --curDepth);
    }

    setSpriteNodePos(node: Node, curDepth: number, curFloorNodeCount: number, floorNodeIndex: number) {
        const posY = node.position.y - this._ceilHeight;
        const curCeilWidth = this._ceilWidth*curDepth;
        const totalWidth = (curFloorNodeCount-1) * curCeilWidth;
        const posX = -totalWidth/2 + floorNodeIndex * curCeilWidth;
        const pos = new Vec3(posX, posY, 0);
        node.position = pos;
        return pos;
    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/en/scripting/life-cycle-callbacks.html
 */
