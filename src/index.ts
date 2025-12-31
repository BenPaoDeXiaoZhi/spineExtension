import { registerExtDetail } from './scratch/register';
import { getTranslate, zh_cn, en, TranslateFn } from './i18n/translate';
import { SimpleExt } from './scratch/simpleExt';
import type { extInfo, MenuItems } from './scratch/simpleExt';
import type VM from 'scratch-vm';
import { scratchStorageUI } from './util/storage';
import { SpineSkin, patchSpineSkin } from './spineSkin';
import spineVersions, { Skeleton } from './spine/spineVersions';
import { Spine40Manager, Spine42Manager } from './spineManager';
import { patch, HTMLReport } from './util/htmlReport';
import { SpineSkinReport, SpineSkeletonReport } from './util/spineReports';
import { setupCustomBlocks } from './util/customBlock';
import { GetSthMenuItems } from './util/customBlocks/getSth';
import { GandiRuntime } from '../types/gandi-type';

const insetIcon =
    'https://m.ccw.site/creator-college/cover/e080227a1e199d9107f2d2b8859a35f0.png';
const icon =
    'https://m.ccw.site/creator-college/cover/953085977e001622fd7153eb7c9ad646.png';

const { BlockType, ArgumentType } = Scratch;
const MAX_PROXY_DEPTH = 5;
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

const NS = 'spineAnimation' as const;

function createADSProxy(target: object, depth: number = 0) {
    if (depth >= MAX_PROXY_DEPTH) {
        return `[DEPTH EXCEEDED!](${typeof target})`;
    }
    try {
        const proxy = new Proxy(target, {
            setPrototypeOf() {
                // ads会修改原型,造成问题
                return true;
            },
            getPrototypeOf(target) {
                return null;
            },
            get(target, key) {
                if (target[key] instanceof Function) {
                    return null;
                }
                if (!(key in target)) {
                    return undefined;
                }
                if (target[key] instanceof Object) {
                    let value = target[key];
                    if ('toJSON' in value) {
                        value = value.toJSON();
                    }
                    return createADSProxy(value, depth + 1);
                }
                return target[key];
            },
        });
        return proxy;
    } catch (e) {
        console.warn(e, target);
        return null;
    }
}

class SpineExtension extends SimpleExt {
    translate: TranslateFn;
    runtime: GandiRuntime;
    managers: SpineManagers;
    renderer: RenderWebGL;
    constructor(runtime: GandiRuntime) {
        super(NS, 'foo');
        this.runtime = runtime;
        this.translate = getTranslate(runtime);
        this.renderer = runtime.renderer;
        patchSpineSkin(this.runtime);
        patch(this.runtime);
        this.setCustomBlock();
        this.patchADS();
        this.runtime.on('EXTENSION_ADDED', this.patchADS.bind(this));
        this.managers = {
            '4.0webgl': new Spine40Manager(this.renderer),
            '4.2webgl': new Spine42Manager(this.renderer),
        };
    }

    setCustomBlock() {
        setupCustomBlocks(this, NS);
    }

    /**
     * patch 高级数据结构
     */
    patchADS() {
        console.log(arguments);
        type SafeObject = {
            getActualObject: (value: object) => object;
            orig_?: SafeObject;
        };
        if (!('SafeObject' in this.runtime)) {
            return;
        }
        const SafeObject = this.runtime.SafeObject as SafeObject;
        if ('orig_' in SafeObject) {
            // 如果之前patch过,进行修复
            SafeObject.getActualObject = SafeObject.orig_.getActualObject;
        }
        console.log(SafeObject);
        const orig = SafeObject.getActualObject;
        SafeObject.orig_ = { getActualObject: orig };
        SafeObject.getActualObject = function (value) {
            if (value instanceof HTMLReport) {
                return createADSProxy(value.valueOf());
            } else {
                return orig.call(this, value);
            }
        };
    }

