export function customBlock(id:string,blockly,config:any){
    Object.defineProperty(blockly.Blocks,id,{
        set(){}
        get(){return config}
    })
}