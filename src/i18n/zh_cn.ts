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

    'setSkinSkeleton.text': '将角色[TARGET_NAME]的skin设为骨架[SKELETON]',
    'setSkinSkeleton.skeletonIdError': '请输入数字或有效的skeleton数据',
    'setSkinSkeleton.characterNotFound': '找不到名为{name}的角色',

    'setRelativePos.text': '设置skin[SKIN]的骨架偏移为[POS]',

    'getSthOf.text': '获取[DATA]的',
    typeError: '🚫类型错误🚫',

    'getSthMenu.none': '无可获取项目',
    'getSthMenu.needUpdate': '待补充',
    'getSthMenu.skin.name': '皮肤的名称',
    'getSthMenu.skin.skeleton': '皮肤中的骨架',
    'getSthMenu.skin.x': '皮肤的骨架x偏移',
    'getSthMenu.skin.y': '皮肤的骨架y偏移',
    'getSthMenu.skin.animationState': '皮肤的animationState',
    'getSthMenu.skeleton.bones': '骨架的全部骨骼',
    'getSthMenu.skeleton.animations': '骨架的全部动画',
    // Menu
    'spriteMenu.currentTarget': '当前角色',
    // Utils
    'HTMLReport.monitorPrefix': '(⛔无需保存⛔)',

    'SpineSkinReport.type': 'spine skin',
    'SpineSkinReport.id': 'id为 ',
    'SpineSkinReport.version': '版本为 ',
    'SpineSkinReport.nameText': '名称为 ',
    'SpineSkinReport.monitor':
        '(spine皮肤) id为{id}, 版本为{version}, 名称为{name}',

    'SpineSkeletonReport.type': 'spine骨架',
    'SpineSkeletonReport.nameText': '名称为 ',
    'SpineSkeletonReport.boneNum': '骨骼总数为 ',
    'SpineSkeletonReport.monitor':
        '(spine骨架) 名称为{name}, 骨骼总数为{boneNum}',

    'SpineAnimationStateReport.trackPlaying': 'Track {id} 正在播放动画 ',
} as const;
