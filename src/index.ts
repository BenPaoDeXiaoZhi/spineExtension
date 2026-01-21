import { registerExtDetail } from './scratch/register';
import { getTranslate, zh_cn, en } from './i18n/translate';
import { SimpleExt } from './scratch/simpleExt';
import type { extInfo, MenuItems } from './scratch/simpleExt';
import type VM from 'scratch-vm';
import { scratchStorageUI } from './util/storage';
import { SpineSkin, patchSpineSkin } from './spineSkin';
import spineVersions, {
    AnimationState,
    Skeleton,
    VersionNames,
} from './spine/spineVersions';
import { SpineManager } from './spineManager';
import { patch, HTMLReport } from './util/htmlReport';
import {
    SpineSkinReport,
    SpineSkeletonReport,
    SpineAnimationStateReport,
} from './util/spineReports';
import { setupCustomBlocks } from './util/customBlock';
import { GetSthMenuItems } from './util/customBlocks/getSth';
import { GandiRuntime } from '../types/gandi-type';
import { getLogger } from './logSystem';
import { SpineConfig } from './spineConfig';

import insetIcon_ from '../assets/insetIcon.png'; // 防止发布后icon消失

const insetIcon = insetIcon_;
// 'https://m.ccw.site/creator-college/cover/5ecb4a0ae781edb9ed8ed3d61d210ad7.svg';
const icon =
    'https://m.ccw.site/creator-college/cover/953085977e001622fd7153eb7c9ad646.png';
const NS = 'spineAnimation' as const;
const { BlockType, ArgumentType } = Scratch;
const MAX_PROXY_DEPTH = 5;
const translate = getTranslate();
let logger = getLogger('console', NS);

type Util = VM.BlockUtility;

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
        logger.warn(e, target);
        return null;
    }
}

class SpineExtension extends SimpleExt {
    runtime: GandiRuntime;
    managers: {
        [K in VersionNames]: SpineManager<K>;
    };
    renderer: RenderWebGL;
    enableDebugRender: boolean;

    constructor(runtime: GandiRuntime) {
        super(NS, 'foo');
        this.runtime = runtime;
        this.renderer = runtime.renderer;
        patchSpineSkin(this.runtime);
        patch(this.runtime);
        this.setCustomBlock();
        this.patchADS();
        this.setupCallback();
        this.managers = {
            '4.0webgl': new SpineManager('4.0webgl', this.renderer),
            '4.2webgl': new SpineManager('4.2webgl', this.renderer),
            '3.8webgl': new SpineManager('3.8webgl', this.renderer),
        };
        this.enableDebugRender = false;
    }

    /**
     * 注册自定义blockly
     */
    setCustomBlock() {
        if (!this.runtime.scratchBlocks) {
            logger.log('blockly未暴露，不进行patch');
            return;
        }
        setupCustomBlocks(this, NS);
    }

    /**
     * 创建回调函数
     */
    setupCallback() {
        const callbacks = {
            EXTENSION_ADDED: [this.patchADS.bind(this)],
        };
        for (const key in callbacks) {
            for (const callback of callbacks[key]) {
                this.runtime.on(key, callback);
            }
        }
        const disposeCallback = (info: extInfo) => {
            if (info.id === NS || !(`ext_${NS}` in this.runtime)) {
                // 扩展被卸载时清理listener
                this.onDispose(callbacks);
                this.runtime.off('EXTENSION_DELETED', disposeCallback);
            }
        };
        this.runtime.on('EXTENSION_DELETED', disposeCallback);
    }

    /**
     * 扩展卸载回调
     */
    onDispose(callbacks: { [event: string]: Function[] }) {
        logger.log(`%c[EXT Dispose] %c${NS}`, 'color:red', 'color:blue');
        for (const key in callbacks) {
            for (const callback of callbacks[key]) {
                this.runtime.off(key, callback);
            }
        }
    }

