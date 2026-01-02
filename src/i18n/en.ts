import type zh_cn from './zh_cn';
export default {
    // Metadata
    extensionName: 'Spine Animation',
    description: 'Use Spine animation in Scratch!',
    // Blocks
    'loadSkeleton.text':
        'Load the spine skeleton with configuration [CONFIG] and name it [NAME]',
    'loadSkeleton.configError': 'Please input correct configs',

    'setSkinSkeleton.text':
        'Set the skin of character [TARGET_NAME] to Skeleton:[SKELETON]',
    'setSkinSkeleton.skeletonIdError': 'Please input valid Skeleton data!',
    'setSkinSkeleton.characterNotFound': 'Cannot find character named {name}',

    'setRelativePos.text': "Set Skin [SKIN] 's relative pos to [POS]",

    'getSkeletonInSkin.text': 'Get the skeleton in Skin [SKIN]',// Deprected
    'getSkeletonInSkin.skinError': 'Please input valid Spine skin',

    'getSthOf.text': "Get [DATA]'s ",
    'getSthMenu.skin.name': 'Name of Skin',
    'getSthMenu.skin.skeleton': 'Skeleton in Skin',
    'getSthMenu.skin.x': 'relative x pos of Skin',
    'getSthMenu.skin.y': 'relative y pos of Skin',
    'getSthMenu.skeleton.bones': 'all names of bones in Skeleton',
    'getSthMenu.skeleton.animations': 'all names of animations in Skeleton',
    // Menu
    'spriteMenu.currentTarget': 'Current target',
    // Utils
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
} as const satisfies {
    [K in keyof typeof zh_cn]: string;
};
