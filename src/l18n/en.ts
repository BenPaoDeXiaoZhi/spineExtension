import zh_cn from './zh_cn';
export default {
    'spineAnimation.extensionName': 'spine animation',
    'spineAnimation.showRuntime.text':
        'Print scratch runtime and assign to window._runtime',
    'spineAnimation.pass.text': 'Run reporter[A] and ignore the return value',
    'spineAnimation.setSkinId.text':
        'Set the skin of character [TARGET_NAME] to the skin with ID [SKIN_ID]',
    'spineAnimation.spriteMenu.currentTarget': 'Current target',
    'spineAnimation.loadSkeleton.text': 'Load the spine skeleton with configuration [CONFIG] and name it [NAME]',
    'spineAnimation.loadSkeleton.configError': 'please input correct configs',
} satisfies {
    [K in keyof typeof zh_cn]: (typeof zh_cn)[K];
};
