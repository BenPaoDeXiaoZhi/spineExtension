import RenderWebGL, { AnyWebGLContext } from 'scratch-render';
import spineVersions from './spine/spineVersions';
import spine42 from './spine/4.2/spine-webgl';
import type spine40 from './spine/4.0/spine-webgl';
import type spine38 from './spine/3.8/spine-webgl';

const Skin = (Scratch.runtime.renderer as unknown as { exports: any }).exports
    .Skin as typeof RenderWebGL.Skin;
console.log(Skin);

type Skeleton<V extends keyof typeof spineVersions> = {
    '4.2webgl': spine42.Skeleton;
    '4.0webgl': spine40.Skeleton;
    '3.8webgl': spine38.Skeleton;
}[V];

type AnimationState<V extends keyof typeof spineVersions> = {
    '4.2webgl': spine42.AnimationState;
    '4.0webgl': spine40.AnimationState;
    '3.8webgl': spine38.AnimationState;
}[V];

type SceneRenderer<V extends keyof typeof spineVersions> = {
    '4.2webgl': spine42.SceneRenderer;
    '4.0webgl': spine40.SceneRenderer;
    '3.8webgl': spine38.SceneRenderer;
}[V];

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

export class SpineSkin<V extends keyof typeof spineVersions>
    extends Skin
    implements RenderWebGL.Skin
{
    renderer: any;
    gl: WebGLRenderingContext;
    _size: [x: number, y: number];
    skeleton: Skeleton<V>;
    animationState: AnimationState<V>;
    timeKeeper: any;
    version: keyof typeof spineVersions;

    constructor(
        id: number,
        renderer: RenderWebGL,
        version: V,
        skeleton: Skeleton<V>,
        animationState: AnimationState<V>,
        timeKeeper: any
    ) {
        super(id);
        this.version = version;
        const spine = spineVersions[version];
        this.renderer = new spine.SceneRenderer(renderer.canvas, renderer.gl);
        this.gl = renderer.gl;
        this._texture = this.gl.createTexture();
        this.skeleton = skeleton;
        this.animationState = animationState;
        this.timeKeeper = timeKeeper;
        skeleton.setToSetupPose();
        this.size = [640, 360];
        if ('getBoundsRect' in skeleton && 'Physics' in spine) {
            skeleton.updateWorldTransform(spine.Physics.update);
            const rect = skeleton.getBoundsRect();
            skeleton.scaleX = this.size[0] / rect.width || 1;
            skeleton.scaleY = this.size[1] / rect.height || 1;
            skeleton.x = 0;
            skeleton.y = 0;
        }
        this._rotationCenter = [320, 180];
    }
    set size(size: [number, number]) {
        this._size = size;
    }
    get size() {
        return this._size;
    }
    getTexture(scale: [number, number]) {
        // requestAnimationFrame(this.render.bind(this));
        return this._texture;
    }
    render() {
        console.log('render');
        const spine = spineVersions[this.version];
        if ('Physics' in spine) {
            this.skeleton.updateWorldTransform(spine.Physics.update);
        } else {
            (this.skeleton as spine38.Skeleton).updateWorldTransform();
        }
        this.timeKeeper.update();
        this.animationState.update(this.timeKeeper.delta);

        (this.animationState as unknown as typeof spine.AnimationState).apply(
            this.skeleton
        );
        this.gl.enable(this.gl.BLEND);
        this.renderer.begin();
        this.renderer.drawSkeleton(this.skeleton, false);
        this.renderer.end();

        // this.gl.bindTexture(this.gl.TEXTURE_2D, this._texture);
        // this.gl.texImage2D(
        //     this.gl.TEXTURE_2D,
        //     0,
        //     this.gl.RGBA,
        //     this.gl.RGBA,
        //     this.gl.UNSIGNED_BYTE,
        //     this.canvas
        // );
        requestAnimationFrame(() => this.emit((Skin as any).Events.WasAltered));
    }
}
