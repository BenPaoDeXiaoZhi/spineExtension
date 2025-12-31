import { SpineSkin } from '../spineSkin';
import { HTMLReport, maybeFunc, resolveMaybeFunc } from './htmlReport';
import { TranslateFn } from '../i18n/translate';
import spineVersions, { Skeleton } from '../spine/spineVersions';

function domWithType(
    type: maybeFunc<string>,
    color: maybeFunc<string>,
    restChildren: maybeFunc<HTMLElement[]> = []
) {
    const container = document.createElement('div');
    let children: HTMLElement[] = [];

    const reportTypeDom = document.createElement('span');
    reportTypeDom.style.fontSize = '150%';
    reportTypeDom.innerText = resolveMaybeFunc(type);
    reportTypeDom.style.color = resolveMaybeFunc(color);
    children.push(reportTypeDom);
    children = children.concat(resolveMaybeFunc(restChildren));
    children.forEach((dom, idx) => {
        container.appendChild(dom);
    });
    return container;
}

export class ObjectKVReport<
    V,
    T extends { [K: string]: string } = {}
> extends HTMLReport<V> {
    constructor(
        type: maybeFunc<string>,
        color: maybeFunc<string>,
        obj: maybeFunc<T>,
        value: V,
        monitor: maybeFunc<string>
    ) {
        function render() {
            const children: HTMLElement[] = [];
            const rawObj = resolveMaybeFunc(obj);
            for (const i in rawObj) {
                const KVDom = document.createElement('div');
                const keyDom = document.createElement('span');
                keyDom.innerText = i;
                const valueDom = document.createElement('span');
                valueDom.innerText = rawObj[i];
                KVDom.appendChild(keyDom);
                KVDom.appendChild(valueDom);
                children.push(KVDom);
            }
            const container = domWithType(type, color, children);
            return container;
        }
        super(render, value, monitor);
    }
}

export class SpineSkinReport extends ObjectKVReport<SpineSkin> {
    constructor(skin: SpineSkin, translate: TranslateFn) {
        function render() {
            return {
                [translate('SpineSkinReport.id')]: skin.id,
                [translate('SpineSkinReport.version')]: skin.manager.version,
                [translate('SpineSkinReport.nameText')]: skin.name,
            };
        }
        super(
            () => translate('SpineSkinReport.type'),
            'blue',
            render,
            skin,
            () =>
                translate('SpineSkinReport.monitor', {
                    id: skin.id,
                    version: skin.manager.version,
                    name: skin.name,
                })
        );
    }
}

export class SpineSkeletonReport<
    T extends Skeleton<keyof typeof spineVersions>
> extends ObjectKVReport<T> {
    constructor(skeleton: T, translate: TranslateFn, name: string) {
        function render() {
            return {
                [translate('SpineSkeletonReport.nameText')]: name,
                [translate('SpineSkeletonReport.boneNum')]:
                    skeleton.bones.length,
            };
        }
        super(
            () => translate('SpineSkeletonReport.type'),
            'green',
            render,
            skeleton,
            () =>
                translate('SpineSkeletonReport.monitor', {
                    name,
                    boneNum: skeleton.bones.length,
                })
        );
    }
}
