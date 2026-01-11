import { Spine40Manager, Spine42Manager } from './spineManager';
export type SpineManagers = {
    '4.0webgl': Spine40Manager;
    '4.2webgl': Spine42Manager;
};
export class SpineConfig {
    private _skel: string;
    private _atlas: string;
    version: keyof SpineManagers;
    constructor(config: {
        skel: string;
        atlas: string;
        version: keyof SpineManagers;
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
