import { Ext } from '..';
import { setupGetSth } from './customBlocks/getSth';
export function setupCustomBlocks(ext: Ext, NS: string) {
    setupGetSth(ext, NS);
}
