import SimpleExt from './simpleExt';

interface ICollaboratorObj {
    collaborator: string;
    collaboratorURL: string;
}

interface ITempExt {
    info: {
        name: string;
        description: string;
        extensionId: string;
        iconURL?: string;
        insetIconURL?: string;
        featured?: boolean;
        disabled?: boolean;
        collaborator?: string;
        collaboratorList?: ICollaboratorObj[];
    };
    l10n: {
        'zh-cn': object;
        en: object;
    };
}

type windowWithTemp = typeof window & {
    tempExt: {
        Extension: new (runtime: VM.Runtime) => SimpleExt;
    } & ITempExt;
};

export function checkExt(ext: SimpleExt) {
    if (!ext || !ext.getInfo) {
        throw new Error('ext.getInfo is not defined');
    }
    const info = ext.getInfo();
    console.group(`register extension ${info.id}`);
    try {
        for (let block of info.blocks) {
            if (!block.opcode && !block.func) {
                console.error('opcode未定义');
                continue;
            }
            if (!ext[block.opcode] && !block.func) {
                console.error(`未设置的opcode function:`, block);
                ext[block.opcode] = () => {
                    console.error(`当前opcode:${block.opcode}函数未定义!`);
                };
            }
            for (let arg of block.text.match(/(?<=\[).+?(?=\])/g) || []) {
                if (!block.arguments) {
                    console.error(`块${block.opcode}未设置arguments`);
                    break;
                }
                if (!block.arguments[arg]) {
                    console.error(`块${block.opcode}未设置参数${arg}`);
                }
            }
        }
        for (let menu in info.menus || {}) {
            const menuInfo = info.menus[menu];
            if (!(menuInfo.items instanceof Array)) {
                if (!ext[menuInfo.items]) {
                    console.error(`menu${menu}的items函数未设置`);
                    ext[menuInfo.items] = () => ({
                        text: '未设置！！！',
                        value: 'not setted',
                    });
                }
            }
        }
    } catch (e) {
        console.error(e);
    } finally {
        console.groupEnd();
    }
}
export function registerExt(ext: SimpleExt) {
    checkExt(ext);
    Scratch.extensions.register(ext);
}

export function registerExtDetail(
    ext: {
        new (runtime: VM.Runtime): SimpleExt;
    },
    info: ITempExt
) {
    (window as windowWithTemp).tempExt = Object.assign(
        {
            Extension: ext,
        },
        info
    );
}
