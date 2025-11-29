/* deploy by Github CI/CD
 - Deploy time: 2025/11/29 17:05:02
 - Commit id: undefined
 - Repository: undefined
 - Actor: undefined*/
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
      for (let arg of block.text.match(/(?<=\[).+?(?=\])/g) || []) {
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
    buildBlock(op, text, blockType, other = {}) {
      let opcode;
      if (op instanceof Function) {
        opcode = op.name;
      } else {
        opcode = op;
      }
      const block = {
        opcode,
        text,
        blockType
      };
      Object.assign(block, other);
      this.info.blocks.push(block);
    }
    buildButton(op, text) {
      let opcode;
      if (op instanceof Function) {
        opcode = op.name;
      } else {
        opcode = op;
      }
      this.info.blocks.push({
        opcode,
        text,
        blockType: Scratch.BlockType.BUTTON,
        func: opcode
      });
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

  // src/util/storage/index.ts
  var scratchStroageUI = class {
    storage;
    extId;
    constructor(storage, extId = "test") {
      this.storage = storage;
      this.extId = extId;
    }
    async loadFile(assetId) {
      return fetch(`https://m.ccw.site/user_projects_assets/${assetId}`);
    }
    async storeFile(contentType = "text/plain", fileName, extName = "", data) {
      let fileData;
      if (data instanceof String) {
        const enc = new TextEncoder();
        fileData = enc.encode(data).buffer;
      } else if (data instanceof Blob) {
        fileData = await data.arrayBuffer();
      } else if (data instanceof Uint8Array) {
        fileData = data.buffer;
      } else if (data instanceof ArrayBuffer) {
        fileData = data;
      } else {
        throw new Error(`cannot convert ${data} to array buffer`);
      }
      return this.storage.store(
        { contentType },
        extName,
        fileData,
        fileName
      );
    }
    createUI() {
    }
  };

  // src/index.ts
  var { BlockType, ArgumentType } = Scratch;
  var Skin = Scratch.runtime.renderer.exports.Skin;
  var SpineSkin = class extends Skin {
    _renderer;
    gl;
    constructor(id, renderer) {
      super(id);
      this._renderer = renderer;
      this._texture = renderer.gl.createTexture();
      this.gl = renderer.gl;
      const tmp = document.createElement("canvas");
      const ctx = tmp.getContext("2d");
      ctx.rect(100, 100, 100, 100);
      const texture = this.gl.createTexture();
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
      this.gl.texParameteri(
        this.gl.TEXTURE_2D,
        this.gl.TEXTURE_WRAP_S,
        this.gl.CLAMP_TO_EDGE
      );
      this.gl.texParameteri(
        this.gl.TEXTURE_2D,
        this.gl.TEXTURE_WRAP_T,
        this.gl.CLAMP_TO_EDGE
      );
      this.gl.texParameteri(
        this.gl.TEXTURE_2D,
        this.gl.TEXTURE_MIN_FILTER,
        this.gl.NEAREST
      );
      this.gl.texParameteri(
        this.gl.TEXTURE_2D,
        this.gl.TEXTURE_MAG_FILTER,
        this.gl.NEAREST
      );
      this.gl.texImage2D(
        this.gl.TEXTURE_2D,
        0,
        this.gl.RGBA,
        this.gl.RGBA,
        this.gl.UNSIGNED_BYTE,
        ctx.getImageData(0, 0, 300, 300)
      );
      this._texture = texture;
    }
  };
  var ext = class extends simpleExt_default {
    translate;
    runtime;
    renderer;
    constructor(runtime) {
      super("spineAnimation", "foo");
      this.runtime = runtime;
      console.log(runtime);
      this.translate = getTranslate(runtime);
      this.renderer = runtime.renderer;
      this.prepareInfo();
    }
    prepareInfo() {
      this.info.name = this.translate("spineAnimation.extensionName");
      this.buildBlock(
        this.setSkinId,
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
        this.loadSkeleton,
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
      this.buildButton(this.initUI, "abcd");
      this.buildMenu("sprite_menu", true, this.spriteMenu);
      this.buildMenu("skeleton_menu", true, this.skeletonMenu);
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
        if (target.isSprite()) {
          if (target.id !== ((_a = this.runtime.getEditingTarget()) == null ? void 0 : _a.id)) {
            items.push({
              text: target.sprite.name,
              value: target.sprite.name
            });
          }
        }
      }
      return items;
    }
    skeletonMenu() {
      return [{ text: "test", value: "spine/Hina_home.skel" }];
    }
    setSkinId(arg, util) {
      const { TARGET_NAME, SKIN_ID } = arg;
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
    loadSkeleton(arg) {
      const { ID } = arg;
      const skinId = this.renderer._nextSkinId;
      const newSkin = this.renderer._allSkins[skinId] = new SpineSkin(
        skinId,
        this.renderer
      );
      console.log(newSkin);
      return skinId;
    }
    initUI() {
      const s = new scratchStroageUI(this.runtime.storage, "spineAnimation");
      s.createUI();
      console.log(s);
    }
  };
  registerExt(new ext(Scratch.runtime));
})();
