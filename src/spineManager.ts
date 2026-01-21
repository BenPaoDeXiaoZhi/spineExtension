import spineVersions, { SceneRenderer } from './spine/spineVersions';
import {
    Skeleton,
    AnimationState,
    AssetManager,
    Versions,
    VersionNames,
} from './spine/spineVersions';
import RenderWebGL from 'scratch-render';

function loadAsset<V extends VersionNames>(
    assetManager: AssetManager<V>,
    skeletonUrl: string,
    atlasUrl: string,
) {
    if (skeletonUrl.endsWith('.skel')) {
        assetManager.loadBinary(skeletonUrl);
    } else {
        if ('loadJson' in assetManager) {
            assetManager.loadJson(skeletonUrl);
        } else {
            assetManager.loadText(skeletonUrl);
        }
    }
    assetManager.loadTextureAtlas(atlasUrl);
    return assetManager;
}

function parseSkeleton(
    assetManager: any,
    spine: any,
    skeletonUrl: string,
    atlasUrl: string,
): { skeleton: any; animationState: any } {
    const atlasLoader = new spine.AtlasAttachmentLoader(
        assetManager.get(atlasUrl),
    );
    let loader: any;
    if (skeletonUrl.endsWith('.skel')) {
        loader = new spine.SkeletonBinary(atlasLoader);
    } else {
        loader = new spine.SkeletonJson(atlasLoader);
    }
    const skeletonData = loader.readSkeletonData(assetManager.get(skeletonUrl));
    const skeleton = new spine.Skeleton(skeletonData);
    const animationStateData = new spine.AnimationStateData(skeletonData);
    const animationState = new spine.AnimationState(animationStateData);
    return { skeleton, animationState };
}

function loadAll(assetManager: AssetManager) {
    if ('loadAll' in assetManager) {
        return assetManager.loadAll();
    } else {
        return new Promise((resolve) => {
            const check = () => {
                if (assetManager.getToLoad() == 0) {
                    resolve(assetManager);
                } else {
                    requestAnimationFrame(check);
                }
            };
            check();
        });
    }
}

export class SpineManager<V extends VersionNames = VersionNames> {
    sceneRenderer: SceneRenderer<V>;
    version: V;
    assetManager: AssetManager<V>;
    spine: Versions<V>;
    debugRender: boolean;

    constructor(version: V, renderer: RenderWebGL) {
        this.version = version;
        this.spine = spineVersions[version];
        this.assetManager = new this.spine.AssetManager(
            renderer.gl,
        ) as AssetManager<V>;
        this.sceneRenderer = new this.spine.SceneRenderer(
            renderer.canvas,
            renderer.gl,
        ) as SceneRenderer<V>;
    }
    async loadSkeleton(
        skeletonUrl: string,
        atlasUrl: string,
    ): Promise<{ skeleton: Skeleton<V>; animationState: AnimationState<V> }> {
        loadAsset(this.assetManager, skeletonUrl, atlasUrl);
        await loadAll(this.assetManager);
        return parseSkeleton(
            this.assetManager,
            this.spine,
            skeletonUrl,
            atlasUrl,
        );
    }
    drawSkeleton(
        skeleton: Skeleton<V>,
        tk: any,
        animationState: any,
        viewport: [w: number, h: number],
    ): any {
        skeleton.updateWorldTransform(2); //adapter: in 4.0 and 3.8, don't need this argument
        tk.update();
        animationState.update(tk.delta);
        animationState.apply(skeleton);
        const camera = this.sceneRenderer.camera;
        camera.setViewport(...viewport);
        this.sceneRenderer.begin();
        this.sceneRenderer.drawSkeleton(skeleton as any, true);
        if (this.debugRender) {
            this.sceneRenderer.drawSkeletonDebug(skeleton as any, true);
        }
        this.sceneRenderer.end();
    }
}

// export abstract class Spine4Manager extends SpineManager {
//     assetManager: any;
//     sceneRenderer: any;
//     constructor(version: keyof typeof spineVersions) {
//         super(version);
//     }
//     async loadSkeleton(skeletonUrl: string, atlasUrl: string): Promise<any> {
//         loadAsset(this.assetManager, skeletonUrl, atlasUrl);
//         await this.assetManager.loadAll(); // in 4.x
//     }
// }
