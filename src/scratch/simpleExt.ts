class SimpleExt implements extInstance{
    info:extInfo
    constructor(id:string,name:string){
        this.info={id,name,blocks:[]}
    }
    getInfo(): extInfo {
        return this.info
    }
    buildBlock(opcode:string,text:string,blockType:BlockTypeValues,other){
        const block:BlockInfo={
            opcode,
            text,
            blockType
        }
        Object.assign(block,other)
        this.info.blocks.push(block)
    }
}
export default SimpleExt