import { AnimationState, SceneRenderer, Skeleton, TimeKeeper, Color } from "42webgl";
import type Spine from "../spine/4.2/spine-webgl";
import spineVersions from "../spine/spineVersions";

window as unknown;
const rootDir=prompt("root:",localStorage["root"] || "https://l2d-cn.kivotos.qzz.io/")||""
localStorage["root"] = rootDir

const spine = spineVersions["4.2webgl"];
console.log(spine);
Object.assign(window,{r:[],s:[],spine});
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
  const {x,y,width,height}=skeleton.getBoundsRect();
  spineRenderer.rect(true,x,y,width,height,new Color(0,1,0,0.2));
  spineRenderer.rect(true,skeleton.x,skeleton.y,50,50,new Color(0,0,1,1));
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
  window.r.push(spineRenderer)
  spineRenderer.begin();
  spineRenderer.rect(true,-500,-500,1000,1000,new Color(1,0,0.5,1));
  spineRenderer.end();
  const assetMgr = new spine.AssetManager(ctx);
  const atlasUrl = `${rootDir}${i.toLowerCase()}_home/${i}_home.atlas`,
    skelUrl = `${rootDir}${i.toLowerCase()}_home/${i}_home.skel`;
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
    window.s.push(skeleton)
    skeleton.y = -300;
    animationState.setAnimation(0, "Idle_01", true);
    (window as any).skeleton = skeleton;
    (window as any).animationState = animationState;
    console.log(atlasLoader, skeletonLoader, skeleton, spineRenderer);
    requestAnimationFrame(() =>
      render(skeleton, tk, animationState, spineRenderer)
    );
  })(assetMgr);
}
