import { Ext } from '../..';
import {
    customBlock,
    registerConnectionCallback,
    createVMShadow,
} from '../customBlockly';
import Blockly, {
    Block,
    BlockSvg,
    Connection,
    FieldDropdown,
    Input,
} from 'blockly';
import { getTranslate } from '../../i18n/translate';
import { maybeFunc, resolveMaybeFunc } from '../htmlReport';
const translate = getTranslate();

export type ArgumentConfig = {
    name: string;
    prefix: maybeFunc<string>;
    type: ShadowId;
};
export type ShadowId = 'math_number' | 'text';
export const getSthMenuItems = {
    'skin.name': { type: 'string' },
    'skin.skeleton': { type: 'skeleton' },
    'skin.x': { type: 'number' },
    'skin.y': { type: 'number' },
    'skin.animationState': { type: 'animationState' },
    'skeleton.bones': { type: 'string' },
    'skeleton.animations': { type: 'string' },
    'skeleton.bone': {
        type: 'bone',
        args: [
            {
                name: 'ID',
                prefix: () => translate('getSthMenu.skeleton.bone.ID_prefix'),
                type: 'text',
            },
        ],
    },
    'bone.pos': { type: 'string' },
    'animationState.playing': {
        type: 'string',
        args: [
            {
                name: 'TRACK',
                prefix: () =>
                    translate('getSthMenu.animationState.TRACK_prefix'),
                type: 'math_number',
            },
        ],
    },
    'animationState.loop': {
        type: 'string',
        args: [
            {
                name: 'TRACK',
                prefix: () =>
                    translate('getSthMenu.animationState.TRACK_prefix'),
                type: 'math_number',
            },
        ],
    },
} as const satisfies {
    [K in `${'skin' | 'skeleton' | 'bone' | 'animationState'}.${string}`]: {
        type: string;
        args?: ArgumentConfig[];
    };
};

export type GetSthMenuItems = keyof typeof getSthMenuItems;
type ConnMap = Map<
    string,
    { shadow: boolean; connection: Connection }
>;

function filterItemsWithBlock(
    block: Block,
    ext: Ext,
    NS: string,
): GetSthMenuItems[] {
    const items = Object.keys(getSthMenuItems) as GetSthMenuItems[];
    if (!block) {
        return items;
    }
    if (block.type !== `${NS}_${ext.getSthOf.name}`) {
        return items;
    }
    const keyValue = block.getFieldValue('KEY') as GetSthMenuItems;
    if (!keyValue || !(keyValue in getSthMenuItems)) {
        return items;
    }
    const srcType = getSthMenuItems[keyValue]?.type;
    return items.filter((v) => v.startsWith(srcType));
}

function updateMenuText(
    sourceBlock: BlockSvg,
    targetBlock: Block,
    ext: Ext,
    NS: string,
) {
    if (!targetBlock) {
        return;
    }
    const dropdownField = sourceBlock.getField('KEY') as FieldDropdown;
    if (!dropdownField) {
        console.warn(sourceBlock, '找不到menu');
        return;
    }
    const originValue = dropdownField.getValue() as GetSthMenuItems;
    const filteredMenus = filterItemsWithBlock(targetBlock, ext, NS);
    if (!filteredMenus.includes(originValue)) {
        // 如果新值类型不同,使用正确类型
        dropdownField.setValue(filteredMenus[0]);
    }
}

function addShadow(input: Input, type: ShadowId, blockly: typeof Blockly) {
    blockly.Events.disable();
    const newBlock = blockly.getMainWorkspace().newBlock(type) as BlockSvg;
    try {
        newBlock.setShadow(true);
        newBlock.initSvg();
        newBlock.render();
    } finally {
        blockly.Events.enable();
    }
    blockly.Events.fire(
        new blockly.Events.BlockCreate(newBlock)
    );
    const blockDat = createVMShadow(newBlock);
    console.log(blockDat);
    newBlock.outputConnection.connect(input.connection)
    return blockDat;
}

function removeAllInputs(block: BlockSvg){
    const connectionMap: ConnMap = new Map();
    block.inputList.forEach((input) => {
        if (input.name.startsWith('ARG_')) {
            const target = input.connection.targetBlock();
            block.removeInput(input.name);
            input.connection.setShadowDom(null);
            if (target) {
                connectionMap.set(input.name, {
                    shadow: target.isShadow(), // shadow块在不需要时会被删除
                    connection: target.outputConnection,
                });
            }
            if (input.connection.targetConnection) {
                input.connection.disconnect();
            }
            input.dispose();
        }
    });
    return connectionMap;
};

