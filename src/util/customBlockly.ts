import { Connection, type BlockSvg, type Blocks } from 'blockly';
export function customBlock(
    id: string,
    blockly: any,
    config: (originConfig: { init(): any }) => {
        init(this: BlockSvg): BlockSvg | any;
    }
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
    callback: (otherConn: Connection) => any
) {
    const origConnect = (connection as any).connect_;
    (connection as any).connect_ = function (otherConn: Connection) {
        callback(origConnect);
        origConnect.call(this, otherConn);
    };
}
