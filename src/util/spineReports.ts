 import { SpineSkin } from '../spineSkin';
import { HTMLReport, maybeFunc, resolveMaybeFunc } from './htmlReport';
import { Id } from '../i18n/translate';
import { Skeleton } from '40webgl';

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

        const versionDom = document.createElement('span');

        const nameDom = document.createElement('span');

        super(
            domWithType.bind(
                null,
                translate.bind(null,'spineAnimation.SpineSkinReport.type'),
                'blue',
                () => {
                    idDom.innerText = translate('spineAnimation.SpineSkinReport.id', {id: skin.id });
                    versionDom.innerText = translate('spineAnimation.SpineSkinReport.version',{ version: skin.manager.version });
                    nameDom.innerText = translate('spineAnimation.SpineSkinReport.nameText',{ name });
                    return [idDom,versionDom,nameDom];
                }
            ),
            skin,
            translate.bind(null,'spineAnimation.SpineSkinReport.monitor', {
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
