import type zh_cn from './zh_cn';
export default {
    // Metadata
    extensionName: 'spine animation',
    description: 'Use Spine animation in Scratch!',
    // Blocks
    'loadSkeleton.text':
        'Load the spine skeleton with configuration [CONFIG] and name it [NAME]',
    'loadSkeleton.configError': 'please input correct configs',

    'setSkinSkeleton.text':
        'Set the skin of character [TARGET_NAME] to Skeleton:[SKELETON]',
    // Menu
    'spriteMenu.currentTarget': 'Current target',
    // Utils
    'SpineSkinReport.type': 'Spine Skin',
    'SpineSkinReport.id': 'Id is {id}',
    'SpineSkinReport.version': 'Version is {version}',
    'SpineSkinReport.nameText': 'Name is {name}',
    'SpineSkinReport.monitor':
        '(Spine Skin) Id is {id}, Version is {version}, Name is {name}',
    'SpineSkeletonReport.type': 'Spine Skeleton',
} satisfies {
    [K in keyof typeof zh_cn]: string;
};
