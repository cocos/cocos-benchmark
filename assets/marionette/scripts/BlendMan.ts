import { _decorator, Component, Node, Vec3, animation } from 'cc';
const { ccclass, property } = _decorator;

const DIR_CACHE = new Vec3();

@ccclass('BlendMan')
export class BlendMan extends Component {
    @property
    radius = 10.0;

    @property
    speed = 1.0;

    start() {
        this._animationController = this.node.getComponent(animation.AnimationController)!;
        Vec3.copy(this._center, this.node.worldPosition);
    }

    update(deltaTime: number) {
        const current = this.node.worldPosition;
        const dest = this._dest;
        const dir = DIR_CACHE;
        let currentDistance = 0.0;
        while (true) {
            Vec3.subtract(dir, dest, current);
            dir.y = 0.0;
            const d = dir.length();
            if (d === 0) {
                this._rollDest();
            } else {
                currentDistance = d;
                break;
            }
        }
        dir.normalize();

        const velocityX = Math.sign(dir.x);
        const velocityY = Math.sign(dir.z);
        const newD = Math.max(currentDistance - this.speed * deltaTime, 0);
        Vec3.multiplyScalar(dir, dir, newD);
        Vec3.subtract(dir, dest, dir);
        this.node.worldPosition = dir;
        this._animationController.setValue('VelocityX', velocityX);
        this._animationController.setValue('VelocityY', velocityY);
    }

    private declare _animationController: animation.AnimationController;
    private _center = new Vec3();
    private _dest = new Vec3();

    private _rollDest() {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * this.radius;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        Vec3.copy(this._dest, this._center);
        this._dest.x += x;
        this._dest.z += y;
    }
}