function addArgInputs(block: BlockSvg, key: string){
    if (!(key in getSthMenuItems)) {
        // 这一般是错了吧...
        return;
    }
    if (!('args' in getSthMenuItems[key])) {
        return;
    }
    const args = getSthMenuItems[key].args as ArgumentConfig[];
    args.forEach((v) => {
        const input = this.appendValueInput(`ARG_${v.name}`);
        input.appendField(resolveMaybeFunc(v.prefix));
    });
}

function reconnect(block: BlockSvg, connectionMap: ConnMap){
    connectionMap.forEach((cfg, name)=>{
        const input = this.getInput(`ARG_${name}`);
        if(input){
            cfg.connection.connect(input.connection);
        }
        else if(cfg.shadow){ // 不存在的shadow应被删除
            cfg.connection.getSourceBlock().dispose();
        }
    });
}

export function setupGetSth(ext: Ext, NS: string) {
    const Blockly = ext.runtime.scratchBlocks;
    customBlock(`${NS}_${ext.getSthOf.name}`, Blockly, function (orig) {
        const config = {
            mutationToDom(this: BlockSvg, key = this.getFieldValue('KEY')) {
                const mutation = document.createElement('mutation');
                mutation.setAttribute('key', key);
                return mutation;
            },
            domToMutation(dom: HTMLElement) {
                const block = this as GetSthBlock;
                block.updateArgs(dom.getAttribute('key'));
            },
            init(this: BlockSvg) {
                orig.init.call(this);
                const keyInput = this.appendDummyInput();
                keyInput.appendField(
                    new Blockly.FieldDropdown([
                        [translate('getSthMenu.none'), 'none'],
                    ]),
                    'KEY',
                );
                if (
                    this.isInFlyout ||
                    this.isInsertionMarker_ ||
                    !this.dispose
                ) {
                    return;
                }
                const dataInput = this.getInput('DATA');
                const dropdownField = new Blockly.FieldDropdown(
                    () => {
                        const otherBlock = dataInput.connection.targetBlock();
                        const filteredMenus = filterItemsWithBlock(
                            otherBlock,
                            ext,
                            NS,
                        );
                        return filteredMenus.map((v) => [
                            translate(`getSthMenu.${v}`) || v,
                            v,
                        ]);
                    },
                    (v) => {
                        (this as GetSthBlock).updateArgs(v);
                        if (this.outputConnection.targetBlock()) {
                            const targetBlock =
                                this.outputConnection.targetBlock() as unknown as GetSthBlock;
                            if (
                                targetBlock.type !==
                                `${NS}_${ext.getSthOf.name}`
                            ) {
                                return;
                            }
                            requestAnimationFrame(() =>
                                targetBlock.updateMenu(),
                            ); //连接以后再刷新
                        }
                        return v;
                    },
                );
                registerConnectionCallback(
                    dataInput.connection,
                    (otherConn) => {
                        (this as GetSthBlock).updateMenu(otherConn);
                    },
                );
                keyInput.removeField('KEY');
                keyInput.appendField(dropdownField, 'KEY');
                (this as GetSthBlock).updateArgs(this.getFieldValue('KEY') as GetSthMenuItems);
            },
            updateMenu(this: BlockSvg, connection?: Connection) {
                const dataInput = this.getInput('DATA');
                if (!dataInput) {
                    return;
                }
                const targetBlock = connection // 内部连入
                    ? connection.getSourceBlock()
                    : dataInput.connection.targetBlock();
                if (!targetBlock) {
                    return;
                }
                updateMenuText(this, targetBlock, ext, NS);
                const parent = // 同步修改外部类型
                    this.outputConnection.targetBlock() as unknown as GetSthBlock;
                if (parent?.type !== `${NS}_${ext.getSthOf.name}`) {
                    return;
                }
                requestAnimationFrame(() => parent.updateMenu());
            },

            updateArgs(this: BlockSvg, key: string) {
                const connectionMap = removeAllInputs(this);
                addArgInputs(this, key);
                reconnect(this, connectionMap);
                const target = ext.runtime.getEditingTarget();
                if(!target){
                    return;
                }
                console.log(target.blocks._blocks[this.id]);
            },
        } as const;
        type GetSthBlock = typeof config & BlockSvg;
        return config;
    });
}
