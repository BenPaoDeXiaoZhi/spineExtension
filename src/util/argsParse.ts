import { AnimationState } from '../spine/spineVersions';
import { SpineAnimationStateReport } from './spineReports';
import { getTranslate } from '../i18n/translate';
import { getLogger } from '../logSystem';

export function getStateAndTrack(
    STATE: SpineAnimationStateReport<AnimationState>,
    TRACK: number,
) {
    const translate = getTranslate();
    const logger = getLogger('console');
    if (!STATE || !(STATE instanceof SpineAnimationStateReport)) {
        logger.error(translate('typeError'));
        throw new Error('state invalid');
    }
    const animationState = STATE.valueOf();
    const trackId = Number(TRACK);
    if (isNaN(trackId) || trackId < 0 || !isFinite(trackId)) {
        logger.error(translate('typeError'));
        throw new Error('track invalid');
    }
    const track = animationState.tracks[trackId];
    return { animationState, track };
}
