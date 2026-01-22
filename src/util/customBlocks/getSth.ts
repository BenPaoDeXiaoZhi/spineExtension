import { Ext } from '../..';
import { customBlock, registerConnectionCallback } from '../customBlockly';
import Blockly, {
    Block,
    BlockSvg,
    Connection,
    FieldDropdown,
    Input,
} from 'blockly';
import { getTranslate } from '../../i18n/translate';
const translate = getTranslate();

export type ArgumentConfig = { name: string; prefix: string; type: ShadowId };
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
                prefix: translate('getSthMenu.skeleton.bone.ID_prefix'),
                type: 'math_number',
            },
        ],
    },
} as const satisfies {
    [K in `skin.${string}` | `skeleton.${string}`]: {
        type: string;
        args?: ArgumentConfig[];
    };
};

export type GetSthMenuItems = keyof typeof getSthMenuItems;

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
    try {
        const block = blockly.getMainWorkspace().newBlock(type) as BlockSvg;
        block.setShadow(true);
        block.initSvg();
        block.render();
        input.connection.connect(block.outputConnection);
    } finally {
        blockly.Events.enable();
    }
}

export function setupGetSth(ext: Ext, NS: string) {
    const Blockly = ext.runtime.scratchBlocks;
    customBlock(`${NS}_${ext.getSthOf.name}`, Blockly, function (orig) {
        const config = {
            mutationToDom(this: BlockSvg) {
                const mutation = document.createElement('mutation');
                mutation.setAttribute('key', this.getFieldValue('KEY'));
                return mutation;
            },
            domToMutation(dom: HTMLElement) {
                (this as GetSthBlock).updateArgs(dom.getAttribute('key'));
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
                        requestAnimationFrame(() =>
                            (this as GetSthBlock).updateArgs(),
                        );
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

            updateArgs(this: BlockSvg, key?: string) {
                this.inputList.forEach((input) => {
                    if (input.name.startsWith('ARG_')) {
                        this.removeInput(input.name);
                        const target = input.connection.targetBlock();
                        input.connection.setShadowDom(null);
                        if (target && target.isShadow()) {
                            target.dispose();
                        }
                        if (input.connection.targetConnection) {
                            input.connection.disconnect();
                        }
                        input.dispose();
                    }
                });
                const keyValue =
                    key || (this.getFieldValue('KEY') as GetSthMenuItems);
                if (!(keyValue in getSthMenuItems)) {
                    return;
                }
                if (!('args' in getSthMenuItems[keyValue])) {
                    return;
                }
                const args = getSthMenuItems[keyValue].args as ArgumentConfig[];
                args.forEach((v) => {
                    const input = this.appendValueInput(`ARG_${v.name}`);
                    input.appendField(v.prefix);
                    if (this.isInsertionMarker_) {
                        return;
                    }
                    addShadow(input, v.type, Blockly);
                });
            },
        } as const;
        type GetSthBlock = typeof config & BlockSvg;
        return config;
    });
}
