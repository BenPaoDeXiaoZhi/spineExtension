import RenderWebGL, { AnyWebGLContext } from 'scratch-render';
import spineVersions from './spine/spineVersions';
import type spine42 from './spine/4.2/spine-webgl';
import type spine40 from './spine/4.0/spine-webgl';
import type spine38 from './spine/3.8/spine-webgl';

const Skin = (Scratch.runtime.renderer as unknown as { exports: any }).exports
    .Skin as typeof RenderWebGL.Skin;
console.log(Skin);
/**
 * @deprecated
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

export class SpineSkin<V extends keyof typeof spineVersions>
    extends Skin
    implements RenderWebGL.Skin
{
    renderer: any;
    gl: WebGLRenderingContext;
    _size: [number, number];
    canvas: HTMLCanvasElement;
    skeleton: any;
    animationState: any;
    timeKeeper: any;
    spine: (typeof spineVersions)[V];

    constructor(
        id: number,
        renderer: RenderWebGL,
        version: V,
        skeleton: {
            '4.2webgl': spine42.Skeleton;
            '4.0webgl': spine40.Skeleton;
            '3.8webgl': spine38.Skeleton;
        }[V],
        animationState: (typeof spineVersions)[V]['AnimationState'],
        timeKeeper: (typeof spineVersions)[V]['TimeKeeper']
    ) {
        super(id);
        this.spine = spineVersions[version];
        this.canvas = document.createElement('canvas');
        this.renderer = new this.spine.SceneRenderer(
            this.canvas,
            this.canvas.getContext('webgl')
        );
        this.gl = renderer.gl;
        this._texture = this.gl.createTexture();
        this.skeleton = skeleton;
        this.animationState = animationState;
        this.timeKeeper = timeKeeper;
        this.render();
        this.size = [200, 200];
        this._rotationCenter = [0, 0];
    }
    set size(size: [number, number]) {
        this.canvas.width = size[0];
        this.canvas.height = size[1];
        this._size = size;
    }
    get size() {
        return this._size;
    }
    getTexture(scale: [number, number]) {
        requestAnimationFrame(this.render.bind(this));
        return this._texture;
    }
    render() {
        console.log('render');
        // @ts-ignore
        this.skeleton.updateWorldTransform(this.spine.Physics.update);
        this.timeKeeper.update();
        this.animationState.update(this.timeKeeper.delta);
        this.animationState.apply(this.skeleton);
        this.renderer.begin();
        this.renderer.drawSkeleton(this.skeleton, false);
        this.renderer.end();

        this.gl.bindTexture(this.gl.TEXTURE_2D, this._texture);
        this.gl.texImage2D(
            this.gl.TEXTURE_2D,
            0,
            this.gl.RGBA,
            this.gl.RGBA,
            this.gl.UNSIGNED_BYTE,
            this.canvas
        );
        this.emit((Skin as any).Events.WasAltered);
    }
}