    getInfo(): extInfo {
        this.info.name = this.translate('extensionName');
        this.info.blockIconURI = insetIcon;
        this.info.color1 = '#272D39';
        this.info.color2 = '#20272F';
        this.info.blocks = [
            {
                opcode: this.loadSkeleton.name,
                text: this.translate('loadSkeleton.text'),
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
                opcode: this.setSkinSkeleton.name,
                text: this.translate('setSkinSkeleton.text'),
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
                opcode: this.setRelativePos.name,
                text: this.translate('setRelativePos.text'),
                blockType: BlockType.COMMAND,
                arguments: {
                    SKIN: {
                        type: null,
                    },
                    POS: {
                        type: ArgumentType.STRING,
                        defaultValue: JSON.stringify([0, 0]),
                    },
                },
            },
            {
                opcode: this.getSkeletonInSkin.name,
                text: this.translate('getSkeletonInSkin.text'),
                blockType: BlockType.REPORTER,
                arguments: {
                    SKIN: {
                        type: null,
                    },
                },
            },
            {
                opcode: this.getSthOf.name,
                text: this.translate('getSthOf.text'),
                blockType: BlockType.REPORTER,
                arguments: {
                    DATA: {
                        type: null,
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
        return this.info;
    }

    spriteMenu(): MenuItems {
        const items: MenuItems = [
            {
                text: this.translate('spriteMenu.currentTarget'),
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
        arg: { TARGET_NAME: string; SKELETON: number | HTMLReport },
        util: Utility
    ) {
        const { TARGET_NAME, SKELETON } = arg;

        console.log(SKELETON);
        let skinId: any;
        if (SKELETON instanceof SpineSkinReport) {
            skinId = SKELETON.valueOf().id;
        } else {
            skinId = Number(SKELETON.toString());
        }
        if (isNaN(skinId)) {
            console.error(this.translate('setSkinSkeleton.skeletonIdError'));
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
                console.warn(
                    this.translate('setSkinSkeleton.characterNotFound', {
                        name: TARGET_NAME,
                    })
                );
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
            throw new Error(this.translate('loadSkeleton.configError'));
        }
        const manager = this.managers[version];
        const { skeleton, animationState } = await manager.loadSkeleton(
            skel,
            atlas
        );
        skeleton.data.name = NAME;
        console.log(skeleton, animationState);
        const skinId = this.renderer._nextSkinId++;
        const newSkin = (this.renderer._allSkins[skinId] = new SpineSkin(
            skinId,
            this.renderer,
            manager,
            skeleton,
            animationState,
            new spineVersions[version].TimeKeeper(),
            NAME
        ));
        console.log(newSkin.name);
        return new SpineSkinReport(newSkin, this.translate);
    }

    setRelativePos(args) {
        console.log(args);
    }

    initUI() {
        const s = new scratchStorageUI(this.runtime.storage, 'spineAnimation');
        s.createUI();
        console.log(s);
    }

    getSkeletonInSkin(arg: { SKIN: any | SpineSkinReport }) {
        const { SKIN } = arg;
        if (SKIN && SKIN instanceof SpineSkinReport) {
            const skin = SKIN.valueOf();
            return new SpineSkeletonReport(
                skin.skeleton,
                this.translate,
                skin.name
            );
        }
        console.error(this.translate('getSkeletonInSkin.skinError'));
        return '';
    }

    getSthOf(arg: {
        KEY: GetSthMenuItems;
        DATA:
            | SpineSkinReport
            | SpineSkeletonReport<Skeleton<keyof typeof spineVersions>>;
    }): string {
        console.log(arg);
        const { KEY, DATA } = arg;
        if (DATA instanceof SpineSkeletonReport) {
            if (!KEY.startsWith('skeleton')) {
                console.error('类型错误');
                return '';
            }
            const skeleton = DATA.valueOf();
            switch (KEY) {
                case 'skeleton.bones': {
                    const names: string[] = [];
                    for (const bone of skeleton.bones) {
                        names.push(bone.data.name);
                    }
                    return JSON.stringify(names);
                }
                case 'skeleton.animations': {
                    const names: string[] = [];
                    for (const animation of skeleton.data.animations) {
                        names.push(animation.name);
                    }
                    return JSON.stringify(names);
                }
            }
        }
        if (DATA instanceof SpineSkinReport) {
            if (!KEY.startsWith('skin')) {
                console.error('类型错误');
                return '';
            }
            const skin = DATA.valueOf();
            switch (KEY) {
                case 'skin.name':
                    return skin.name;
                case 'skin.x': // skeleton的坐标过于底层，没有获取意义
                    return String(skin.skeletonRelativePos[0]);
                case 'skin.y':
                    return String(skin.skeletonRelativePos[1]);
            }
        }
        console.error('类型错误');
        return '';
    }
}

registerExtDetail(SpineExtension, {
    info: {
        name: 'spineAnimation.name',
        description: 'spineAnimation.desc',
        extensionId: NS,
        collaboratorList: [
            {
                collaborator: '孟夫子驾到@ccw',
                collaboratorURL:
                    'https://www.ccw.site/student/63c2807d669fa967f17f5559',
            },
            {
                collaborator: '乌龙茶速递@ccw',
                collaboratorURL:
                    'https://www.ccw.site/student/68dd004586bbc77f84e309ac',
            },
        ],
        iconURL: icon,
        insetIconURL: insetIcon,
    },
    l10n: {
        'zh-cn': {
            'spineAnimation.name': zh_cn.extensionName,
            'spineAnimation.desc': zh_cn.description,
        },
        en: {
            'spineAnimation.name': en.extensionName,
            'spineAnimation.desc': en.description,
        },
    },
});

export type Ext = SpineExtension;
