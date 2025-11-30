/* deploy by dev
 - Deploy time: 2025/11/30 13:50:23
*/
(() => {
  // src/scratch/register.ts
  function registerExt(ext2) {
    if (!ext2 || !ext2.getInfo) {
      throw new Error("ext.getInfo is not defined");
    }
    const info = ext2.getInfo();
    console.group(`register extension ${info.id}`);
    try {
      for (let block of info.blocks) {
        if (!block.opcode && !block.func) {
          console.error("opcode未定义");
          continue;
        }
        if (!ext2[block.opcode] && !block.func) {
          console.error(`未设置的opcode function:`, block);
          ext2[block.opcode] = () => {
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
          if (!ext2[menuInfo.items]) {
            console.error(`menu${menu}的items函数未设置`);
            ext2[menuInfo.items] = () => ({
              text: "未设置！！！",
              value: "not setted"
            });
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      console.groupEnd();
    }
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
  function getTranslate(runtime2) {
    const fmt = runtime2.getFormatMessage({ "zh-cn": zh_cn_default, en: en_default });
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
  };

  // src/util/storage/style.asset.css
  var style_asset_default = '.bg::before {\r\n    background-color: #0000004c;\r\n    display: flex;\r\n    width: 100%;\r\n    height: 100%;\r\n    position: absolute;\r\n    left: 0;\r\n    top: 0;\r\n    z-index: 540;\r\n    content: "";\r\n}\r\n.bg{\r\n    display: flex;\r\n    justify-content: center;\r\n}';

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
      if (!customElements.get("scratch-storage-ui")) {
        customElements.define("scratch-storage-ui", Container);
      }
    }
  };
  var Container = class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      const shadow = this.attachShadow({ mode: "open" });
      const style = document.createElement("style");
      style.innerHTML = style_asset_default;
      const container = document.createElement("div");
      container.className = "bg";
      container.innerText = "hello";
      shadow.appendChild(container);
      shadow.appendChild(style);
    }
  };

  // src/spineSkin.ts
  var Skin = Scratch.runtime.renderer.exports.Skin;
  var SpineSkin = class extends Skin {
    _renderer;
    gl;
    _size;
    constructor(id, renderer) {
      super(id);
      this._renderer = renderer;
      this.gl = renderer.gl;
      const tmp = document.createElement("canvas");
      console.log(tmp);
      const ctx = tmp.getContext("2d");
      ctx.fillRect(0, 0, 100, 100);
      const texture = this.gl.createTexture();
      this.size = [100, 100];
      this._texture = texture;
      this._setTexture(ctx.getImageData(0, 0, 200, 200));
    }
    set size(size) {
      this._size = size;
    }
    get size() {
      return this._size;
    }
    getTexture(scale) {
      return this._texture || super.getTexture(scale);
    }
  };

  // src/index.ts
  var { BlockType, ArgumentType, runtime } = Scratch;
  var ext = class extends SimpleExt {
    translate;
    runtime;
    renderer;
    constructor(runtime2) {
      console.log(runtime2);
      super("spineAnimation", "foo");
      this.runtime = runtime2;
      console.log(this);
      this.translate = getTranslate(runtime2);
      this.renderer = runtime2.renderer;
      this.info.name = this.translate("spineAnimation.extensionName");
      this.info.blocks = [
        {
          opcode: this.setSkinId.name,
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
        },
        {
          opcode: this.loadSkeleton.name,
          text: this.translate("spineAnimation.loadSkeleton.text"),
          blockType: BlockType.COMMAND,
          arguments: {
            ID: {
              type: ArgumentType.STRING,
              menu: "skeleton_menu"
            }
          }
        },
        {
          func: this.initUI.name,
          blockType: BlockType.BUTTON,
          text: "abcd"
        }
      ];
      this.info.menus = {
        sprite_menu: {
          items: this.spriteMenu.name,
          acceptReporters: true
        },
        skeleton_menu: {
          items: this.skeletonMenu.name,
          acceptReporters: true
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
      this.info.blocks[0].opcode;
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
  registerExt(new ext(runtime));
})();
