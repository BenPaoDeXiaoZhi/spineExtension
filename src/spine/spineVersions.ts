import spine38webgl from './3.8/spine-webgl';
import spine40webgl from './4.0/spine-webgl';
import spine42webgl from './4.2/spine-webgl';

const spineVersions = {
    '3.8webgl': spine38webgl,
    '4.0webgl': spine40webgl,
    '4.2webgl': spine42webgl,
};

export type VersionNames = keyof typeof spineVersions;

export type Versions<V extends VersionNames> = {
    '3.8webgl': typeof spine38webgl;
    '4.0webgl': typeof spine40webgl;
    '4.2webgl': typeof spine42webgl;
}[V];

export type Skeleton<V extends VersionNames = VersionNames> = {
    '4.2webgl': spine42webgl.Skeleton;
    '4.0webgl': spine40webgl.Skeleton;
    '3.8webgl': spine38webgl.Skeleton;
}[V];

export type Bone<V extends VersionNames = VersionNames> = {
    '4.2webgl': spine42webgl.Bone;
    '4.0webgl': spine40webgl.Bone;
    '3.8webgl': spine38webgl.Bone;
}[V];

export type AnimationState<V extends VersionNames = VersionNames> = {
    '4.2webgl': spine42webgl.AnimationState;
    '4.0webgl': spine40webgl.AnimationState;
    '3.8webgl': spine38webgl.AnimationState;
}[V];

export type SceneRenderer<V extends VersionNames = VersionNames> = {
    '4.2webgl': spine42webgl.SceneRenderer;
    '4.0webgl': spine40webgl.SceneRenderer;
    '3.8webgl': spine38webgl.SceneRenderer;
}[V];

export type AssetManager<V extends VersionNames = VersionNames> = {
    '4.2webgl': spine42webgl.AssetManager;
    '4.0webgl': spine40webgl.AssetManager;
    '3.8webgl': spine38webgl.AssetManager;
}[V];
export default spineVersions;
export { spine38webgl, spine40webgl, spine42webgl };
