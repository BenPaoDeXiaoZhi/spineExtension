import type ScratchStorage from 'scratch-storage';
import dialog from './storage/dialog.asset.html';
import closeSVG from './storage/close.svg';
import uploadSVG from './storage/upload.svg';

export class scratchStorageUI {
    storage: ScratchStorage;
    extId: string;

    constructor(storage: ScratchStorage, extId: string = 'test') {
        this.storage = storage;
        this.extId = extId;
    }

    loadFile(assetId: string) {
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
            fileName
        );
    }

    createUI() {
        if (!customElements.get('scratch-storage-ui')) {
            customElements.define('scratch-storage-ui', Container);
        }
    }
}

export class Container extends HTMLElement {
    dialog: HTMLDialogElement;
    constructor() {
        super();
    }
    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = dialog;

        this.dialog = shadow.getElementById('dialog') as HTMLDialogElement;
        this.dialog.showModal();

        const header = shadow.getElementById('header');
        header.innerText = 'upload';

        const uploader = shadow.getElementById('uploader');
        uploader.innerHTML = uploadSVG + uploader.innerHTML;

        const uploadTip = shadow.getElementById('uploadTip');
        uploader.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadTip.innerText = '松手上传';
        });
        uploader.addEventListener('dragleave', (e) => {
            if (e.target !== uploader) {
                return;
            }
            console.log(e);
            uploadTip.innerText = '选择或拖动文件上传';
        });
        uploader.addEventListener('drop', (e) => {
            e.preventDefault();
            console.log(e);
        });

        const close = shadow.getElementById('close') as HTMLDivElement;
        close.innerHTML = closeSVG;
        close.addEventListener('click', (e) => {
            this.dialog.close();
            this.remove();
        });
    }
}