    /**
     * patch 高级数据结构
     */
    patchADS(data?: { id: string }) {
        if (data && data.id !== 'moreDataTypes') {
            return;
        }
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
        const ext = this;
        this.info.name = translate('extensionName');
        this.info.blockIconURI = insetIcon;
        this.info.color1 = '#272D39';
        this.info.color2 = '#20272F';
        this.info.blocks = [
            {
                text: translate('initialize'),
                blockType: BlockType.LABEL,
            },
            {
                opcode: this.createSpineConfig.name,
                text: translate('createSpineConfig.text'),
                blockType: BlockType.REPORTER,
                arguments: {
                    SKEL_URL: {
                        type: ArgumentType.STRING,
                        defaultValue:
                            'https://m.ccw.site/user_projects_assets/spine/Hina_home.skel',
                    },
                    ATLAS_URL: {
                        type: ArgumentType.STRING,
                        defaultValue:
                            'https://m.ccw.site/user_projects_assets/spine/Hina_home.atlas',
                    },
                    VERSION: {
                        type: ArgumentType.STRING,
                        menu: 'VERSION',
                    },
                },
            },
            {
                opcode: this.loadSkeleton.name,
                text: translate('loadSkeleton.text'),
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
                text: translate('setSkinSkeleton.text'),
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
                blockType: BlockType.LABEL,
                text: translate('data'),
            },
            {
                opcode: this.setRelativePos.name,
                text: translate('setRelativePos.text'),
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
                opcode: this.getSthOf.name,
                text: translate('getSthOf.text'),
                blockType: BlockType.REPORTER,
                arguments: {
                    DATA: {
                        type: null,
                    },
                },
            },
            {
                blockType: BlockType.LABEL,
                text: translate('animation'),
            },
            {
                opcode: this.addAnimation.name,
                text: translate('addAnimation.text'),
                blockType: BlockType.COMMAND,
                arguments: {
                    STATE: {
                        type: null,
                    },
                    TRACK: {
                        type: ArgumentType.NUMBER,
                        defaultValue: 0,
                    },
                    ACTION: {
                        type: ArgumentType.STRING,
                        menu: 'animation_action_menu',
                    },
                    NAME: {
                        type: ArgumentType.STRING,
                        defaultValue: 'Idle_01',
                    },
                    LOOP: {
                        type: ArgumentType.STRING,
                        menu: 'BOOLEAN',
                    },
                },
            },
            {
                func: this.switchDebug.name,
                get text() {
                    return translate('debugRender', {
                        action: ext.enableDebugRender
                            ? translate('disable')
                            : translate('enable'),
                    });
                },
                blockType: BlockType.BUTTON,
            },
            /* {
                func: this.initUI.name,
                blockType: BlockType.BUTTON,
                text: 'abcd',
            }, */
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
            animation_action_menu: {
                items: [
                    {
                        text: translate('animation_action_menu.add'),
                        value: 'add',
                    },
                    {
                        text: translate('animation_action_menu.set'),
                        value: 'set',
                    },
                ],
                acceptReporters: true,
            },
            BOOLEAN: {
                items: [
                    { text: translate('BOOLEAN.true'), value: true },
                    { text: translate('BOOLEAN.false'), value: false },
                ],
                acceptReporters: true,
            },
            VERSION: {
                items: Object.keys(this.managers).map((v) => ({
                    text: v,
                    value: v,
                })),
                acceptReporters: true,
            },
        };
        return this.info;
    }

