import { Ext } from '../..';
import { customBlock, registerConnectionCallback } from '../customBlockly';
import { Block, BlockSvg, Connection, FieldDropdown } from 'blockly';
import { getTranslate } from '../../i18n/translate';
const translate = getTranslate();

export const getSthMenuItems = {
    'skin.name': {type:'string'},
    'skin.skeleton': {type:'skeleton'},
    'skin.x': {type:'number'},
    'skin.y': {type:'number'},
    'skin.animationState': {type:'animationState'},
    'skeleton.bones': {type:'string'},
    'skeleton.animations': {type:'string'},
} as const satisfies {
    [(`skin.${string}` | `skeleton.${string}`)]: {
        type: string,
        args?: any,
    }
};

export type GetSthMenuItems = keyof typeof getSthMenuItems;

function filterItemsWithBlock(block: Block, ext: Ext, NS: string): string[] {
    const items = Object.keys(getSthMenuItems)
    if (!block) {
        return items;
    }
    let filteredMenus: GetSthMenuItems[];
    if (block.type !== `${NS}_${ext.getSthOf.name}`) {
        return items;
    }
    const keyValue = block.getFieldValue('KEY') as GetSthMenuItems;
    if (!keyValue || !(keyValue in getSthMenuItems)) {
        return items;
    }
    const srcType = getSthMenuItems[keyValue]?.type;
    return items.filter((v)=>v.startsWith(srcType));
}

function updateMenuText(
    sourceBlock: BlockSvg,
    targetBlock: Block,
    ext: Ext,
    NS: string
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

export function setupGetSth(ext: Ext, NS: string) {
    const Blockly = ext.runtime.scratchBlocks;
    customBlock(`${NS}_${ext.getSthOf.name}`, Blockly, function (orig) {
        const config = {
            init(this: BlockSvg) {
                orig.init.call(this);
                const keyInput = this.appendDummyInput();
                keyInput.appendField(
                    new Blockly.FieldDropdown([
                        [translate('getSthMenu.none'), 'none'],
                    ]),
                    'KEY'
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
                            NS
                        );
                        return (filteredMenus as typeof getSthMenuItems).map(
                            (v) => [translate(`getSthMenu.${v}`) || v, v]
                        );
                    },
                    (v) => {
                        if (this.outputConnection.targetBlock()) {
                            const targetBlock =
                                this.outputConnection.targetBlock() as unknown as GetSthBlock;
                            if (
                                targetBlock.type !==
                                `${NS}_${ext.getSthOf.name}`
                            ) {
                                return;
                            }
                            setTimeout(() => targetBlock.updateMenu(), 0); //连接以后再刷新
                        }
                        return v;
                    }
                );
                registerConnectionCallback(
                    dataInput.connection,
                    (otherConn) => {
                        (this as GetSthBlock).updateMenu(otherConn);
                    }
                );
                keyInput.removeField('KEY');
                keyInput.appendField(dropdownField, 'KEY');
            },
            updateMenu(this: BlockSvg, connection?: Connection) {
                const dataInput = this.getInput('DATA');
                if (!dataInput) {
                    return;
                }
                const targetBlock = connection
                    ? connection.getSourceBlock()
                    : dataInput.connection.targetBlock();
                if (!targetBlock) {
                    return;
                }
                updateMenuText(this, targetBlock, ext, NS);
                const parent =
                    this.outputConnection.getSourceBlock() as unknown as GetSthBlock;
                if (parent?.type !== `${NS}_${ext.getSthOf.name}`) {
                    return;
                }
                setTimeout(() => parent.updateMenu(), 0);
            },
        } as const;
        type GetSthBlock = typeof config & BlockSvg;
        return config;
    });
}
