import type { BlockSvg, Blocks } from 'blockly';
export function customBlock(
    id: string,
    blockly: any,
    config: (originConfig: { init(): any }) => {
        init(this: BlockSvg): BlockSvg | any;
    }
) {
    let origInit: { init(): any };
    Object.defineProperty(blockly.Blocks, id, {
        set(v) {
            origInit = v;
        },
        get() {
            return config(origInit);
        },
        configurable: true,
    });
}
