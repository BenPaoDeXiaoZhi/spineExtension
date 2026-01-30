import RenderWebGL, { AnyWebGLContext } from 'scratch-render';
import type { SpineManager } from './spineManager';
import type { GandiRuntime } from '../types/gandi-type';
import spineVersions, { AnimationState, Skeleton } from './spine/spineVersions';

const Skin = Scratch.runtime.renderer.exports.Skin;

/**
 * 重写hasInstance,使scratch renderer在渲染阶段使用spineSkin.render()
 */
export function patchSpineSkin(runtime: GandiRuntime) {
    const [id, skin] = runtime.renderer.createSpineSkin();
    runtime.renderer._allSkins[id] = undefined;
    runtime.renderer._nextSkinId--;
    Object.defineProperty(
        Object.getPrototypeOf(skin).constructor,
        Symbol.hasInstance,
        {
            value: function (instance: any) {
                if (instance instanceof SpineSkin || instance?.spine) {
                    return true;
                }
                return false;
            },
            writable: true,
        },
    );
}

export class SpineSkin extends Skin {
    gl: AnyWebGLContext;
    manager: SpineManager;
    _size: [x: number, y: number];
    skeletonRelativePos: [x: number, y: number];
    skeleton: Skeleton<keyof typeof spineVersions>;
    animationState: AnimationState;
    tk: any;
    name: string;
    renderer: RenderWebGL;

    constructor(
        id: number,
        renderer: RenderWebGL,
        manager: SpineManager,
        skeleton: Skeleton,
        animationState: AnimationState,
        tk: any,
        name: string,
    ) {
        super(id);
        this.gl = renderer.gl;
        this.renderer = renderer;

        this.manager = manager;
        this.skeleton = skeleton;
        this.tk = tk;
        this.animationState = animationState;
        this.name = name;

        this._texture = this.gl.createTexture();
        this.size = [640, 360];
        this.skeletonRelativePos = [0, 0];
        this._rotationCenter = [320, 180];
    }
    set size(size: [number, number]) {
        this._size = size;
    }
    get size() {
        return this._size;
    }
    getTexture(scale: [number, number]) {
        return this._texture;
    }
    updateTransform(drawable: RenderWebGL.Drawable) {
        this.updatePosition(drawable._position as [x: number, y: number]);
        this.updateScale(drawable._scale as [x: number, y: number]);
        this.updateDirection(drawable._direction);
    }
    updatePosition([x, y]: [x: number, y: number]) {
        this.skeleton.x = x + this.skeletonRelativePos[0];
        this.skeleton.y = y + this.skeletonRelativePos[1];
    }
    updateScale([x, y]: [x: number, y: number]) {
        this.skeleton.scaleX = x / 100;
        this.skeleton.scaleY = y / 100;
    }
    updateDirection(direction: number) {
        this.skeleton.getRootBone().rotation = direction - 90;
    }
    render(drawable: RenderWebGL.Drawable) {
        this.updateTransform(drawable);
        this.manager.drawSkeleton(this.skeleton, this.tk, this.animationState, [
            this.renderer._xRight - this.renderer._xLeft,
            this.renderer._yTop - this.renderer._yBottom,
        ]);
        requestAnimationFrame(() => this.emit(Skin.Events.WasAltered)); //request next frame
    }

    dispose(): void {
        super.dispose();
        this.render = () => {};
        delete this.skeleton;
        delete this.tk;
        delete this.animationState;
    }
}
