# ✨Spine Extension For Gandi✨  
### 为**Gandi**编辑器量身定做的Spine运行时扩展  
### 类型安全，功能可扩展
***
### 亮点
1. 特殊的数据存储方式
  - 通过[HTMLReport](src/utils/HTMLReport.ts)存储骨骼数据，更便于观察！
2. 扩展Gandi原版的Spine实现
  - 修改Gandi的部分原版功能，使渲染过程更加快捷
### 开发进展
##### 底层utils
- [x] spineSkin
- [x] spineManager
- [x] htmlReport
- [x] spineSkinReport
- [ ] spineSkeletonReport
- [ ] animationStateReport
##### 扩展功能
- [x] 加载骨架文件
- [ ] mock骨架文件
- [x] 显示骨架skin
- [ ] 根据drawable状态调整骨骼变换
- [x] 从skin中获取骨架数据
- [ ] 修改、读取骨骼数据
- [ ] 应用动画
##### 扩展信息
- [x] 大图标 by [乌龙茶速递@ccw](https://www.ccw.site/student/68dd004586bbc77f84e309ac)
- [x] 小图标
- [x] 配色方案 by [乌龙茶速递@ccw](https://www.ccw.site/student/68dd004586bbc77f84e309ac)
- [ ] i18n
## 鸣谢
EsotericSoftware的[Spine Webgl runtime](https://zh.esotericsoftware.com/git/spine-runtimes/tree/spine-ts)  
UI设计、测试、杂项、部分异常的修复：[乌龙茶速递@ccw ![乌龙茶速递](https://m.ccw.site/user_projects_assets/dc5394d2-c5c5-4d69-b924-effaae5c4543.png)](https://www.ccw.site/student/68dd004586bbc77f84e309ac)  
项目灵感，renderer部分的支持：HCN
