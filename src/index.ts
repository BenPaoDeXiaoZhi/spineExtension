import { registerExt } from './scratch/register';
import { getTranslate, Id } from './l18n/translate';
import { SimpleExt } from './scratch/simpleExt';
import type { extInfo, MenuItems } from './scratch/simpleExt';
const { BlockType, ArgumentType, runtime } = Scratch;
import type VM from 'scratch-vm';
import { scratchStroageUI } from './util/storage';
import { SpineSkin, patchSpineSkin } from './spineSkin';
import spineVersions from './spine/spineVersions';
import { Spine40Manager, Spine42Manager } from './spineManager';
import { patch, HTMLReport } from './util/htmlReport';
import { Skeleton } from '40webgl';
type Utility = VM.BlockUtility;
type SpineManagers = {
    '4.0webgl': Spine40Manager;
    '4.2webgl': Spine42Manager;
};

class SpineConfig {
    private _skel: string;
    private _atlas: string;
    version: keyof SpineManagers;
    constructor(config: {
        skel: string;
        atlas: string;
        version: keyof SpineManagers;
    }) {
        this.version = config.version;
        this.skel = config.skel;
        this.atlas = config.atlas;
    }
    set skel(v: string) {
        if (v.startsWith('http')) {
            this._skel = v;
        } else {
            this._skel = `https://m.ccw.site/user_projects_assets/${v}`;
        }
    }
    get skel() {
        return this._skel;
    }

    set atlas(v: string) {
        if (v.startsWith('http')) {
            this._atlas = v;
        } else {
            this._atlas = `https://m.ccw.site/user_projects_assets/${v}`;
        }
    }
    get atlas() {
        return this._atlas;
    }

    toJSON() {
        return {
            skel: this.skel,
            atlas: this.atlas,
            version: this.version,
        };
    }
}

class ext extends SimpleExt {
    translate: (id: Id, args?: object) => string;
    runtime: VM.Runtime;
    managers: SpineManagers;
    renderer: RenderWebGL;
    constructor(runtime: VM.Runtime) {
        console.log(runtime);
        super('spineAnimation', 'foo');
        this.runtime = runtime;
        console.log(this);
        this.translate = getTranslate(runtime);
        this.renderer = runtime.renderer;
        patchSpineSkin(this.runtime);
        patch(this.runtime);
        this.managers = {
            '4.0webgl': new Spine40Manager(this.renderer),
            '4.2webgl': new Spine42Manager(this.renderer),
        };
        this.info.name = this.translate('spineAnimation.extensionName');
        this.info.blocks = [
            {
                opcode: this.setSkinSkeleton.name,
                text: this.translate('spineAnimation.setSkinSkeleton.text'),
                blockType: BlockType.COMMAND,
                arguments: {
                    TARGET_NAME: {
                        type: ArgumentType.STRING,
                        menu: 'sprite_menu',
                    },
                    SKELETON: {
                        type: ArgumentType.NUMBER,
                        defaultValue: 0,
                    },
                },
            },
            {
                opcode: this.loadSkeleton.name,
                text: this.translate('spineAnimation.loadSkeleton.text'),
                blockType: BlockType.REPORTER,
                arguments: {
                    CONFIG: {
                        type: ArgumentType.STRING,
                        menu: 'skeleton_menu',
                    },
                    NAME: {
                        type: ArgumentType.STRING,
                        defaultValue: 'hina',
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
        const menuItems: MenuItems = [];
        menuItems.push({
            text: 'test',
            value: JSON.stringify(
                new SpineConfig({
                    skel: 'spine/Hina_home.skel',
                    atlas: 'spine/Hina_home.atlas',
                    version: '4.2webgl',
                })
            ),
        });
        return menuItems;
    }
    setSkinSkeleton(
        arg: { TARGET_NAME: string; SKELETON: string | HTMLReport },
        util: Utility
    ) {
        const { TARGET_NAME, SKELETON } = arg;

        console.log(SKELETON);
        let skinId: any;
        if (SKELETON instanceof HTMLReport) {
            skinId = SKELETON.valueOf().skinId;
        } else {
            skinId = Number(SKELETON);
        }
        if (isNaN(skinId)) {
            console.error('请输入数字或有效的skeleton数据');
            return;
        }
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
        const skin = this.runtime.renderer._allSkins[skinId];
        if (skin) {
            drawable.skin = skin;
        }
    }

    async loadSkeleton(arg: { CONFIG: string; NAME: string }) {
        const { CONFIG, NAME } = arg;

        const { skel, atlas, version } = JSON.parse(CONFIG) as {
            skel: string;
            atlas: string;
            version: keyof SpineManagers;
        };
        if (!(skel && atlas && version in spineVersions)) {
            throw new Error(
                this.translate('spineAnimation.loadSkeleton.configError')
            );
        }
        const manager = this.managers[version];
        const { skeleton, animationState } = await manager.loadSkeleton(
            skel,
            atlas
        );
        console.log(skeleton, animationState);
        const skinId = this.renderer._nextSkinId++;
        const newSkin = (this.renderer._allSkins[skinId] = new SpineSkin(
            skinId,
            this.renderer,
            manager,
            skeleton,
            animationState,
            new spineVersions[version].TimeKeeper()
        ));
        console.log(newSkin);
        const info = `名称为${NAME},<br>版本为${version},<br>skinId为${skinId}的骨骼`;
        const container = document.createElement('div');
        container.innerHTML = info;
        return new HTMLReport(
            container,
            Object.setPrototypeOf(
                { skinId, skeleton, animationState },
                Object.create(null)
            ),
            info.replaceAll('<br>', '\n')
        );
    }
    initUI() {
        const s = new scratchStroageUI(this.runtime.storage, 'spineAnimation');
        s.createUI();
        console.log(s);
    }
}
registerExt(new ext(runtime));
