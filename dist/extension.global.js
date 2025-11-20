(() => {
  // src/scratch/register.ts
  function registerExt(ext2) {
    if (!ext2 || !ext2.getInfo) {
      throw new Error("ext.getInfo is not defined");
    }
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
        if (!ext2[menuInfo.items]) {
          error(`menu${menu}的items函数未设置`);
          ext2[menuInfo.items] = () => ({
            text: "未设置！！！",
            value: "not setted"
          });
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
    "spineAnimation.spriteMenu.currentTarget": "当前角色",
    "spineAnimation.loadSkeleton.text": "加载id为[ID]的spine骨骼"
  };

  // src/l18n/en.ts
  var en_default = {
    "spineAnimation.extensionName": "spine animation",
    "spineAnimation.showRuntime.text": "Print scratch runtime and assign to window._runtime",
    "spineAnimation.pass.text": "Run reporter[A] and ignore the return value",
    "spineAnimation.setSkinId.text": "Set the skin of character [TARGET_NAME] to the skin with ID [SKIN_ID]",
    "spineAnimation.spriteMenu.currentTarget": "Current target",
    "spineAnimation.loadSkeleton.text": "load spine skeleton with id:[ID]"
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

  // src/scratch/simpleExt.ts
  var SimpleExt = class {
    info;
    constructor(id, name) {
      this.info = { id, name, blocks: [], menus: {} };
    }
    getInfo() {
      return this.info;
    }
    buildBlock(opcode, text, blockType, other) {
      const block = {
        opcode,
        text,
        blockType
      };
      Object.assign(block, other);
      this.info.blocks.push(block);
    }
    buildMenu(name, acceptReporters, items) {
      if (items instanceof Function) {
        const menu_name = items.name || `menu_${name}`;
        this[menu_name] ??= items;
        this.info.menus[name] = {
          acceptReporters,
          items: menu_name
        };
      } else {
        this.info.menus[name] = {
          acceptReporters,
          items
        };
      }
    }
  };
  var simpleExt_default = SimpleExt;

  // src/index.ts
  var { BlockType, ArgumentType } = Scratch;
  var ext = class extends simpleExt_default {
    translate;
    runtime;
    constructor(runtime) {
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
              menu: "sprite_menu"
            },
            SKIN_ID: {
              type: ArgumentType.NUMBER,
              default: "0"
            }
          }
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
              menu: "skeleton_menu"
            }
          }
        }
      );
      this.buildMenu("sprite_menu", true, this.spriteMenu);
      this.buildMenu("skeleton_menu", true, "skeletonMenu");
      console.log(this.info);
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
        const target_name = target.sprite.name;
        const target_value = target.sprite.name;
        if (target.isSprite()) {
          if (target.id !== ((_a = this.runtime.getEditingTarget()) == null ? void 0 : _a.id)) {
            items.push({ text: target_name, value: target_value });
          }
        }
      }
      return items;
    }
    skeletonMenu() {
      return [{ text: "b", value: "bcdf" }];
    }
    setSkinId({ TARGET_NAME, SKIN_ID }, util) {
      let target;
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
  };
  registerExt(new ext(Scratch.runtime));
})();
