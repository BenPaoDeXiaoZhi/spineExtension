import type { BlockSvg, Blocks } from 'blockly';
export function customBlock(
    id: string,
    blockly: any,
    config: (this: BlockSvg) => BlockSvg
) {
    Object.defineProperty(blockly.Blocks, id, {
        set() {},
        get() {
            return config;
        },
    });
}
