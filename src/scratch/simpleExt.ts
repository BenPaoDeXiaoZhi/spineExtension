export interface MenuItem {
    text: string;
    value: string;
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
    name: string;
    blocks: Array<BlockInfo>;
    menus?: { [menuId: string]: MenuInfo };
}

export interface extInstance {
    getInfo(): extInfo;
}

export interface BlockInfo {
    opcode: string;
    text: string;
    blockType: BlockTypeValues;
    branchCount?: number;
    terminal?: boolean;
    blockAllThreads?: boolean;
    arguments?: {
        [argName: string]: {
            type: ArgumentTypeValues;
            default?: string | number;
            menu?: string;
        };
    };
}

export class SimpleExt implements extInstance {
    info: extInfo;
    constructor(id: string, name: string) {
        this.info = { id, name, blocks: [] };
    }
    getInfo(): extInfo {
        return this.info;
    }
    buildBlock(
        opcode: string,
        text: string,
        blockType: BlockTypeValues,
        other
    ) {
        const block: BlockInfo = {
            opcode,
            text,
            blockType,
        };
        Object.assign(block, other);
        this.info.blocks.push(block);
    }
    buildMenu(
        name: string,
        acceptReporters: boolean,
        items: MenuItems | string | (() => MenuItems)
    ) {
        if (items instanceof Function) {
            const menu_name = items.name || `menu_${name}`;
            this[menu_name] = items;
            this.info.menus[name] = {
                acceptReporters,
                items: menu_name,
            };
        } else {
            this.info.menus[name] = {
                acceptReporters,
                items: items,
            };
        }
    }
}
export class Items extends Array implements MenuItems {
    constructor(items: MenuItems | string[][] = []) {
        super();
        items.forEach((item) => {
            this.pushItem(item);
        });
    }
    pushItem(item: string[] | MenuItem) {
        if (item instanceof Array) {
            this.push({ text: item[0], value: item[1] });
        } else {
            this.push(item);
        }
    }
    addItem(text: string, value: string) {
        this.push({ text, value });
    }
}

export default SimpleExt;