    spriteMenu(): MenuItems {
        const items: MenuItems = [
            {
                text: translate('spriteMenu.currentTarget'),
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

    createSpineConfig(args: {
        ATLAS_URL: string;
        SKEL_URL: string;
        VERSION: VersionNames;
    }) {
        const { SKEL_URL, ATLAS_URL, VERSION } = args;
        return JSON.stringify(
            new SpineConfig({
                skel: SKEL_URL,
                atlas: ATLAS_URL,
                version: VERSION,
            }),
        );
    }

    skeletonMenu(): MenuItems {
        const menuItems: MenuItems = [];
        menuItems.push({
            text: 'azusa',
            value: JSON.stringify(
                new SpineConfig({
                    skel: 'spine/Azusa_home.skel',
                    atlas: 'spine/Azusa_home.atlas',
                    version: '4.2webgl',
                }),
            ),
        });
        return menuItems;
    }

    setSkinSkeleton(
        arg: { TARGET_NAME: string; SKELETON: number | HTMLReport },
        util: Util,
    ) {
        const { TARGET_NAME, SKELETON } = arg;
        let skinId: any;
        if (SKELETON instanceof SpineSkinReport) {
            skinId = SKELETON.valueOf().id;
        } else {
            skinId = Number(SKELETON.toString());
        }
        if (isNaN(skinId)) {
            logger.error(translate('setSkinSkeleton.skeletonIdError'));
            return;
        }
        let target: VM.RenderedTarget;
        if (TARGET_NAME === '__this__') {
            target = util.target;
        } else {
            target = this.runtime.targets.find(
                (t) => t.isSprite() && t.getName() === TARGET_NAME,
            );
            if (!target) {
                logger.warn(
                    translate('setSkinSkeleton.characterNotFound', {
                        name: TARGET_NAME,
                    }),
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
            version: VersionNames;
        };
        if (!(skel && atlas && version in spineVersions)) {
            throw new Error(translate('loadSkeleton.configError'));
        }
        const manager = this.managers[version];
        const { skeleton, animationState } = await manager.loadSkeleton(
            skel,
            atlas,
        );
        skeleton.data.name = NAME;
        const skinId = this.renderer._nextSkinId++;
        const newSkin = (this.renderer._allSkins[skinId] = new SpineSkin(
            skinId,
            this.renderer,
            manager,
            skeleton,
            animationState,
            new spineVersions[version].TimeKeeper(),
            NAME,
        ));
        return new SpineSkinReport(newSkin);
    }

    setRelativePos(args) {
        // TODO:设置相对坐标
        logger.log(args);
    }

    initUI() {
        const s = new scratchStorageUI(this.runtime.storage, 'spineAnimation');
        s.createUI();
        logger.log(s);
    }

    getSthOf(arg: {
        KEY: GetSthMenuItems;
        DATA:
            | SpineSkinReport
            | SpineSkeletonReport<Skeleton<keyof typeof spineVersions>>;
    }): string | HTMLReport {
        const { KEY, DATA } = arg;
        if (DATA instanceof SpineSkeletonReport) {
            if (!KEY.startsWith('skeleton')) {
                logger.error(translate('typeError'));
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
                logger.error(translate('typeError'));
                return '';
            }
            const skin = DATA.valueOf();
            switch (KEY) {
                case 'skin.name':
                    return skin.name;
                case 'skin.skeleton':
                    return new SpineSkeletonReport(skin.skeleton, skin.name);
                case 'skin.x': // skeleton的坐标过于底层，没有获取意义
                    return String(skin.skeletonRelativePos[0]);
                case 'skin.y':
                    return String(skin.skeletonRelativePos[1]);
                case 'skin.animationState': {
                    return new SpineAnimationStateReport(skin.animationState);
                }
            }
        }
        logger.error(translate('typeError'));
        return '';
    }

    switchDebug() {
        this.enableDebugRender = !this.enableDebugRender;
        for (let manager of Object.values(this.managers)) {
            manager.debugRender = this.enableDebugRender;
        }
        this.runtime.emit('TOOLBOX_EXTENSIONS_NEED_UPDATE');
    }

    addAnimation(args: {
        STATE: SpineAnimationStateReport<
            AnimationState<keyof typeof spineVersions>
        >;
        TRACK: number;
        NAME: string;
        LOOP: boolean;
        ACTION: 'add' | 'set';
    }) {
        const { STATE, TRACK, NAME, LOOP, ACTION } = args;
        console.log(args);
        if (!STATE || !(STATE instanceof SpineAnimationStateReport)) {
            logger.error(translate('typeError'));
            return;
        }
        if (TRACK < 0) {
            logger.error(translate('addAnimation.invalidTrack'));
            return;
        }
        const animationState = STATE.valueOf();
        try {
            if (ACTION == 'add') {
                animationState.addAnimation(TRACK, NAME, !!LOOP, 0);
            } else {
                animationState.setAnimation(TRACK, NAME, !!LOOP);
            }
        } catch (e) {
            return String(e);
        }
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
        insetIconURL: insetIcon_,
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
