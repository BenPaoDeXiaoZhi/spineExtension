import type { Runtime } from 'scratch-vm';
import RenderWebGL from 'scratch-render';
import type Blockly from 'blockly';

type TranslateObj = Record<string, string>;
export interface GandiRuntime extends Runtime {
    getFormatMessage<ZH extends TranslateObj, EN extends TranslateObj>(config: {
        'zh-cn': ZH;
        en: EN;
    }): <ID extends keyof ZH & keyof EN>(
        key: { default: ID },
        args: object
    ) => ZH[ID] & EN[ID];

    scratchBlocks: typeof Blockly;
    renderer: GandiRenderer;
}
export interface GandiRenderer extends RenderWebGL {}
