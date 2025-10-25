export function getCanvsSkin(runtime) {
    const Skin = runtime.renderer.exports.Skin;
    return class CanvasSkin extends Skin {
        constructor(id:number, renderer, textureWidth:number, textureHeight:number, resolution = 1) {
            super(id, renderer);
            this.gl = renderer._gl;
            this._renderer = renderer;
            this.skinType = 'canvasSkin'
            const texture = this.gl.createTexture();
            this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
            this.gl.texParameteri(
                this.gl.TEXTURE_2D,
                this.gl.TEXTURE_WRAP_S,
                this.gl.CLAMP_TO_EDGE
            );
            this.gl.texParameteri(
                this.gl.TEXTURE_2D,
                this.gl.TEXTURE_WRAP_T,
                this.gl.CLAMP_TO_EDGE
            );
            this.gl.texParameteri(
                this.gl.TEXTURE_2D,
                this.gl.TEXTURE_MIN_FILTER,
                this.gl.NEAREST
            );
            this.gl.texParameteri(
                this.gl.TEXTURE_2D,
                this.gl.TEXTURE_MAG_FILTER,
                this.gl.NEAREST
            );
            this._texture = texture;
            this._rotationCenter = [textureWidth / resolution / 2, textureHeight / resolution / 2];
            this._size = [textureWidth, textureHeight];
            this.resolution = resolution
            console.log(this)
            this.container = null
        }
        dispose() {
            if (this._texture) {
                this._renderer.gl.deleteTexture(this._texture);
                this._texture = null;
            }
            this.disposed = true
            super.dispose();
        }
        set size(value) {
            this._size = value;
            this._rotationCenter = [value[0] / 2, value[1] / 2];
        }
        get size() {
            return [this._size[0] / this.resolution, this._size[1] / this.resolution];
        }
        getTexture(scale:number) {
            return this._texture || super.getTexture();
        }
        set texture(texture:WebGLTexture) {
            this._texture = texture
            this.gl.bindTexture(this.gl.TEXTURE_2D, this._texture);
            this.emit(Skin.Events.WasAltered);
        }
        setContent(textureData:HTMLCanvasElement) {
            this.canvas = textureData;
            this.gl.bindTexture(this.gl.TEXTURE_2D, this._texture);
            this.gl.texImage2D(
                this.gl.TEXTURE_2D,
                0,
                this.gl.RGBA,
                this.gl.RGBA,
                this.gl.UNSIGNED_BYTE,
                textureData
            );

            this.emit(Skin.Events.WasAltered);
        }
    }
}