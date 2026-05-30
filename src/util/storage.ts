import type ScratchStorage from 'scratch-storage';
import dialog from './storage/dialog.asset.html';
import closeSVG from './storage/close.svg';
import uploadSVG from './storage/upload.svg';
import { RawSpineConfig, SpineConfig } from '../spineConfig';

export type StorageConfig = { [name: string]: RawSpineConfig };

/**
 * by AI: TRAE
 *
 * audit: BPDXZ
 *
 * 安全的 fetch 封装函数，处理跨域和 CSRF 问题
 * @param url 请求的 URL
 * @param options fetch 选项
 */
export async function safeFetch(
    url: string,
    options: RequestInit = {},
): Promise<Response> {
    // 配置安全的请求头
    const safeHeaders = new Headers(options.headers);

    // 添加防止 CSRF 的头部
    safeHeaders.set('X-Requested-With', 'XMLHttpRequest');

    // 安全的请求选项
    const safeOptions: RequestInit = {
        ...options,
        headers: safeHeaders,
        mode: 'cors',
        // 不发送cookie
        credentials: 'omit',
        // 防止缓存问题
        cache: 'no-cache',
    };

    try {
        const response = await fetch(url, safeOptions);

        // 检查响应状态
        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error) {
        console.error('Safe fetch error:', error);
        throw error;
    }
}

export class scratchStorageUI {
    storage: ScratchStorage;
    extId: string;

    constructor(storage: ScratchStorage, extId: string = 'test') {
        this.storage = storage;
        this.extId = extId;
    }

    loadFile(assetId: string) {
        return safeFetch(`https://m.ccw.site/user_projects_assets/${assetId}`);
    }

    async storeFile(
        contentType: string = 'text/plain',
        fileName: string,
        extName: string = '',
        data: string | Uint8Array | Blob | ArrayBuffer,
    ) {
        let fileData: ArrayBuffer;
        if (typeof data == 'string') {
            const enc = new TextEncoder();
            fileData = enc.encode(data as string).buffer;
        } else if (data instanceof Blob) {
            fileData = await data.arrayBuffer();
        } else if (data instanceof Uint8Array) {
            fileData = data.buffer as ArrayBuffer;
        } else if (data instanceof ArrayBuffer) {
            fileData = data;
        } else {
            throw new Error(`cannot convert ${data} to array buffer`);
        }
        return this.storage.store(
            { contentType } as unknown as ScratchStorage.Asset,
            extName as unknown as ScratchStorage.DataFormat,
            fileData,
            fileName,
        );
    }

    async fetchConfig(userId: string): Promise<StorageConfig> {
        const res = await this.loadFile(
            `spine/${userId}/config.json?t=${Date.now()}`,
        );
        if (!res.ok) {
            return {};
        }
        let config = {};
        try {
            const resDat = await res.json();
            config = resDat;
        } catch (e) {
            console.error(e);
        }
        return config;
    }

    async saveConfig(userId: string, name: string, config: RawSpineConfig) {
        const originConfig = await this.fetchConfig(userId);
        originConfig[name] = config;
        return this.storeFile(
            'application/json',
            `spine/${userId}/config`,
            'json',
            JSON.stringify(originConfig),
        );
    }

    // createUI() {
    //     if (!customElements.get('scratch-storage-ui')) {
    //         customElements.define('scratch-storage-ui', Container);
    //     }
    //     const dialog = document.createElement('scratch-storage-ui');
    //     document.body.appendChild(dialog);
    // }
}

// export class Container extends HTMLElement {
//     dialog: HTMLDialogElement;
//     constructor() {
//         super();
//     }
//     connectedCallback() {
//         const shadow = this.attachShadow({ mode: 'open' });
//         shadow.innerHTML = dialog;

//         this.dialog = shadow.getElementById('dialog') as HTMLDialogElement;
//         this.dialog.showModal();

//         const header = shadow.getElementById('header');
//         header.innerText = 'upload';

//         const uploader = shadow.getElementById('uploader');
//         uploader.innerHTML = uploadSVG + uploader.innerHTML;

//         const uploadTip = shadow.getElementById('uploadTip');
//         uploader.addEventListener('dragover', (e) => {
//             e.preventDefault();
//             uploadTip.innerText = '松手上传';
//         });
//         uploader.addEventListener('dragleave', (e) => {
//             if (e.target !== uploader) {
//                 return;
//             }
//             console.log(e);
//             uploadTip.innerText = '选择或拖动文件上传';
//         });
//         uploader.addEventListener('drop', (e) => {
//             e.preventDefault();
//             console.log(e);
//         });

//         const close = shadow.getElementById('close') as HTMLDivElement;
//         close.innerHTML = closeSVG;
//         close.addEventListener('click', (e) => {
//             this.dialog.close();
//             this.remove();
//         });
//     }
// }
