import { VersionNames } from './spine/spineVersions';

export class SpineConfig {
    private _skel: string;
    private _atlas: string;
    version: VersionNames;
    constructor(config: {
        skel: string;
        atlas: string;
        version: VersionNames;
    }) {
        this.version = config.version;
        this.skel = config.skel;
        this.atlas = config.atlas;
    }
    set skel(v: string) {
        if (v.startsWith('http')) {
            this._skel = v;
        } else {
            this._skel = `https://m.ccw.site/user_projects_assets/${v}`;
        }
    }
    get skel() {
        return this._skel;
    }

    set atlas(v: string) {
        if (v.startsWith('http')) {
            this._atlas = v;
        } else {
            this._atlas = `https://m.ccw.site/user_projects_assets/${v}`;
        }
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
