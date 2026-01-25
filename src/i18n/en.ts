import type zh_cn from './zh_cn';
export default {
    // Metadata
    extensionName: 'Spine Animation',
    description: 'Use Spine animation in Scratch!',
    // Blocks
    initialize: 'Initialize',
    'createSpineConfig.text':
        'Create Spine Config,Skeleton url:[SKEL_URL],Atlas url:[ATLAS_URL],Version:[VERSION]',

    'loadSkeleton.text':
        'Load the spine skeleton with configuration [CONFIG] and name it [NAME]',
    'loadSkeleton.configError': 'Please input correct configs',

    'setSkinSkeleton.text':
        'Set the skin of character [TARGET_NAME] to Skeleton:[SKELETON]',
    'setSkinSkeleton.skeletonIdError': 'Please input valid Skeleton data!',
    'setSkinSkeleton.characterNotFound': 'Cannot find character named {name}',

    data: 'Data',
    'setRelativePos.text': "Set Skin [SKIN] 's relative pos to [POS]",

    'getSthOf.text': "Get [DATA]'s ",
    'getSthMenu.none': 'NONE',
    'getSthMenu.needUpdate': 'will be updated',
    'getSthMenu.skin.name': 'Name of Skin',
    'getSthMenu.skin.skeleton': 'Skeleton in Skin',
    'getSthMenu.skin.x': 'relative x pos of Skin',
    'getSthMenu.skin.y': 'relative y pos of Skin',
    'getSthMenu.skin.animationState': 'AnimationState of Skin',
    'getSthMenu.skeleton.bones': 'all names of bones in Skeleton',
    'getSthMenu.skeleton.animations': 'all names of animations in Skeleton',
    'getSthMenu.skeleton.bone': 'Bone in Skeleton',
    'getSthMenu.skeleton.bone.ID_prefix': ', Named',
    'getSthMenu.bone.pos': 'Bone World Pos',
    'getSthMenu.animationState.playing': "Name of Animation",
     'getSthMenu.animationState.playing.TRACK_prefix': 'In track',

    'setBonePos.text': "Set Bone [BONE]'s world pos to [POS]",
    'setBonePos.tip': "[~,0] means don't change x, change y to 0",

    animation: 'Animation',
    'addAnimation.text':
        'On AnimationState [STATE], track [TRACK], [ACTION] the animation named [NAME] and [LOOP] loop',
    'addAnimation.invalidTrack': 'Invalid Track!',
    // Menu
    'spriteMenu.currentTarget': 'Current target',

    'animation_action_menu.add': 'Queue',
    'animation_action_menu.set': 'Set',

    'BOOLEAN.true': 'do',
    'BOOLEAN.false': 'do not',
    // Utils
    'HTMLReport.monitorPrefix': '(⛔No Need to Save⛔)',

    'SpineSkinReport.type': 'Spine Skin',
    'SpineSkinReport.id': 'Id is ',
    'SpineSkinReport.version': 'Version is ',
    'SpineSkinReport.nameText': 'Name is ',
    'SpineSkinReport.monitor':
        '(Spine Skin) Id is {id}, Version is {version}, Name is {name}',

    'SpineSkeletonReport.type': 'Spine Skeleton',
    'SpineSkeletonReport.nameText': 'Name is ',
    'SpineSkeletonReport.boneNum': 'Total Bone num is ',
    'SpineSkeletonReport.monitor':
        '(Spine Skeleton) Name is {name}, Total Bone num is {boneNum}',

    'SpineAnimationStateReport.trackPlaying':
        'Track {id}' +
        ' {loop, plural,' +
            ' =true {is looping}' +
            ' other {' +
                ' {complete, plural,' +
                    ' =true {has done}' +
                    ' other {is playing}' +
                '}' +
            '}' +
        '}' + 
        ' animation ',

    'SpineBoneReport.type': "{name}'s Spine Bone",
    'SpineBoneReport.nameText': 'Bone name is ',
    'SpineBoneReport.monitor': "({name}'s Spine Bone), Name is {boneName}",
    typeError: '🚫type error🚫',
    enable: 'Enable',
    disable: 'Disable',
    debugRender: '{action} Debug Render',
} as const satisfies {
    [K in keyof typeof zh_cn]: string;
};
