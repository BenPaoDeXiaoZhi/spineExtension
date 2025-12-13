type i18nKey = `spineAnimation.${string}`;
export default {
    // Metadata
    'spineAnimation.extensionName': 'spine骨骼动画',
    'spineAnimation.description': '在scratch中使用spine骨骼动画!',
    // Blocks
    'spineAnimation.loadSkeleton.text':
        '加载配置为[CONFIG]的spine骨骼并命名为[NAME]',
    'spineAnimation.loadSkeleton.configError': '请输入有效配置',

    'spineAnimation.setSkinSkeleton.text':
        '将角色[TARGET_NAME]的skin设为骨骼[SKELETON]',
    // Menu
    'spineAnimation.spriteMenu.currentTarget': '当前角色',
    // Utils
    'spineAnimation.SpineSkinReport.type': 'spine skin',
    'spineAnimation.SpineSkinReport.id': 'id为 {id}',
    'spineAnimation.SpineSkinReport.version': '版本为 {version}',
    'spineAnimation.SpineSkinReport.nameText': '名称为 {name}',
    'spineAnimation.SpineSkinReport.monitor':
        '(spine皮肤) id为{id}, 版本为{version}, 名称为{name}',
} as const satisfies {
    [K in i18nKey]: string;
};
