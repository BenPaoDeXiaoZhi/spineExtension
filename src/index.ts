import { registerExt } from './scratch/register';
import { getTranslate, Id } from './l18n/translate';
import SimpleExt from './scratch/simpleExt';
import type { MenuItems } from './scratch/simpleExt';
const { BlockType, ArgumentType } = Scratch;
import type VM from 'scratch-vm';
import { scratchStroageUI } from './util/storage';
type Utility = VM.BlockUtility;

class ext extends SimpleExt {
    translate: (id: Id, args?: object) => string;
    runtime: VM.Runtime;
    constructor(runtime: VM.Runtime) {
        super('spineAnimation', 'foo');
        this.runtime = runtime;
        console.log(runtime);
        this.translate = getTranslate(runtime);
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
    }
    initUI() {
        const s = new scratchStroageUI(this.runtime.storage, 'spineAnimation');
        s.createUI();
        console.log(s);
    }
}
registerExt(new ext(Scratch.runtime));
