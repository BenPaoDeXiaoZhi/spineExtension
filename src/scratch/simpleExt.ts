import VM from 'scratch-vm';
export interface MenuItem {
    text: string;
    value: string|number|boolean;
}

export type MenuItems = MenuItem[];

export interface MenuInfo {
    acceptReporters: boolean;
    items: MenuItems | string;
}

export interface extInfo {
    id: string;
    color1?: string;
    color2?: string;
    blockIconURI?: string;
    name: string;
    blocks: BlockInfo[];
    menus?: { [menuId: string]: MenuInfo };
}

export interface BlockInfo {
    opcode?: string;
    func?: string;
    text: string;
    blockType: BlockTypeValues;
    branchCount?: number;
    terminal?: boolean;
    blockAllThreads?: boolean;
    tooltip?: string;
    arguments?: {
        [argName: string]: {
            type: ArgumentTypeValues;
            defaultValue?: string | number;
            menu?: string;
        };
    };
}

export class SimpleExt {
    info: extInfo;

    constructor(id: string, name: string) {
        this.info = { id, name, blocks: [], menus: {} };
    }

    getInfo(): extInfo {
        return this.info;
    }
}

export default SimpleExt;
