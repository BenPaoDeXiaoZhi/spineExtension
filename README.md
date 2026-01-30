# ✨Spine Extension For Gandi✨  
![rate][rate]

 - 🟢为**Gandi**编辑器量身定做的Spine运行时扩展  
 - ☑️类型安全，功能可扩展

### ✨亮点
***
1. 特殊的数据存储方式  
   通过[HTMLReport](src/util/htmlReport.ts)存储数据，更便于观察！ 
2. 扩展Gandi原版的Spine实现  
   修改Gandi的部分官方功能，渲染更加快捷  

### 🕑开发进展
***

#### ⚡︎底层utils
 - [x] spineSkin
 - [x] spineManager
 - [x] htmlReport
 - [x] spineSkinReport
 - [x] spineSkeletonReport
 - [x] spineBoneReport
 - [x] animationStateReport

#### 🗯️扩展功能
 - [x] 加载骨架文件
 - [ ] mock骨架文件（允许用户不上传文件）
 - [x] 显示骨架skin
 - [x] 根据drawable状态调整骨架**坐标**变换
 - [x] 根据drawable状态调整骨家**缩放**变换
 - [x] 根据drawable状态调整骨架**旋转**变换
 - [x] relative pos
 - [x] 从skin中获取骨架数据
 - [x] 修改、读取骨骼数据
 - [x] 应用动画

#### 💬扩展信息
 - [x] 大图标 by [乌龙茶速递@ccw][1]
 - [x] 小图标
 - [x] 配色方案 by [乌龙茶速递@ccw][1]
 - [x] 扩展介绍的i18n

#### ♥️鸣谢
 - EsotericSoftware的[Spine WebGl runtime](https://zh.esotericsoftware.com/git/spine-runtimes/tree/spine-ts)

 - UI设计、测试、配色方案、部分i18n、用户体验优化、部分异常的修复：[乌龙茶速递@ccw ![乌龙茶速递][2]][1]

 - 项目灵感，renderer部分的原版支持：HCN

### 😏杂谈（Q&A）
 - **为什么要对高级数据结构专门patch?**
   **Arkos**大佬的高级数据结构中读取数据的功能有一些问题，  
   造成对象**原型**被修改，虽然有助于防止原型链污染，但会造成**数据处理错误**，有时甚至导致**编辑器崩溃**，  
   读取到危险**function**，  
   因此我通过套proxy等方法进行了patch。
   
 - **关于特殊的块：**
   为了更加便于编辑的功能~~炫技~~，我通过设置getter setter的方式patch了blockly，并实现了很多有趣的功能，
   具体可见[customBlocks](src/util/customBlocks)。

[rate]: https://img.shields.io/badge/dynamic/json?url=https://bfs-web.ccw.site/extensions/spineAnimation&query=$.body.stats.averageRating&label=%E2%AD%90%EF%B8%8F%E6%89%A9%E5%B1%95%E8%AF%84%E5%88%86
[1]: https://www.ccw.site/student/68dd004586bbc77f84e309ac
[2]: https://m.ccw.site/user_projects_assets/dc5394d2-c5c5-4d69-b924-effaae5c4543.png