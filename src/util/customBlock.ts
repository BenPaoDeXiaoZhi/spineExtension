import { Ext } from '..';
import { setupGetSth } from './customBlocks/getSth';
import { setupPos } from './customBlocks/setRelativePos';
export function setupCustomBlocks(ext: Ext, NS: string) {
    setupGetSth(ext, NS);
    setupPos(ext, NS);
}
