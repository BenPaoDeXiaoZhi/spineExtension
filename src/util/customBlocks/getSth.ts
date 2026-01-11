import { Ext } from '../..';
import { customBlock, registerConnectionCallback } from '../customBlockly';
import { Block, BlockSvg, Connection, FieldDropdown } from 'blockly';
import { getTranslate } from '../../i18n/translate';
const translate = getTranslate();

export const getSthMenuItems = [
    'skin.name',
    'skin.skeleton',
    'skin.x',
    'skin.y',
    'skeleton.bones',
    'skeleton.animations',
    'skin.animationState',
] as const satisfies (`skin.${string}` | `skeleton.${string}`)[];

export type GetSthMenuItems = (typeof getSthMenuItems)[number];

function filterItemsWithBlock(block: Block, ext: Ext, NS: string): string[] {
    if (!block) {
        return getSthMenuItems;
    }
    let filteredMenus: GetSthMenuItems[];
    if (block.type !== `${NS}_${ext.getSthOf.name}`) {
        return getSthMenuItems;
    }
    const keyValue = block.getFieldValue('KEY') as GetSthMenuItems;
    if (!keyValue) {
        return getSthMenuItems;
    }
    switch (keyValue) {
        case 'skin.name':
        case 'skin.x':
        case 'skin.y':
        case 'skeleton.bones':
        case 'skeleton.animations':
            return ['none'];
        case 'skin.skeleton':
            return getSthMenuItems.filter((v) => v.startsWith('skeleton'));
        case 'skin.animationState':
            return ['needUpdate'];
        default:
            filteredMenus = getSthMenuItems;
            return filteredMenus;
    }
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
