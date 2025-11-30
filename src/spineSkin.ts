import RenderWebGL, { AnyWebGLContext } from 'scratch-render';

const Skin = (Scratch.runtime.renderer as unknown as { exports: any }).exports
    .Skin as typeof RenderWebGL.Skin;
export class SpineSkin extends Skin implements RenderWebGL.Skin {
    _renderer: RenderWebGL;
    gl: AnyWebGLContext;
    _size: [number, number];

    constructor(id: number, renderer: RenderWebGL) {
        super(id);
        this._renderer = renderer;
        this.gl = renderer.gl;
        const tmp = document.createElement('canvas');
        console.log(tmp);
        const ctx = tmp.getContext('2d');
        ctx.fillRect(0, 0, 100, 100);
        const texture = this.gl.createTexture();
        this.size = [100, 100];
        this._texture = texture;
        this._setTexture(ctx.getImageData(0, 0, 200, 200));
    }
    set size(size: [number, number]) {
        this._size = size;
    }
    get size() {
        return this._size;
    }
    getTexture(scale: [number, number]) {
        return this._texture || super.getTexture(scale);
    }
}
