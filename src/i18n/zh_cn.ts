/**
 * translate使用了一个新的namespace,与整体隔离,所以就不要前缀了,还能方便补全
 */
export default {
    // Metadata
    extensionName: 'spine骨骼动画',
    description: '在scratch中使用spine骨骼动画!',
    // Blocks
    'loadSkeleton.text': '加载配置为[CONFIG]的spine骨骼并命名为[NAME]',
    'loadSkeleton.configError': '请输入有效配置',

    'setSkinSkeleton.text': '将角色[TARGET_NAME]的skin设为骨骼[SKELETON]',
    'setSkinSkeleton.skeletonIdError': '请输入数字或有效的skeleton数据',
    'setSkinSkeleton.characterNotFound': '找不到名为{name}的角色',

    'getSkeletonInSkin.text': '获取skin[SKIN]中的骨架',
    'getSkeletonInSkin.skinError': '请输入有效的spine skin',
    // Menu
    'spriteMenu.currentTarget': '当前角色',
    // Utils
    'SpineSkinReport.type': 'spine skin',
    'SpineSkinReport.id': 'id为 ',
    'SpineSkinReport.version': '版本为 ',
    'SpineSkinReport.nameText': '名称为 ',
    'SpineSkinReport.monitor':
        '(spine皮肤) id为{id}, 版本为{version}, 名称为{name}',

    'SpineSkeletonReport.type': 'spine骨架',
    'SpineSkeletonReport.nameText': '名称为 ',
    'SpineSkeletonReport.boneNum': '骨骼总数为 ',
} as const;
