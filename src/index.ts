import { registerExt } from "./scratch/register";
import { getTranslate, Id } from "./l18n/translate";
import SimpleExt, { Items } from "./scratch/simpleExt";
import type { MenuItems } from "./scratch/simpleExt";
const { BlockType, ArgumentType } = Scratch;
import type VM from "scratch-vm";
type Utility = VM.BlockUtility;

class ext extends SimpleExt {
    translate: (id: Id, args?: object) => string;
    runtime: VM.Runtime;
    constructor(runtime: VM.Runtime) {
        super("spineAnimation", "foo");
        this.runtime = runtime;
        console.log(runtime);
        this.translate = getTranslate(runtime);
        this.prepareInfo();
    }
    prepareInfo() {
        this.info.name = this.translate("spineAnimation.extensionName");
        this.buildBlock(
            "setSkinId",
            this.translate("spineAnimation.setSkinId.text"),
            BlockType.COMMAND,
            {
                arguments: {
                    TARGET_NAME: {
                        type: ArgumentType.STRING,
                        menu: "sprite_menu",
                    },
                    SKIN_ID: {
                        type: ArgumentType.NUMBER,
                        default: "0",
                    },
                },
            }
        );
        this.buildBlock(
            "loadSkeleton",
            this.translate("spineAnimation.loadSkeleton.text"),
            BlockType.COMMAND,
            {
                arguments: {
                    ID: {
                        type: ArgumentType.STRING,
                        menu: "skeleton_menu",
                    },
                },
            }
        );
        this.buildMenu("sprite_menu", true, "spriteMenu");
        this.buildMenu("skeleton_menu", true, "skeletonMenu");
        console.log(this.info);
    }
    spriteMenu(): MenuItems {
        const items = new Items([
            {
                text: this.translate("spineAnimation.spriteMenu.currentTarget"),
                value: "__this__",
            },
        ]);
        for (const target of this.runtime.targets) {
            const target_name = target.sprite.name;
            const target_value = target.sprite.name;
            if (target.isSprite()) {
                if (target.id !== this.runtime.getEditingTarget()?.id) {
                    items.addItem(target_name, target_value);
                }
            }
        }
        return items;
    }
    setSkinId({ TARGET_NAME, SKIN_ID }, util: Utility) {
        let target: VM.RenderedTarget;
        if (TARGET_NAME === "__this__") {
            target = util.target;
        } else {
            target = this.runtime.targets.find(
                (t) => t.isSprite() && t.getName() === TARGET_NAME
            );
            if (!target) {
                console.warn(`找不到名为${TARGET_NAME}的角色`);
            }
        }
        const drawableId = target.drawableID;
        const drawable = this.runtime.renderer._allDrawables[drawableId];
        const skin = this.runtime.renderer._allSkins[SKIN_ID];
        if (skin) {
            drawable.skin = skin;
        }
    }
}
registerExt(new ext(Scratch.runtime));
