export function registerExt(ext: extInstance) {
    const info = ext.getInfo()
    console.group(`register extension ${info.id}`)
    function error(dat: string) {
        console.error(`register extension ${info.id}: ${dat}`)
    }
    for (let block of info.blocks) {
        if (!ext[block.opcode]) {
            error(`未设置的opcode function:${block.opcode}`)
            ext[block.opcode] = () => { console.error(`当前opcode:${block.opcode}函数未定义!`) }
        } else {
        }
        for (let arg of block.text.match(/(?<=\[).+?(?=\])/g)) {
            if (!block.arguments?.[arg]) {
                error(`块${block.opcode}未设置参数${arg}`)
            }
        }
    }
    console.groupEnd()
    Scratch.extensions.register(ext)
}