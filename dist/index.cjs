// src/scratch/register.ts
function registerExt(ext2) {
  var _a;
  const info = ext2.getInfo();
  console.group(`register extension ${info.id}`);
  function error(dat) {
    console.error(`register extension ${info.id}: ${dat}`);
  }
  for (let block of info.blocks) {
    if (!ext2[block.opcode]) {
      error(`未设置的opcode function:${block.opcode}`);
      ext2[block.opcode] = () => {
        console.error(`当前opcode:${block.opcode}函数未定义!`);
      };
    } else {
    }
    for (let arg of block.text.match(/(?<=\[).+?(?=\])/g)) {
      if (!((_a = block.arguments) == null ? void 0 : _a[arg])) {
        error(`块${block.opcode}未设置参数${arg}`);
      }
    }
  }
  console.groupEnd();
  Scratch.extensions.register(ext2);
}

// src/l18n/zh_cn.ts
var zh_cn_default = {
  "spineAnimation.extensionName": "spine骨骼动画",
  "spineAnimation.showRuntime.text": "console输出runtime信息并保存至window._runtime",
  "spineAnimation.pass.text": "直接执行reporter[A]",
  "spineAnimation.setSkinId.text": "将角色[TARGET_NAME]的skin设为ID为[SKIN_ID]的skin",
  "spineAnimation.spriteMenu.currentTarget": "当前角色"
};

// src/l18n/en.ts
var en_default = {
  "spineAnimation.extensionName": "spine animation",
  "spineAnimation.showRuntime.text": "Print scratch runtime and assign to window._runtime",
  "spineAnimation.pass.text": "Run reporter[A] and ignore the return value",
  "spineAnimation.setSkinId.text": "Set the skin of character [TARGET_NAME] to the skin with ID [SKIN_ID]",
  "spineAnimation.spriteMenu.currentTarget": "Current target"
};

// src/l18n/translate.ts
function getTranslate(runtime) {
  const fmt = runtime.getFormatMessage({ "zh-cn": zh_cn_default, en: en_default });
  return function(id, args) {
    return fmt({
      default: id
    }, args);
  };
}

// src/index.ts
var { BlockType, ArgumentType } = Scratch;
var ext = class {
  translate;
  runtime;
  constructor(runtime) {
    this.runtime = runtime;
    console.log(runtime);
    this.translate = getTranslate(runtime);
  }
  getInfo() {
    return {
      id: "spineAnimation",
      name: this.translate("spineAnimation.extensionName"),
      blocks: [
        {
          opcode: "setSkinId",
          text: this.translate("spineAnimation.setSkinId.text"),
          blockType: BlockType.COMMAND,
          arguments: {
            TARGET_NAME: {
              type: ArgumentType.STRING,
              menu: "sprite_menu"
            },
            SKIN_ID: {
              type: ArgumentType.NUMBER,
              default: "0"
            }
          }
        }
      ],
      menus: {
        sprite_menu: {
          acceptReporters: true,
          items: "spriteMenu"
        }
      }
    };
  }
  spriteMenu() {
    var _a;
    const items = [
      {
        text: this.translate("spineAnimation.spriteMenu.currentTarget"),
        value: "__this__"
      }
    ];
    for (const target of this.runtime.targets) {
      var target_name = target.sprite.name;
      var target_value = target.sprite.name;
      if (target.isSprite()) {
        if (target.id !== ((_a = this.runtime.getEditingTarget()) == null ? void 0 : _a.id)) {
          items.push({ text: target_name, value: target_value });
        }
      }
    }
    return items;
  }
  setSkinId({ TARGET_NAME, SKIN_ID }, util) {
    let target;
    if (TARGET_NAME === "__this__") {
      target = util.target;
    } else {
      console.warn("未实现");
    }
    const drawableId = target.drawableID;
    const drawable = this.runtime.renderer._allDrawables[drawableId];
    const skin = this.runtime.renderer._allSkins[SKIN_ID];
    if (skin) {
      drawable.skin = skin;
    }
  }
};
registerExt(new ext(Scratch.runtime));
