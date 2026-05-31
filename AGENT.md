# Spine Extension For Gandi

## 项目简介

为 **Gandi** 编辑器（类 Scratch 的可视化编程平台）量身定做的 Spine 运行时扩展，支持在编辑器中加载、渲染和操作 Spine 2D 骨骼动画。

- **语言**: TypeScript
- **构建工具**: tsup (esbuild) → IIFE 格式输出
- **运行时**: 浏览器端扩展，注入 Gandi/Scratch 环境
- **Spine 版本**: 3.8 / 4.0 / 4.2（通过 `npm:@esotericsoftware/spine-webgl` 引入）
- **CI/CD**: GitHub Actions，自动构建并部署至 GitHub Pages 与 ccw 平台
- **类型声明**: `typeRoots` 指向 `./types`，全局 `Scratch` 对象在 `types/global.d.ts` 中定义

## 目录结构

```
src/
├── index.ts             # 扩展主入口，SpineExtension 类
├── logSystem.ts         # 日志系统（console / gandi logSystem）
├── spineConfig.ts       # Spine 配置模型（skel / atlas / version）
├── spineManager.ts      # Spine 资源加载与管理（AssetManager + SceneRenderer）
├── spineSkin.ts         # SpineSkin 类，继承 Scratch Renderer Skin
├── dev/                 # 开发/调试入口
├── i18n/                # 国际化
│   ├── translate.ts     # 翻译函数工厂（getTranslate）
│   ├── zh_cn.ts
│   └── en.ts
├── scratch/             # Scratch 扩展注册机制
│   ├── register.ts      # 扩展注册 + 校验
│   └── simpleExt.ts     # SimpleExt 基类 + 类型定义
├── spine/               # Spine 运行时适配层
│   ├── 3.8/spine-webgl.d.ts + .js
│   ├── 4.0/spine-webgl.ts
│   ├── 4.2/spine-webgl.ts
│   └── spineVersions.ts # 多版本类型映射
└── util/                # 工具函数
    ├── argsParse.ts     # 参数解析
    ├── customBlock.ts   # 自定义 Blockly 块注册入口
    ├── customBlockly.ts # Blockly 块自定义工具（defineProperty / connection patch）
    ├── customBlocks/
    │   └── getSth.ts    # 获取数据的动态 Blockly 块
    ├── htmlReport.ts    # HTMLReport 数据报告 + 原型清理
    ├── pos.ts           # 坐标裁剪
    ├── spineReports.ts  # Spine 各类型报告（Skin/Skeleton/Bone/AnimationState）
    └── storage.ts       # 安全资源加载 + ccw 存储接口
```

## 编写规范

### 基础约定

- **缩进**: 4 空格（`.prettierrc.json` 中 `tabWidth: 4`）
- **引号**: 单引号（`singleQuote: true`）
- **分号**: 必须（`semi: true`）
- **命名风格**: camelCase 变量/函数，PascalCase 类/类型
- **类型安全**: 使用 TypeScript 类型，`strict: false` 以便于类型推断，但尽可能为公共函数/类提供完整类型标注
- **模块导入**: 使用 ES Module 语法，禁用 `require`
- **全局对象**: 通过 `types/global.d.ts` 声明的 `Scratch` 全局变量访问运行时
- **日志**: 通过 `logSystem.ts` 的 `getLogger()` 获取 Logger 实例，避免直接 `console.log`

### AI 生成代码的 JSDoc 规范

AI 工具辅助生成的函数及方法，必须在 JSDoc 注释中标记来源信息。格式如下：

```typescript
/**
 * by AI: [AI名称或工具名称]
 *
 * audit: (此处需要用户填写名称)
 *
 * [功能的详细描述，可多行]
 * @param ...
 * @returns ...
 */
function funcName() { ... }
```

- 第一行固定为 `by AI:`，后跟 AI 工具的名称，如 `Claude`、`ChatGPT`、`Trae` 等
- 第二行固定为空行
- 第三行固定为 `audit:`，括号内文字作为提示，实际使用时需替换为审核人员的名称
- 第四行为空行分隔
- 之后为可省略的标准 JSDoc 注释内容（功能描述、参数说明等）
- 如果函数返回值、参数等数据不需要详细标注则可省略，在函数定义时使用类型标注即可

### 代码风格

#### 类与构造函数

- 类的公共属性在顶部集中声明类型
- 构造函数参数使用显式类型标注
- 不需要为每个属性写 JSDoc，类名上方可写简短的说明

```typescript
export class SpineConfig implements RawSpineConfig {
    private _skel: string;
    private _atlas: string;
    version: VersionNames;

    constructor(config: {
        skel: string;
        atlas: string;
        version: VersionNames;
    }) {
        // ...
    }
}
```

#### 函数与导出

- 优先使用 export 命名导出，避免 default export（i18n 的字典对象除外）
- 工具函数采用纯函数风格，避免副作用
- `export function` / `export const` / `export class` 按需使用

#### 异常处理

- 使用 try-catch 捕获可预见的运行时错误
- 通过 Logger 实例记录错误信息（`logger.error` / `logger.warn`）
- 关键路径上的参数校验使用 `instanceof` / `typeof` 检查

```typescript
if (!(SKIN && SKIN instanceof SpineSkinReport)) {
    logger.error(translate('typeError'));
    return;
}
```

#### 异步与 Promise

- 优先使用 `async / await`
- 避免裸 `.then() / .catch()` 链式调用
- 并行请求使用 `Promise.all()`

#### i18n

- 所有用户可见的字符串通过 `translate()` 函数获取
- 翻译键定义在 `src/i18n/zh_cn.ts` 和 `src/i18n/en.ts` 中
- 扩展的国际化通过 `registerExtDetail()` 的 `l10n` 字段传递
- 专有名词翻译
  0. 与spine相关的专有名词，除特殊标注以外，参考http://zh.esotericsoftware.com/的官方翻译
  1. bone: 骨骼
  2. skeleton: 骨架
  3. ADS: Advanced Data Structure的缩写，指高级数据结构扩展

#### 类型声明

- 复杂类型使用 `type` 或 `interface` 在模块顶层声明
- 跨模块共享的类型集中放在类型文件中（`types/` 目录）
- 模块级别的联合类型/枚举常量使用 `as const` 断言保真

#### 导入资源

- 图片（`.png`）：通过 `dataurl` loader 转为 base64，类型声明返回 `string`
- SVG / HTML 模板（`.svg` / `.asset.html`）：通过 `text` loader 转为字符串
- 导入路径使用相对路径

## 构建与运行

```bash
npm install           # 安装依赖
npm run build         # 构建：tsc 类型检查 + tsup 打包
npm run dev           # 开发模式：tsup --watch，启动 WebSocket 热更新
npm run pwi           # 安装 Playwright 浏览器（用于自动化部署）
```

构建产物输出到 `dist/` 目录：

- `dist/extension.global.js` — 扩展主文件
- `dist/index.global.js` — 开发调试入口
- `dist/report.global.js` — 报告调试入口
