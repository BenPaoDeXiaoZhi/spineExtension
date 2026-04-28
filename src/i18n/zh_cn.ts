/**
 * translate使用了一个新的namespace,与整体隔离,所以就不要前缀了,还能方便补全
 */
export default {
    // Metadata
    extensionName: 'spine骨骼动画',
    description: '在scratch中使用spine骨骼动画!',
    // Blocks
    initialize: '初始化',

    'upload.text': '上传Spine文件',

    'createSpineConfig.text':
        '创建spine配置,骨骼文件url为[SKEL_URL],图集文件url为[ATLAS_URL],版本为[VERSION]',

    'refreshMenu.text': '刷新Spine文件菜单',
    refreshing: '(刷新中)',

    'loadSkeleton.text': '加载配置为[CONFIG]的spine骨骼并命名为[NAME]',
    'loadSkeleton.configError': '请输入有效配置',

    'setSkinSkeleton.text': '将角色[TARGET_NAME]的skin设为Skin[SKELETON]',
    'setSkinSkeleton.skeletonIdError': '请输入数字或有效的skeleton数据',
    'setSkinSkeleton.characterNotFound': '找不到名为{name}的角色',

    data: '数据',
    'setRelativePos.text': '设置skin[SKIN]的骨架偏移为[POS]',

    'getSthOf.text': '获取[DATA]的',

    'getSthMenu.none': '无可获取项目',
    'getSthMenu.needUpdate': '待补充',
    'getSthMenu.skin.name': '皮肤的名称',
    'getSthMenu.skin.skeleton': '皮肤中的骨架',
    'getSthMenu.skin.x': '皮肤的骨架x偏移',
    'getSthMenu.skin.y': '皮肤的骨架y偏移',
    'getSthMenu.skin.animationState': '皮肤的animationState',
    'getSthMenu.skeleton.bones': '骨架的全部骨骼',
    'getSthMenu.skeleton.animations': '骨架的全部动画',
    'getSthMenu.skeleton.bone': '骨架的骨骼',
    'getSthMenu.skeleton.bone.ID_prefix': ',名为',
    'getSthMenu.skeleton.bounds': '骨架的AABB边界盒',
    'getSthMenu.bone.pos': '骨骼世界坐标',
    'getSthMenu.animationState.playing': 'animationState中的动画名',
    'getSthMenu.animationState.loop': 'animationState中的动画是否循环',
    'getSthMenu.animationState.TRACK_prefix': '在Track',

    'setBonePos.text': '设置骨骼[BONE]的世界坐标为[POS]',
    'setBonePos.tip': '[~,0]表示x坐标不变,y坐标改为0',

    animation: '动画',
    'addAnimation.text':
        '向AnimationState[STATE]的track[TRACK][ACTION]名为[NAME]的动画并[LOOP]循环',

    'addEmptyAnimation.text':
        '在AnimationState[STATE]的track[TRACK]上[ACTION]空动画,混合时间[MIX]秒',

    'addAnimation.invalidTrack': '无效的track',
    // Menu
    'spriteMenu.currentTarget': '当前角色',

    'animation_action_menu.add': '队列添加',
    'animation_action_menu.set': '立即播放',

    'animationCompleted.text':
        'AnimationState[STATE]的Track[TRACK]已完成一次播放',

    'BOOLEAN.true': '进行',
    'BOOLEAN.false': '不',
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

    'SpineAnimationStateReport.trackPlaying':
        'Track {id} {loop,select,true{正在循环} other{{complete,select,true{已完成} other{正在}}播放}}动画',
    'SpineBoneReport.type': '{name}的Spine骨骼',
    'SpineBoneReport.nameText': '骨骼名称为 ',
    'SpineBoneReport.monitor': '({name}的Spine骨骼), 名称为{boneName}',
    typeError: '🚫类型错误🚫',
    enable: '启用',
    disable: '禁用',
    debugRender: '{action} 调试渲染',
} as const;
