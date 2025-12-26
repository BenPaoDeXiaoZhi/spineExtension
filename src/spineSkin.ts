import RenderWebGL, { AnyWebGLContext } from 'scratch-render';
import type { SpineManager } from './spineManager';
import type { GandiRuntime } from '../types/gandi-type';

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
        }
    );
}

export class SpineSkin extends Skin {
    gl: AnyWebGLContext;
    manager: SpineManager;
    _size: [x: number, y: number];
    skeleton: any;
    animationState: any;
    tk: any;
    name: string;
    renderer: RenderWebGL;

    constructor(
        id: number,
        renderer: RenderWebGL,
        manager: SpineManager,
        skeleton: any,
        animationState: any,
        tk: any,
        name: string
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
        console.log(drawable);
        this.updatePosition(drawable._position as [x: number, y: number]);
        this.updateScale(drawable._scale as [x: number, y: number]);
    }
    updatePosition([x, y]: [x: number, y: number]) {
        console.log(x, y);
        this.skeleton.x = x;
        this.skeleton.y = y;
    }
    updateScale([x, y]: [x: number, y: number]) {
        this.skeleton.scaleX = x / 100;
        this.skeleton.scaleY = y / 100;
    }
    render(drawable: RenderWebGL.Drawable) {
        this.updateTransform(drawable);
        this.manager.drawSkeleton(this.skeleton, this.tk, this.animationState, [
            this.renderer._xRight - this.renderer._xLeft,
            this.renderer._yTop - this.renderer._yBottom,
        ]);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA); //reset blendfunc
        requestAnimationFrame(() => this.emit(Skin.Events.WasAltered)); //request next frame
    }
}
