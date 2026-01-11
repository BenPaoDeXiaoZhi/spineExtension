import type { Runtime } from 'scratch-vm';
import RenderWebGL from 'scratch-render';
import type Blockly from 'blockly';

type TranslateObj = Record<string, string>;

type origBlockly = typeof Blockly;

export declare interface GandiBlocks extends origBlockly {
    bindEventWithChecks_: typeof Blockly.browserEvents.conditionalBind;
}

export declare interface LogSystem {
    clear(): void;
    hide(): void;
    show(): void;
    info(...args: string[]): void;
    log(...args: string[]): void;
    warn(...args: string[]): void;
    error(...args: string[]): void;
}

export declare interface GandiRuntime extends Runtime {
    getFormatMessage<ZH extends TranslateObj, EN extends TranslateObj>(config: {
        'zh-cn': ZH;
        en: EN;
    }): <ID extends keyof ZH & keyof EN>(
        key: { default: ID },
        args: object
    ) => ZH[ID] & EN[ID];
    requestUpdateMonitor(monitor: Map<'id' | 'value', any>);

    scratchBlocks: GandiBlocks;
    renderer: GandiRenderer;
    on: Runtime['on'] & ((name: string, callback: Function) => void); // TODO:gandi特殊事件的补充
    off: Runtime['off'] & ((name: string, callback: Function) => void);
    logSystem: LogSystem;
}

export interface GandiRenderer extends RenderWebGL {
    exports: {
        Skin: typeof GandiSkin;
    };
    createSpineSkin(): [number, RenderWebGL.Skin];
}

export class GandiSkin extends RenderWebGL.Skin {
    constructor(id: number);
    static Events: {
        WasAltered: 'WasAltered';
    };
}
