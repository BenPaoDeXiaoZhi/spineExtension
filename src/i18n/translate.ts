import zh_cn from './zh_cn';
import en from './en';
export type Id = keyof typeof en & keyof typeof zh_cn;
export type TranslateFn = <T extends Id>(id: T, args?: object) => typeof zh_cn[T] | typeof en[T];

export function getTranslate(runtime: any): TranslateFn {
    const fmt = runtime.getFormatMessage({ 'zh-cn': zh_cn, en });
    return function (id: Id, args?: object) {
        return fmt(
            {
                default: id,
            },
            args
        );
    };
}

export { zh_cn, en };
