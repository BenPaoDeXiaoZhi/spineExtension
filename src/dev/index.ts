import { AnimationState, SceneRenderer, Skeleton, TimeKeeper } from "42webgl";
import type Spine from "../spine/4.2/spine-webgl";
import spineVersions from "../spine/spineVersions";

window as unknown;

const spine = spineVersions["4.2webgl"];
console.log(spine);
alert("spine loaded");
function render(
  skeleton: Skeleton,
  tk: TimeKeeper,
  animationState: AnimationState,
  spineRenderer: SceneRenderer
) {
  skeleton.updateWorldTransform(spine.Physics.update);
  tk.update();
  animationState.update(tk.delta);
  animationState.apply(skeleton);
  spineRenderer.begin();
  spineRenderer.drawSkeleton(skeleton);
  const [x,y,width,height]=skeleton.getBoundsRect()
  spineRenderer.rect(x,y,width,height)
  spineRenderer.end();
  requestAnimationFrame(() =>
    render(skeleton, tk, animationState, spineRenderer)
  );
}
for (let i of ["Azusa", "CH0070", "Airi"]) {
  const root = document.createElement("div");
  const canvas = document.createElement("canvas");
  canvas.width = 1000;
  canvas.height = 1000;
  const ctx = canvas.getContext("webgl");
  root.appendChild(canvas);
  document.body.appendChild(root);
  const tk = new spine.TimeKeeper();

  const spineRenderer = new spine.SceneRenderer(canvas, ctx, false);
  const assetMgr = new spine.AssetManager(ctx);
  const atlasUrl = `https://l2d-pro.schale.qzz.io/${i.toLowerCase()}_home/${i}_home.atlas`,
    skelUrl = `https://l2d-pro.schale.qzz.io/${i.toLowerCase()}_home/${i}_home.skel`;
  assetMgr.loadBinary(skelUrl);
  assetMgr.loadTextureAtlas(atlasUrl);
  console.log(`loading data for ${i}`);
  let animationStateData: Spine.AnimationStateData;
  let animationState: Spine.AnimationState;
  let skeleton: Spine.Skeleton;
  (async function (assetMgr) {
    await new Promise((resolve, reject) => {
      function waitLoad() {
        if (assetMgr.isLoadingComplete()) {
          resolve(assetMgr);
        } else {
          if (assetMgr.hasErrors()) {
            reject(assetMgr);
          }
          requestAnimationFrame(waitLoad);
        }
      }
      requestAnimationFrame(waitLoad);
    });
    console.log(assetMgr);
    const atlasLoader = new spine.AtlasAttachmentLoader(assetMgr.get(atlasUrl));
    const skeletonLoader = new spine.SkeletonBinary(atlasLoader);
    const skeletonData = skeletonLoader.readSkeletonData(assetMgr.get(skelUrl));
    skeleton = new spine.Skeleton(skeletonData);
    animationStateData = new spine.AnimationStateData(skeleton.data);
    animationState = new spine.AnimationState(animationStateData);
    skeleton.scaleX = 0.3;
    skeleton.scaleY = 0.3;
    skeleton.setToSetupPose();
    skeleton.updateWorldTransform(spine.Physics.update);
    console.log(skeleton.getBoundsRect());
    skeleton.y = -canvas.height / 2;
    animationState.setAnimation(0, "Idle_01", true);
    (window as any).skeleton = skeleton;
    (window as any).animationState = animationState;
    console.log(atlasLoader, skeletonLoader, skeleton);
    requestAnimationFrame(() =>
      render(skeleton, tk, animationState, spineRenderer)
    );
  })(assetMgr);
}
