import {
    AnimationState,
    SceneRenderer,
    Skeleton,
    TimeKeeper,
    Color,
} from '42webgl';
import type Spine from '../spine/4.2/spine-webgl';
import spineVersions from '../spine/spineVersions';

const DEFAULT_ROOT = 'https://l2d-cn.kivotos.qzz.io/';
const NAME = prompt('skel','Airi_home');

const rootDir =
    prompt('root:', localStorage.getItem('root') || DEFAULT_ROOT) ||
    DEFAULT_ROOT;
localStorage.setItem('root', rootDir);

declare const window: {
    spine: typeof Spine;
    s: Spine.Skeleton;
    as: Spine.AnimationState;
    r: Spine.SceneRenderer;
} & Window;

const spine = spineVersions['4.2webgl'];
console.log(spine);
window.spine = spine;
alert('spine loaded');
function render(
    skeleton: Skeleton,
    tk: TimeKeeper,
    animationState: AnimationState,
    spineRenderer: SceneRenderer,
    mousePos: { x: number; y: number }
) {
    skeleton.updateWorldTransform(spine.Physics.update);
    tk.update();
    animationState.update(tk.delta);
    animationState.apply(skeleton);
    spineRenderer.begin();
    spineRenderer.drawSkeleton(skeleton);
    const { x, y, width, height } = skeleton.getBoundsRect();
    spineRenderer.rect(false, x, y, width, height, new Color(0, 1, 0, 1));
    spineRenderer.line(
        x,
        skeleton.y,
        x + width,
        skeleton.y,
        new Color(0, 0, 1, 1)
    );
    spineRenderer.line(
        skeleton.x,
        y,
        skeleton.x,
        y + height,
        new Color(0, 0, 1, 1)
    );
    spineRenderer.end();
    skeleton.x = mousePos.x;
    skeleton.y = mousePos.y;
    requestAnimationFrame(() =>
        render(skeleton, tk, animationState, spineRenderer, mousePos)
    );
}
const root = document.createElement('div');
document.body.appendChild(root);
const canvas = document.createElement('canvas');
canvas.width = 1000;
canvas.height = 1000;
canvas.style.height = '90vh';
root.appendChild(canvas);
const mousePosDisplay = document.createElement('span');
const mousePos = { x: 0, y: 0 };
root.appendChild(mousePosDisplay);
const gl = canvas.getContext('webgl2');
const renderer = new spine.SceneRenderer(canvas, gl);
window.r = renderer;
const assetMgr = new spine.AssetManager(gl, rootDir + NAME.toLowerCase() + '/');
const ATLAS = NAME + '.atlas';
const SKEL = NAME + '.skel';
assetMgr.loadTextureAtlas(ATLAS);
assetMgr.loadBinary(SKEL);
assetMgr.loadAll().then(() => {
    const atlasLoader = new spine.AtlasAttachmentLoader(assetMgr.get(ATLAS));
    const loader = new spine.SkeletonBinary(atlasLoader);
    const skelData = loader.readSkeletonData(assetMgr.get(SKEL));
    const skeleton = new spine.Skeleton(skelData);
    skeleton.scaleX = 0.3;
    skeleton.scaleY = 0.3;
    window.s = skeleton;
    const animationStateData = new spine.AnimationStateData(skelData);
    const animationState = new spine.AnimationState(animationStateData);
    window.as = animationState;
    render(
        skeleton,
        new spine.TimeKeeper(),
        animationState,
        renderer,
        mousePos
    );
});
function updatePos({ x, y }: { x: number; y: number }) {
    mousePosDisplay.innerText = `X:${x},Y:${y}`;
}
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    Object.assign(mousePos, {
        x:
            ((e.clientX - rect.left) / rect.width) * canvas.width -
            canvas.width / 2,
        y:
            canvas.height / 2 -
            ((e.clientY - rect.top) / rect.height) * canvas.height,
    });
    updatePos(mousePos);
});
