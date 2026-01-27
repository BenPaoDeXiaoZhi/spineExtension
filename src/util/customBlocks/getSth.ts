import { Ext } from '../..';
import {
    customBlock,
    registerConnectionCallback,
    createVMShadow,
} from '../customBlockly';
import type Blockly from 'blockly';
import { Block, BlockSvg, Connection, FieldDropdown, Input } from 'blockly';
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
type ConnMap = Map<string, { shadow: boolean; connection: Connection }>;

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
        // 如果新值类型不同,进行警告
        (dropdownField as any).setText(``);
    }
}

function addShadow(input: Input, type: ShadowId, blockly: typeof Blockly) {
    blockly.Events.disable();
    const newBlock = blockly.getMainWorkspace().newBlock(type) as BlockSvg;
    try {
        newBlock.setShadow(true);
        newBlock.initSvg();
        newBlock.render();
        newBlock.outputConnection.connect(input.connection);
    } finally {
        blockly.Events.enable();
    }
    const blockDat = createVMShadow(newBlock);
    return blockDat;
}

function removeAllInputs(block: BlockSvg, VMBlocks?: VM.Blocks) {
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
            if (!(VMBlocks && block.id in VMBlocks?._blocks)) {
                return;
            }
            delete VMBlocks._blocks[block.id].inputs[input.name];
        }
    });
    return connectionMap;
}

function addArgInputs(block: BlockSvg, key: string, VMBlocks?: VM.Blocks) {
    if (!(key in getSthMenuItems)) {
        // 这一般是错了吧...
        return;
    }
    if (!('args' in getSthMenuItems[key])) {
        return;
    }
    const args = getSthMenuItems[key].args as ArgumentConfig[];
    args.forEach((v) => {
        const input = block.appendValueInput(`ARG_${v.name}`);
        input.appendField(resolveMaybeFunc(v.prefix));
        if (!(VMBlocks && block.id in VMBlocks?._blocks)) {
            return;
        }
        VMBlocks._blocks[block.id].inputs[`ARG_${v.name}`] = {
            name: `ARG_${v.name}`,
            block: null,
            shadow: null,
        };
    });
}

function reconnect(
    block: BlockSvg,
    connectionMap: ConnMap,
    VMBlocks: VM.Blocks,
) {
    connectionMap.forEach((cfg, name) => {
        const input = block.getInput(`ARG_${name}`);
        if (input) {
            if (cfg.shadow) {
                if (input.connection.targetBlock()) {
                    input.connection.targetBlock().dispose(); // 原本连接的就是shadow,把新添加的删了
                }
            }
            cfg.connection.connect(input.connection);
        } else if (cfg.shadow) {
            // 不存在的shadow应被删除, vm中listen的删除不会处理shadow
            const oldShadow = cfg.connection.getSourceBlock();
            if (!(VMBlocks && oldShadow.id in VMBlocks?._blocks)) {
                return;
            }
            delete VMBlocks._blocks[oldShadow.id];
            oldShadow.dispose();
        }
    });
}

function mutationToDom(key: string) {
    const mutation = document.createElement('mutation');
    mutation.setAttribute('key', key);
    return mutation;
}

function attachShadows(
    block: BlockSvg,
    newKey: GetSthMenuItems,
    blockly: typeof Blockly,
    VMBlocks?: VM.Blocks,
) {
    if (!(newKey in getSthMenuItems && 'args' in getSthMenuItems[newKey])) {
        return;
    }
    const argConfig = getSthMenuItems[newKey].args as ArgumentConfig[];
    argConfig.forEach((cfg) => {
        const input = block.getInput(`ARG_${cfg.name}`);
        const newBlock = addShadow(input, cfg.type, blockly);
        if (!(VMBlocks && block.id in VMBlocks?._blocks)) {
            return;
        }
        VMBlocks._blocks[newBlock.id] = newBlock;
        const VMInput = VMBlocks._blocks[block.id].inputs[`ARG_${cfg.name}`];
        VMInput.shadow = newBlock.id;
        VMInput.block = newBlock.id;
    });
}

function updateArgs(
    block: BlockSvg,
    newKey: GetSthMenuItems,
    target: VM.RenderedTarget,
    blockly: typeof Blockly,
) {
    debugger;
    const connectionMap = removeAllInputs(block, target?.blocks);
    addArgInputs(block, newKey, target?.blocks);
    attachShadows(block, newKey, blockly, target?.blocks);
    reconnect(block, connectionMap, target?.blocks);
    if (!(target && block.id in target.blocks._blocks)) {
        return;
    }
    const origMutation = block.mutationToDom().outerHTML;
    blockly.Events.fire(
        new blockly.Events.BlockChange(
            block,
            'mutation',
            null,
            origMutation,
            block.mutationToDom(newKey).outerHTML,
        ),
    );
}

export function setupGetSth(ext: Ext, NS: string) {
    const Blockly = ext.runtime.scratchBlocks;
    customBlock(`${NS}_${ext.getSthOf.name}`, Blockly, function (orig) {
        return {
            mutationToDom(this: BlockSvg, key = this.getFieldValue('KEY')) {
                return mutationToDom(key);
            },
            /**
             * 从工作区xml恢复块时会用到
             */
            domToMutation(dom: HTMLElement) {
                updateArgs(
                    this,
                    dom.getAttribute('key') as GetSthMenuItems,
                    ext.runtime.getEditingTarget(),
                    Blockly,
                );
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
                if (this.isInsertionMarker_ || !this.getInput) {
                    return;
                }
                const dataInput = this.getInput('DATA');
                const dropdownField = new Blockly.FieldDropdown(
                    () => {
                        if (
                            this.isInFlyout ||
                            this.isInsertionMarker_ ||
                            !this.dispose
                        ) {
                            return Object.keys(getSthMenuItems).map(
                                (v: GetSthMenuItems) => [
                                    translate(`getSthMenu.${v}`) || v,
                                    v,
                                ],
                            );
                        }
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
                    (v: GetSthMenuItems) => {
                        if (
                            this.isInFlyout ||
                            this.isInsertionMarker_ ||
                            !this.dispose
                        ) {
                            return v;
                        }
                        updateArgs(
                            this,
                            v,
                            ext.runtime.getEditingTarget(),
                            Blockly,
                        );

                        return v;
                    },
                );
                registerConnectionCallback(
                    dataInput.connection,
                    (otherConn) => {
                        const block = otherConn.getSourceBlock();
                        if (block.type === `${NS}_${ext.getSthOf.name}`) {
                            updateMenuText(this, block, ext, NS);
                        }
                    },
                );
                keyInput.removeField('KEY');
                keyInput.appendField(dropdownField, 'KEY');
            },
        };
    });
}
