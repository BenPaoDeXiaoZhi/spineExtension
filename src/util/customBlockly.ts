import {
    Connection,
    type BlockSvg,
    type Blocks,
    type default as Blockly,
} from 'blockly';

type BlockConfig = {
    init(this: BlockSvg): BlockSvg | any;
    domToMutation?: (this: BlockSvg, element: HTMLElement) => any;
    mutationToDom?: (this: BlockSvg) => HTMLElement;
    [key: string]: (this: BlockSvg, ...args: any) => any;
};

export function customBlock(
    id: string,
    blockly: typeof Blockly,
    config: (orig: { init(): any }) => BlockConfig,
) {
    let origConfig: { init(): any };
    delete blockly.Blocks[id];
    Object.defineProperty(blockly.Blocks, id, {
        set(v) {
            origConfig = v;
        },
        get() {
            if (!origConfig) {
                origConfig = {
                    init() {
                        return this;
                    },
                };
            }
            return config(origConfig);
        },
        configurable: true,
    });
}

export function registerConnectionCallback(
    connection: Connection,
    callback: (otherConn: Connection) => any,
) {
    const origConnect = (connection as any).connect_;
    (connection as any).connect_ = function (otherConn: Connection) {
        callback(otherConn);
        origConnect.call(this, otherConn);
    };
}
