import { VersionNames } from './spine/spineVersions';

export type URLMaybeData = {
    url: string,
    data?: string
}

export class SpineConfig {
    private _skel: URLMaybeData;
    private _atlas: URLMaybeData;
    version: VersionNames;
    constructor(config: {
        skel: URLMaybeData;
        atlas: URLMaybeData;
        version: VersionNames;
    }) {
        this.version = config.version;
        this.skel = config.skel;
        this.atlas = config.atlas;
    }
    set skel(v: URLMaybeData) {
        if (!v.url.startsWith('http')) {
            v.url = `https://m.ccw.site/user_projects_assets/${v}`
        }
            this._skel = v;
    }
    get skel() {
        return this._skel;
    }

    set atlas(v: URLMaybeData) {
        if (!v.url.startsWith('http')) {
            v.url = `https://m.ccw.site/user_projects_assets/${v}`
        }
            this._atlas = v;
    }
    get atlas() {
        return this._atlas;
    }

    toJSON() {
        return {
            skel: this.skel,
            atlas: this.atlas,
            version: this.version,
        };
    }
}
