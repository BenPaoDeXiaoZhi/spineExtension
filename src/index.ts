import { registerExt } from './scratch/register';
import { getTranslate, Id } from './l18n/translate';
import RenderWebGL, { AnyWebGLContext } from 'scratch-render';
import SimpleExt from './scratch/simpleExt';
import type { MenuItems } from './scratch/simpleExt';
const { BlockType, ArgumentType } = Scratch;
import type VM from 'scratch-vm';
import { scratchStroageUI } from './util/storage';
type Utility = VM.BlockUtility;

const Skin = (Scratch.runtime.renderer as unknown as { exports: any }).exports
    .Skin as typeof RenderWebGL.Skin;
class SpineSkin extends Skin implements RenderWebGL.Skin {
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
        this.gl.texImage2D(
            this.gl.TEXTURE_2D,
            0,
            this.gl.RGBA,
            this.gl.RGBA,
            this.gl.UNSIGNED_BYTE,
            ctx.getImageData(0, 0, 300, 300)
        );
        this.size = [100, 100];
        this._texture = texture;
    }
    set size(size: [number, number]) {
        this._size = size;
    }
    get size() {
        return this._size;
    }
}

class ext extends SimpleExt {
    translate: (id: Id, args?: object) => string;
    runtime: VM.Runtime;
    renderer: RenderWebGL;
    constructor(runtime: VM.Runtime) {
        super('spineAnimation', 'foo');
        this.runtime = runtime;
        console.log(runtime);
        this.translate = getTranslate(runtime);
        this.renderer = runtime.renderer;
        this.prepareInfo();
    }
    prepareInfo() {
        this.info.name = this.translate('spineAnimation.extensionName');

        this.buildBlock(
            this.setSkinId,
            this.translate('spineAnimation.setSkinId.text'),
            BlockType.COMMAND,
            {
                arguments: {
                    TARGET_NAME: {
                        type: ArgumentType.STRING,
                        menu: 'sprite_menu',
                    },
                    SKIN_ID: {
                        type: ArgumentType.NUMBER,
                        default: '0',
                    },
                },
            }
        );
        this.buildBlock(
            this.loadSkeleton,
            this.translate('spineAnimation.loadSkeleton.text'),
            BlockType.COMMAND,
            {
                arguments: {
                    ID: {
                        type: ArgumentType.STRING,
                        menu: 'skeleton_menu',
                    },
                },
            }
        );
        this.buildButton(this.initUI, 'abcd');
        this.buildMenu('sprite_menu', true, this.spriteMenu);
        this.buildMenu('skeleton_menu', true, this.skeletonMenu);
        console.log(this.info);
    }

    spriteMenu(): MenuItems {
        const items = [
            {
                text: this.translate('spineAnimation.spriteMenu.currentTarget'),
                value: '__this__',
            },
        ];
        for (const target of this.runtime.targets) {
            if (target.isSprite()) {
                if (target.id !== this.runtime.getEditingTarget()?.id) {
                    items.push({
                        text: target.sprite.name,
                        value: target.sprite.name,
                    });
                }
            }
        }
        return items;
    }

    skeletonMenu(): MenuItems {
        return [{ text: 'test', value: 'spine/Hina_home.skel' }];
    }

    setSkinId(arg: { TARGET_NAME: string; SKIN_ID: string }, util: Utility) {
        const { TARGET_NAME, SKIN_ID } = arg;
        let target: VM.RenderedTarget;
        if (TARGET_NAME === '__this__') {
            target = util.target;
        } else {
            target = this.runtime.targets.find(
                (t) => t.isSprite() && t.getName() === TARGET_NAME
            );
            if (!target) {
                console.warn(`找不到名为${TARGET_NAME}的角色`);
            }
        }
        const drawableId = target.drawableID;
        const drawable = this.runtime.renderer._allDrawables[drawableId];
        const skin = this.runtime.renderer._allSkins[SKIN_ID];
        if (skin) {
            drawable.skin = skin;
        }
    }
    loadSkeleton(arg: { ID: string }) {
        const { ID } = arg;
        const skinId = this.renderer._nextSkinId;
        const newSkin = (this.renderer._allSkins[skinId] = new SpineSkin(
            skinId,
            this.renderer
        ));
        console.log(newSkin);
        return skinId;
    }
    initUI() {
        const s = new scratchStroageUI(this.runtime.storage, 'spineAnimation');
        s.createUI();
        console.log(s);
    }
}
registerExt(new ext(Scratch.runtime));
