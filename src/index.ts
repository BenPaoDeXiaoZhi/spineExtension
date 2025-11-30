import { registerExt } from './scratch/register';
import { getTranslate, Id } from './l18n/translate';
import { SimpleExt } from './scratch/simpleExt';
import type { extInfo, MenuItems } from './scratch/simpleExt';
const { BlockType, ArgumentType, runtime } = Scratch;
import type VM from 'scratch-vm';
import { scratchStroageUI } from './util/storage';
import { SpineSkin } from './spineSkin';
type Utility = VM.BlockUtility;

class ext extends SimpleExt {
    translate: (id: Id, args?: object) => string;
    runtime: VM.Runtime;
    renderer: RenderWebGL;
    constructor(runtime: VM.Runtime) {
        console.log(runtime);
        super('spineAnimation', 'foo');
        this.runtime = runtime;
        console.log(this);
        this.translate = getTranslate(runtime);
        this.renderer = runtime.renderer;
        this.info.name = this.translate('spineAnimation.extensionName');
        this.info.blocks = [
            {
                opcode: this.setSkinId.name,
                text: this.translate('spineAnimation.setSkinId.text'),
                blockType: BlockType.COMMAND,
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
            },
            {
                opcode: this.loadSkeleton.name,
                text: this.translate('spineAnimation.loadSkeleton.text'),
                blockType: BlockType.COMMAND,
                arguments: {
                    ID: {
                        type: ArgumentType.STRING,
                        menu: 'skeleton_menu',
                    },
                },
            },
            {
                func: this.initUI.name,
                blockType: BlockType.BUTTON,
                text: 'abcd',
            },
        ];
        this.info.menus = {
            sprite_menu: {
                items: this.spriteMenu.name,
                acceptReporters: true,
            },
            skeleton_menu: {
                items: this.skeletonMenu.name,
                acceptReporters: true,
            },
        };
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
        this.info.blocks[0].opcode;
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
registerExt(new ext(runtime));
