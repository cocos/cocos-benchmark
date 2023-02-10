import { _decorator, Component, Node, Asset, native, Label, Color } from 'cc';
import { NATIVE } from 'cc/env';
const { ccclass, property } = _decorator;

let scriptLoaded = false;

declare function startBenchMark(...args: any[]): void;

const BENCH_MARK_TESTS = 15;

const benchResult: { scores: string[], finalScore: number } = {
    scores: [],
    finalScore: 0
};

function asyncify<T>(cb: { (): T }): Promise<T> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(cb());
        }, 0)
    })
}

@ccclass('OctaneBenchmark')
export class OctaneBenchmark extends Component {

    @property({ type: Asset })
    public scriptAssets: Asset = null!;

    @_decorator.type(Label)
    public scoreLabel: Label = null!;

    @_decorator.type(Label)
    public records: Label = null!;

    async loadAndRunScript() {

        if (!scriptLoaded) {
            const filePath = this.scriptAssets.nativeUrl;
            const dstDir = native.fileUtils.getWritablePath();
            this.scoreLabel.string = "Reading octane.js ..."
            const content = await asyncify(() => native.fileUtils.getStringFromFile(filePath));
            const destFile = dstDir + "/octane.js";
            this.scoreLabel.string = "Copying octane.js ..."
            await asyncify(() => native.fileUtils.writeStringToFile(content, destFile));
            this.scoreLabel.string = "Running octane.js ..."
            // @ts-expect-error
            await asyncify(() => require(destFile));
            scriptLoaded = true;
        }
        if (benchResult.scores.length == 0) {
            await asyncify(() => {
                startBenchMark((name: string, score: number) => {
                    if (this.callbacks) {
                        this.callbacks.PrintResult.call(this, name, score);
                    }
                }, (name: string, error: string) => {
                    if (this.callbacks) {
                        this.callbacks.PrintError.call(this, name, error);
                    }
                }, (score: number) => {
                    this.callbacks.PrintScore.call(this, score);
                })
            }
            );
        } else {
            this.scoreLabel.string = `Score : ${benchResult.finalScore} ` + (this as any).progress();
            this.records.string = benchResult.scores.join("\n");
        }
    }

    start() {

        if (NATIVE) {
            this.loadAndRunScript();
        } else {
            this.scoreLabel.string = "Not supported.\nPlease run in native platforms.";
            this.scoreLabel.color = Color.RED;
            this.records.string = "";
        }

    }

    callbacks = {
        PrintResult(name: string, result: number) {
            benchResult.scores.push(`${name} : ${result}`);
            (this as any).records.string = benchResult.scores.join("\n");
            (this as any).scoreLabel.string = "Running: " + (this as any).progress();
        },
        PrintError(name: string, error: string) {
            benchResult.scores.push(`${name} : error: ${error}`);
            (this as any).records.string = benchResult.scores.join("\n");
            (this as any).scoreLabel.string = "Running: " + (this as any).progress();
        },
        PrintScore(score: number) {
            benchResult.finalScore = score;
            (this as any).scoreLabel.string = `Score : ${score} ` + (this as any).progress();
        }
    }

    private progress() {
        return `[${benchResult.scores.length} / ${BENCH_MARK_TESTS}]`;
    }

    onDestroy() {
        this.callbacks = null!;
    }

    update(deltaTime: number) {

    }
}


