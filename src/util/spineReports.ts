import { SpineSkin } from '../spineSkin';
import { HTMLReport, maybeFunc, resoveMaybeFunc } from './htmlReport';
import { Id } from '../i18n/translate';
import { Skeleton } from '40webgl';

function domWithType(
    type: maybeFunc<string>,
    color: maybeFunc<string>,
    restChildren: HTMLElement[] = []
) {
    const container = document.createElement('div');
    let children: HTMLElement[] = [];

    const reportTypeDom = document.createElement('span');
    reportTypeDom.style.fontSize = '150%';
    reportTypeDom.innerText = resoveMaybeFunc(type);
    reportTypeDom.style.color = resoveMaybeFunc(color);
    children.push(reportTypeDom);
    children = children.concat(restChildren);
    children.forEach((dom, idx) => {
        container.appendChild(dom);
        if (idx !== children.length - 1) {
            container.appendChild(document.createElement('br'));
        }
    });
    return container;
}

export class SpineSkinReport extends HTMLReport<SpineSkin> {
    constructor(
        skin: SpineSkin,
        translate: (id: Id, args?: object) => string,
        name: string
    ) {
        const idDom = document.createElement('span');
        idDom.innerText = translate('spineAnimation.SpineSkinReport.id', {
            id: skin.id,
        });

        const versionDom = document.createElement('span');
        versionDom.innerText = translate(
            'spineAnimation.SpineSkinReport.version',
            { version: skin.manager.version }
        );

        const nameDom = document.createElement('span');
        nameDom.innerText = translate(
            'spineAnimation.SpineSkinReport.nameText',
            { name }
        );
        super(
            () =>
                domWithType(
                    () => translate('spineAnimation.SpineSkinReport.type'),
                    'blue',
                    [idDom, versionDom, nameDom]
                ),
            skin,
            () =>
                translate('spineAnimation.SpineSkinReport.monitor', {
                    id: skin.id,
                    version: skin.manager.version,
                    name,
                })
        );
    }
}

export class SpineSkeletonReport<T extends Skeleton> extends HTMLReport<T> {
    constructor(skeleton: T, translate: (id: Id) => string, name: string) {
        super(
            () => domWithType('spine骨架', 'green'),
            skeleton,
            () =>
                `(spine骨架) 名称为${name}, 共有${skeleton.bones.length}个骨骼`
        );
    }
}
