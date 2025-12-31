import { Ext } from '../..';
import { customBlock, registerConnectionCallback } from '../customBlockly';
import type { BlockSvg, Connection } from 'blockly';

export const getSthMenuItems = [
    'skin.name',
    'skin.x',
    'skin.y',
    'skeleton.bones',
    'skeleton.animations',
] as const satisfies (`skin.${string}` | `skeleton.${string}`)[];

export type GetSthMenuItems = (typeof getSthMenuItems)[number];

function filterItemsWithOp(op: string, ext: Ext) {
    let filteredMenus: Readonly<GetSthMenuItems[]>;
    if (op.endsWith(ext.getSkeletonInSkin.name)) {
        filteredMenus = getSthMenuItems.filter((v) => v.startsWith('skeleton'));
    } else if (op.endsWith(ext.loadSkeleton.name)) {
        filteredMenus = getSthMenuItems.filter((v) => v.startsWith('skin'));
    } else {
        filteredMenus = getSthMenuItems;
    }
    return filteredMenus;
}

export function setupGetSth(ext: Ext, NS: string) {
    const Blockly = ext.runtime.scratchBlocks;
    customBlock(`${NS}_${ext.getSthOf.name}`, Blockly, function (orig) {
        return {
            init(this: BlockSvg) {
                orig.init.call(this);
                const keyInput = this.appendDummyInput();
                keyInput.appendField(
                    new Blockly.FieldDropdown(
                        getSthMenuItems.map((v) => [
                            ext.translate(`getSthMenu.${v}`) || v,
                            v,
                        ])
                    ),
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
                registerConnectionCallback(
                    dataInput.connection,
                    updateMenuText
                );
                const dropdownField = new Blockly.FieldDropdown(() => {
                    const op =
                        dataInput.connection.targetBlock()?.type || 'none';
                    const filteredMenus = filterItemsWithOp(op, ext);
                    return (filteredMenus as typeof getSthMenuItems).map(
                        (v) => [ext.translate(`getSthMenu.${v}`) || v, v]
                    );
                });
                function updateMenuText(otherConn: Connection) {
                    const op = otherConn.getSourceBlock()?.type;
                    const originValue =
                        dropdownField.getValue() as GetSthMenuItems;
                    const filteredMenus = filterItemsWithOp(op, ext);
                    if (!filteredMenus.includes(originValue)) {
                        // 如果新值类型不同,使用正确类型
                        dropdownField.setValue(filteredMenus[0]);
                    }
                }
                keyInput.removeField('KEY');
                keyInput.appendField(dropdownField, 'KEY');
            },
        };
    });
}
