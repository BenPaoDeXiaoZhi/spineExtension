import { extInstance } from './simpleExt';
export function registerExt(ext: extInstance) {
    if (!ext || !ext.getInfo) {
        throw new Error('ext.getInfo is not defined');
    }
    const info = ext.getInfo();
    console.group(`register extension ${info.id}`);
    function error(dat: string) {
        console.error(`register extension ${info.id}: ${dat}`);
    }
    for (let block of info.blocks) {
        if (!ext[block.opcode]) {
            error(`未设置的opcode function:${block.opcode}`);
            ext[block.opcode] = () => {
                console.error(`当前opcode:${block.opcode}函数未定义!`);
            };
        }
        for (let arg of block.text.match(/(?<=\[).+?(?=\])/g)) {
            if (!block.arguments) {
                error(`块${block.opcode}未设置arguments`);
                break;
            }
            if (!block.arguments[arg]) {
                error(`块${block.opcode}未设置参数${arg}`);
            }
        }
    }
    for (let menu in info.menus || {}) {
        const menuInfo = info.menus[menu];
        if (!(menuInfo.items instanceof Array)) {
            if (!ext[menuInfo.items]) {
                error(`menu${menu}的items函数未设置`);
                ext[menuInfo.items] = () => ({
                    text: '未设置！！！',
                    value: 'not setted',
                });
            }
        }
    }
    console.groupEnd();
    Scratch.extensions.register(ext);
}
