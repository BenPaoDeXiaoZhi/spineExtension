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

export function createVMShadow(block: BlockSvg){
    // skeleton
    const blockDat = {
        id: block.id, // Block ID
        opcode: block.type, // For execution, "event_whengreenflag".
        inputs: {}, // Inputs to this block and the blocks they point to.
        fields: {}, // Fields on this block and their values.
        next: null, // Next block in the stack, if one exists.
        topLevel: false, // If this block starts a stack. 对于shadow，这个应为false
        parent: block.outputConnection.targetBlock(), // Parent block ID, if available.
        shadow: true, // If this represents a shadow/slot.
        // powered by xigua start
        hidden: false,
        locked: false,
        collapsed: false,
        // powered by xigua end
        x: block.x, // X position of script, if top-level.
        y: block.y // Y position of script, if top-level.
    };
    if(block.type == "text"){
        blockDat.fields["TEXT"] = block.getFieldValue("TEXT");
    }
    if(block.type == "math_number"){
        blockDat.fields["NUM"] = block.getFieldValue("NUM");
    }
    return blockDat;
}