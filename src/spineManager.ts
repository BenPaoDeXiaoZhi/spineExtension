import spineVersions from './spine/spineVersions';
import spine42 from './spine/4.2/spine-webgl';
import spine40 from './spine/4.0/spine-webgl';
import RenderWebGL from 'scratch-render';

function loadAsset(assetManager: any, skeletonUrl: string, atlasUrl: string) {
    if (skeletonUrl.endsWith('.skel')) {
        assetManager.loadBinary(skeletonUrl);
    } else {
        assetManager.loadJson(skeletonUrl);
    }
    assetManager.loadTextureAtlas(atlasUrl);
    return assetManager;
}

function parseSkeleton(
    assetManager: any,
    spine: any,
    skeletonUrl: string,
    atlasUrl: string
): { skeleton: any; animationState: any } {
    const atlasLoader = new spine.AtlasAttachmentLoader(
        assetManager.get(atlasUrl)
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

abstract class SpineManager {
    abstract sceneRenderer: any;
    version: keyof typeof spineVersions;
    abstract assetManager: any;
    spine: any;
    constructor(version: keyof typeof spineVersions) {
        this.version = version;
        this.spine = spineVersions[version];
    }
    abstract loadSkeleton(skeletonUrl: string, atlasUrl: string): any;
}

export class Spine4Manager extends SpineManager {
    assetManager: any;
    sceneRenderer: any;
    spine: any;
    constructor(renderer: RenderWebGL, version: keyof typeof spineVersions) {
        super(version);
        this.assetManager = new this.spine.AssetManager(renderer.gl);
        this.sceneRenderer = new this.spine.SceneRenderer(
            renderer.canvas,
            renderer.gl
        );
    }
    async loadSkeleton(
        skeletonUrl: string,
        atlasUrl: string
    ): Promise<{
        skeleton: spine42.Skeleton | spine40.Skeleton;
        animationState: spine42.AnimationState | spine40.AnimationState;
    }> {
        loadAsset(this.assetManager, skeletonUrl, atlasUrl);
        await this.assetManager.loadAll(); // in 4.x
        return parseSkeleton(
            this.assetManager,
            this.spine,
            skeletonUrl,
            atlasUrl
        );
    }
}

export class Spine42Manager extends Spine4Manager {
    assetManager: spine42.AssetManager;
    sceneRenderer: spine42.SceneRenderer;
    spine: typeof spine42;
    constructor(renderer: RenderWebGL) {
        super(renderer, '4.2webgl');
    }
    async loadSkeleton(
        skeletonUrl: string,
        atlasUrl: string
    ): Promise<{
        skeleton: spine42.Skeleton;
        animationState: spine42.AnimationState;
    }> {
        return (await super.loadSkeleton(
            skeletonUrl,
            atlasUrl
        )) as unknown as Promise<{
            skeleton: spine42.Skeleton;
            animationState: spine42.AnimationState;
        }>;
    }
}

export class Spine40Manager extends Spine4Manager {
    assetManager: spine40.AssetManager;
    sceneRenderer: spine40.SceneRenderer;
    spine: typeof spine40;
    constructor(renderer: RenderWebGL) {
        super(renderer, '4.0webgl');
    }

    async loadSkeleton(
        skeletonUrl: string,
        atlasUrl: string
    ): Promise<{
        skeleton: spine40.Skeleton;
        animationState: spine40.AnimationState;
    }> {
        return (await super.loadSkeleton(
            skeletonUrl,
            atlasUrl
        )) as unknown as Promise<{
            skeleton: spine40.Skeleton;
            animationState: spine40.AnimationState;
        }>;
    }
}
