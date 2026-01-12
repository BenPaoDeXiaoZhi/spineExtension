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

export abstract class SpineManager {
    abstract sceneRenderer: any;
    version: keyof typeof spineVersions;
    abstract assetManager: any;

    constructor(version: keyof typeof spineVersions) {
        this.version = version;
    }
    abstract loadSkeleton(skeletonUrl: string, atlasUrl: string): any;
    abstract drawSkeleton(
        skeleton: any,
        tk: any,
        animationState: any,
        viewport: [w: number, h: number]
    ): any;
}

export abstract class Spine4Manager extends SpineManager {
    assetManager: any;
    sceneRenderer: any;
    constructor(version: keyof typeof spineVersions) {
        super(version);
    }
    async loadSkeleton(skeletonUrl: string, atlasUrl: string): Promise<any> {
        loadAsset(this.assetManager, skeletonUrl, atlasUrl);
        await this.assetManager.loadAll(); // in 4.x
    }
}

export class Spine42Manager extends Spine4Manager {
    assetManager: spine42.AssetManager;
    sceneRenderer: spine42.SceneRenderer;
    constructor(renderer: RenderWebGL) {
        super('4.2webgl');
        this.assetManager = new spine42.AssetManager(renderer.gl);
        this.sceneRenderer = new spine42.SceneRenderer(
            renderer.canvas,
            renderer.gl,
            false
        );
    }
    async loadSkeleton(
        skeletonUrl: string,
        atlasUrl: string
    ): Promise<{
        skeleton: spine42.Skeleton;
        animationState: spine42.AnimationState;
    }> {
        await super.loadSkeleton(skeletonUrl, atlasUrl);
        return parseSkeleton(this.assetManager, spine42, skeletonUrl, atlasUrl);
    }
    drawSkeleton(
        skeleton: spine42.Skeleton,
        tk: spine42.TimeKeeper,
        animationState: spine42.AnimationState,
        viewport: [w: number, h: number]
    ) {
        skeleton.updateWorldTransform(spine42.Physics.update); //in 4.2
        tk.update();
        animationState.update(tk.delta);
        animationState.apply(skeleton);
        const camera = this.sceneRenderer.camera;
        camera.setViewport(...viewport);
        this.sceneRenderer.begin();
        this.sceneRenderer.drawSkeleton(skeleton, true);
        this.sceneRenderer.end();
    }
}

export class Spine40Manager extends Spine4Manager {
    assetManager: spine40.AssetManager;
    sceneRenderer: spine40.SceneRenderer;
    spine: typeof spine40;
    constructor(renderer: RenderWebGL) {
        super('4.0webgl');
        this.assetManager = new spine40.AssetManager(renderer.gl);
        this.sceneRenderer = new spine40.SceneRenderer(
            renderer.canvas,
            renderer.gl
        );
    }

    async loadSkeleton(
        skeletonUrl: string,
        atlasUrl: string
    ): Promise<{
        skeleton: spine40.Skeleton;
        animationState: spine40.AnimationState;
    }> {
        await super.loadSkeleton(skeletonUrl, atlasUrl);
        return parseSkeleton(this.assetManager, spine40, skeletonUrl, atlasUrl);
    }

    drawSkeleton(
        skeleton: spine40.Skeleton,
        tk: spine40.TimeKeeper,
        animationState: spine40.AnimationState,
        viewport: [w: number, h: number]
    ) {
        skeleton.updateWorldTransform(); //in 4.0 and 3.8
        tk.update();
        animationState.update(tk.delta);
        animationState.apply(skeleton);
        const camera = this.sceneRenderer.camera;
        camera.setViewport(...viewport);
        this.sceneRenderer.begin();
        this.sceneRenderer.drawSkeleton(skeleton);
        this.sceneRenderer.end();
    }
}
