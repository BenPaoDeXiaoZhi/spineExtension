import { registerExt } from "./scratch/register"
import { getTranslate, Id } from "./l18n/translate"
import SimpleExt from "./scratch/simpleExt"
const { BlockType, ArgumentType } = Scratch

class ext extends SimpleExt{
    translate: (id: Id, args?: object) => string
    runtime:any
    constructor(runtime: any) {
        super("spineAnimation","foo")
        this.runtime = runtime
        console.log(runtime)
        this.translate = getTranslate(runtime)
        this.info.name=this.translate("spineAnimation.extensionName")
        console.log(this.info)
    }
    getInfo(): extInfo {
        return {
            id: 'spineAnimation',
            name: this.translate("spineAnimation.extensionName"),
            blocks: [
                {
                    opcode: "setSkinId",
                    text: this.translate('spineAnimation.setSkinId.text'),
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TARGET_NAME: {
                            type: ArgumentType.STRING,
                            menu: 'sprite_menu'
                        },
                        SKIN_ID: {
                            type: ArgumentType.NUMBER,
                            default:"0"
                        }
                    }
                }
            ],
            menus: {
                sprite_menu: {
                    acceptReporters: true,
                    items: 'spriteMenu'
                }
            }
        }
    }
    spriteMenu(): MenuItems {
        const items:MenuItems = [
            {
                text: this.translate('spineAnimation.spriteMenu.currentTarget'),
                value: '__this__'
            }]
        for(const target of this.runtime.targets){
                var target_name = target.sprite.name;
                var target_value = target.sprite.name;
                if (target.isSprite()){
                    if (target.id !== this.runtime.getEditingTarget()?.id){
                        items.push({text:target_name, value: target_value})
                    }
                }
            }
        return items
    }
    setSkinId({TARGET_NAME,SKIN_ID},util){
        let target;
        if(TARGET_NAME === '__this__'){
            target = util.target
        }else{
            console.warn('未实现')
        }
        const drawableId = target.drawableID
        const drawable = this.runtime.renderer._allDrawables[drawableId]
        const skin = this.runtime.renderer._allSkins[SKIN_ID]
        if(skin){
            drawable.skin = skin
        }
    }
}
registerExt(new ext(Scratch.runtime))