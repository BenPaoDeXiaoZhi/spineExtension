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
    Bone,
} from './spine/spineVersions';
import { SpineManager } from './spineManager';
import { patch, HTMLReport } from './util/htmlReport';
import {
    SpineSkinReport,
    SpineSkeletonReport,
    SpineAnimationStateReport,
    SpineBoneReport,
} from './util/spineReports';
import { setupCustomBlocks } from './util/customBlock';
import { GetSthMenuItems } from './util/customBlocks/getSth';
import { GandiRuntime } from '../types/gandi-type';
import { getLogger } from './logSystem';
import { SpineConfig } from './spineConfig';
import { trimPos } from './util/pos';
import { getStateAndTrack } from './util/argsParse';
import insetIcon_ from '../assets/insetIcon.png'; // 防止发布后icon消失
import { Vector2 } from '42webgl';

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
    skins: SpineSkin[];

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
        this.skins = [];
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
            PROJECT_RUN_STOP: [() => setTimeout(this.gc.bind(this), 1000)],
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
     * 删除skin
     */
    gc() {
        for (const skin of this.skins) {
            skin.dispose();
            delete this.renderer._allSkins[skin._id];
        }
        this.skins = [];
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
        this.info.color1 = '#383f4c';
        this.info.color2 = '#20272F';
        this.info.blocks = [
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
                opcode: this.setBonePos.name,
                blockType: BlockType.COMMAND,
                text: translate('setBonePos.text'),
                tooltip: translate('setBonePos.tip'),
                arguments: {
                    BONE: {
                        type: null,
                    },
                    POS: {
                        type: ArgumentType.STRING,
                        defaultValue: '~, 0',
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
                opcode: this.addEmptyAnimation.name,
                text: translate('addEmptyAnimation.text'),
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
                    MIX: {
                        type: ArgumentType.NUMBER,
                        defaultValue: 0,
                    },
                },
                blockType: BlockType.COMMAND,
            },
            {
                opcode: this.animationCompleted.name,
                text: translate('animationCompleted.text'),
                arguments: {
                    STATE: {
                        type: null,
                    },
                    TRACK: {
                        type: ArgumentType.NUMBER,
                        defaultValue: 0,
                    },
                },
                blockType: BlockType.BOOLEAN,
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
                skel: String(SKEL_URL),
                atlas: String(ATLAS_URL),
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
        arg: { TARGET_NAME: string; SKELETON: number | SpineSkinReport },
        util: Util,
    ) {
        const { TARGET_NAME, SKELETON } = arg;
        let skinId: any;
        if (!SKELETON) {
            logger.error(translate('setSkinSkeleton.skeletonIdError'));
            return;
        }
        if (SKELETON instanceof SpineSkinReport) {
            skinId = SKELETON.valueOf().id;
        } else {
            skinId = Number(SKELETON.toString());
        }
        if (isNaN(skinId) || skinId < 0) {
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
        this.skins.push(newSkin);
        return new SpineSkinReport(newSkin);
    }

    setRelativePos(args: { SKIN: SpineSkinReport; POS: string }) {
        const { SKIN, POS } = args;
        if (!(SKIN && SKIN instanceof SpineSkinReport)) {
            logger.error(translate('typeError'), args);
            return;
        }
        if (!(POS && typeof POS == 'string')) {
            logger.error(translate('typeError'), args);
            return;
        }
        const skin = SKIN.valueOf();
        let pos: string[], x: number, y: number;
        try {
            pos = trimPos(POS).split(',');
            x = pos[0] == '~' ? skin.skeletonRelativePos[0] : Number(pos[0]);
            y = pos[1] == '~' ? skin.skeletonRelativePos[1] : Number(pos[1]);
            if (isNaN(x) || isNaN(y)) {
                throw new Error(`pos (${POS}) is invalid`);
            }
        } catch (e) {
            logger.error(translate('typeError'), e);
        }
        skin.skeletonRelativePos = [x, y];
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
            | SpineSkeletonReport<Skeleton>
            | SpineBoneReport<Bone>
            | SpineAnimationStateReport<AnimationState>;
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
                case 'skeleton.bone': {
                    const ARG_ID = String(arg['ARG_ID']);
                    if (!ARG_ID) {
                        logger.error(translate('typeError'));
                    }
                    try {
                        const bone = skeleton.findBone(ARG_ID);
                        if (!bone) {
                            logger.error(
                                translate('typeError'),
                                'bone not found',
                            );
                        }
                        return new SpineBoneReport(bone);
                    } catch (e) {
                        logger.error(translate('typeError'), e);
                    }
                }
                case 'skeleton.bounds': {
                    const spine = spineVersions['4.2webgl'];
                    const offset = new spine.Vector2();
                    const size = new spine.Vector2();
                    skeleton.getBounds(offset, size);
                    return JSON.stringify({
                        x: offset.x,
                        y: offset.y,
                        width: size.x,
                        height: size.y,
                    });
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
        if (DATA instanceof SpineBoneReport) {
            if (!KEY.startsWith('bone')) {
                logger.error(translate('typeError'));
                return '';
            }
            const bone = DATA.valueOf();
            switch (KEY) {
                case 'bone.pos':
                    return JSON.stringify([bone.worldX, bone.worldY]);
            }
        }
        if (DATA instanceof SpineAnimationStateReport) {
            if (!KEY.startsWith('animationState')) {
                logger.error(translate('typeError'));
                return '';
            }
            const state = DATA.valueOf();
            const ARG_TRACK = Number(arg['ARG_TRACK']);
            if (isNaN(ARG_TRACK)) {
                logger.error(translate('typeError'));
                return '';
            }
            const track = state.tracks[ARG_TRACK];
            if (!track) {
                logger.error(translate('typeError'));
                return '';
            }
            switch (KEY) {
                case 'animationState.playing':
                    return track.animation.name;
                case 'animationState.loop':
                    return String(track.loop);
            }
        }
        logger.error(translate('typeError'));
        return '';
    }

    setBonePos(args: { BONE: SpineBoneReport<Bone>; POS: string }): void {
        const { BONE, POS } = args;
        if (!(BONE && BONE instanceof SpineBoneReport)) {
            logger.error(translate('typeError'));
            return;
        }
        if (!(POS && typeof POS == 'string')) {
            logger.error(translate('typeError'));
            return;
        }
        const bone = BONE.valueOf();
        let pos: string[], x: number, y: number;
        try {
            pos = trimPos(POS).split(',');
            x = pos[0] == '~' ? bone.worldX : Number(pos[0]);
            y = pos[1] == '~' ? bone.worldY : Number(pos[1]);
            if (isNaN(x) || isNaN(y)) {
                throw new Error(`pos (${pos.join(',')}) is invalid`);
            }
        } catch (e) {
            logger.error(translate('typeError'), e);
        }
        const srcVec = new Vector2(x, y);
        const dstVec = bone.parent ? bone.parent.worldToLocal(srcVec) : srcVec;
        bone.x = dstVec.x;
        bone.y = dstVec.y;
        bone.updateWorldTransform();
    }

    switchDebug() {
        this.enableDebugRender = !this.enableDebugRender;
        for (let manager of Object.values(this.managers)) {
            manager.debugRender = this.enableDebugRender;
        }
        this.runtime.emit('TOOLBOX_EXTENSIONS_NEED_UPDATE');
    }

    addAnimation(args: {
        STATE: SpineAnimationStateReport<AnimationState>;
        TRACK: number;
        NAME: string;
        LOOP: boolean;
        ACTION: 'add' | 'set';
    }) {
        const { STATE, TRACK, NAME, LOOP, ACTION } = args;
        try {
            const { animationState } = getStateAndTrack(STATE, TRACK);
            if (ACTION == 'add') {
                animationState.addAnimation(TRACK, NAME, !!LOOP, 0);
            } else {
                animationState.setAnimation(TRACK, NAME, !!LOOP);
            }
        } catch (e) {
            return String(e);
        }
    }

    addEmptyAnimation(args: {
        STATE: SpineAnimationStateReport<AnimationState>;
        TRACK: number;
        ACTION: 'add' | 'set';
        MIX: number;
    }) {
        const { STATE, TRACK, ACTION, MIX } = args;
        try {
            const { animationState } = getStateAndTrack(STATE, TRACK);
            if (ACTION == 'add') {
                animationState.addEmptyAnimation(TRACK, MIX, 0);
            } else {
                animationState.setEmptyAnimation(TRACK, MIX);
            }
        } catch (e) {
            logger.error(translate('typeError'), e);
        }
    }

    animationCompleted(args: {
        STATE: SpineAnimationStateReport<AnimationState>;
        TRACK: number;
    }): boolean {
        const { STATE, TRACK } = args;
        try {
            const { track } = getStateAndTrack(STATE, TRACK);
            if (!track) {
                logger.error(translate('typeError'));
                return true;
            }
            return track.isComplete();
        } catch (e) {
            logger.error(e);
            return false;
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
