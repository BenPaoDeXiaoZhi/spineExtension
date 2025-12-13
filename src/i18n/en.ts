import type zh_cn from './zh_cn';
export default {
    // Metadata
    'spineAnimation.extensionName': 'spine animation',
    'spineAnimation.description': 'Use Spine animation in Scratch!',
    // Blocks
    'spineAnimation.setSkinSkeleton.text':
        'Set the skin of character [TARGET_NAME] to Skeleton:[SKELETON]',

    'spineAnimation.loadSkeleton.text':
        'Load the spine skeleton with configuration [CONFIG] and name it [NAME]',
    'spineAnimation.loadSkeleton.configError': 'please input correct configs',
    // Menu
    'spineAnimation.spriteMenu.currentTarget': 'Current target',
    // Utils
    'spineAnimation.SpineSkinReport.type': 'Spine Skin',
    'spineAnimation.SpineSkinReport.id': 'Id is {id}',
    'spineAnimation.SpineSkinReport.version': 'Version is {version}',
    'spineAnimation.SpineSkinReport.nameText': 'Name is {name}',
    'spineAnimation.SpineSkinReport.monitor':
        '(Spine Skin) Id is {id}, Version is {version}, Name is {name}',
    'spineAnimation.SpineSkeletonReport.type': 'Spine Skeleton',
} satisfies {
    [K in keyof typeof zh_cn]: string;
};
