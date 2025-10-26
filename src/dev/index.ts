import type Spine from "../spine/4.2/spine-webgl";
import spineVersions from "../spine/spineVersions";
const spine = spineVersions['4.2webgl']
console.log(spine)
const root = document.createElement('div')
const canvas = document.createElement('canvas')
canvas.width = 1000
canvas.height = 1000
const ctx = new spine.ManagedWebGLRenderingContext(canvas, { alpha: true })
const tk = new spine.TimeKeeper()
root.appendChild(canvas)
document.body.appendChild(root)
const spineRenderer = new spine.SceneRenderer(canvas, ctx, false)
const assetMgr = new spine.AssetManager(ctx);
const atlasUrl = 'https://l2d-pro.schale.qzz.io/azusa_home/Azusa_home.atlas', skelUrl = 'https://l2d-pro.schale.qzz.io/azusa_home/Azusa_home.skel'
assetMgr.loadBinary(skelUrl)
assetMgr.loadTextureAtlas(atlasUrl);
let animationStateData:Spine.AnimationStateData;
let animationState:Spine.AnimationState;
let skeleton:Spine.Skeleton;
(async function (assetMgr) {
    await (new Promise((resolve, reject) => {
        function waitLoad() {
            if (assetMgr.isLoadingComplete()) {
                resolve(assetMgr)
            } else {
                if (assetMgr.hasErrors()) {
                    reject(assetMgr)
                }
                requestAnimationFrame(waitLoad)
            }
        }
        requestAnimationFrame(waitLoad)
    }))
    console.log(assetMgr)
    const atlasLoader = new spine.AtlasAttachmentLoader(assetMgr.get(atlasUrl));
    const skeletonLoader = new spine.SkeletonBinary(atlasLoader);
    const skeletonData = skeletonLoader.readSkeletonData(assetMgr.get(skelUrl));
    skeleton = new spine.Skeleton(skeletonData);
    animationStateData = new spine.AnimationStateData(skeleton.data);
	animationState = new spine.AnimationState(animationStateData);
    animationState.setAnimation(0,'Idle_01',true)
    skeleton.scaleX = 0.3
    skeleton.scaleY = 0.3
    console.log(atlasLoader, skeletonLoader,skeleton)
    requestAnimationFrame(render)
})(assetMgr)
function render(){
    skeleton.updateWorldTransform(spine.Physics.update);
    tk.update()
    animationState.update(tk.delta)
    animationState.apply(skeleton)
    spineRenderer.begin()
    spineRenderer.drawSkeleton(skeleton)
    spineRenderer.end()
    requestAnimationFrame(render)
}