import type ScratchStorage from 'scratch-storage';
import { mount } from 'svelte';
import Index from './components/index.svelte';

export class scratchStroageUI {
    storage: ScratchStorage;
    extId: string;

    constructor(storage: ScratchStorage, extId: string = 'test') {
        this.storage = storage;
        this.extId = extId;
    }

    async loadFile(assetId: string) {
        return fetch(`https://m.ccw.site/user_projects_assets/${assetId}`);
    }

    async storeFile(
        contentType: string = 'text/plain',
        fileName: string,
        extName: string = '',
        data: string | Uint8Array | Blob | ArrayBuffer
    ) {
        let fileData: ArrayBuffer;
        if (data instanceof String) {
            const enc = new TextEncoder();
            fileData = enc.encode(data as string).buffer;
        } else if (data instanceof Blob) {
            fileData = await data.arrayBuffer();
        } else if (data instanceof Uint8Array) {
            fileData = data.buffer;
        } else if (data instanceof ArrayBuffer) {
            fileData = data;
        } else {
            throw new Error(`cannot convert ${data} to array buffer`);
        }
        return this.storage.store(
            { contentType } as unknown as ScratchStorage.Asset,
            extName as unknown as ScratchStorage.DataFormat,
            fileData,
            fileName
        );
    }

    createUI(root?: HTMLDivElement | undefined) {
        let target: HTMLDivElement = root;
        if (!target) {
            target = document.createElement('div');
            target.style.position = 'fixed';
            target.style.top = '0px';
            target.style.left = '0px';
            document.body.appendChild(target);
        }
        return mount(Index, {
            target,
        });
    }
}
