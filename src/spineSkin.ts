import RenderWebGL, { AnyWebGLContext } from 'scratch-render';
import type { SpineManager } from './spineManager';

const Skin = (Scratch.runtime.renderer as unknown as { exports: any }).exports
    .Skin as typeof RenderWebGL.Skin;
console.log(Skin);

/**
 * 重写hasInstance,使scratch renderer在渲染阶段使用spineSkin.render()
 */
export function patchSpineSkin(runtime: VM.Runtime) {
    const [id, skin] = (runtime.renderer as any).createSpineSkin() as [
        number,
        RenderWebGL.Skin
    ];
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
    console.log(Object.getPrototypeOf(skin).constructor);
}

export class SpineSkin extends Skin implements RenderWebGL.Skin {
    gl: AnyWebGLContext;
    manager: SpineManager;
    _size: [x: number, y: number];
    skeleton: any;
    animationState: any;
    tk: any;
    name: string;

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
    render() {
        this.manager.drawSkeleton(this.skeleton, this.tk, this.animationState);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA); //reset blendfunc
        requestAnimationFrame(() => this.emit((Skin as any).Events.WasAltered)); //request next frame
    }
}
