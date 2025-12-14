import type { Plugin } from 'esbuild';
import { readFileSync } from 'fs';
const minifySpinePlugin: Plugin = {
    name: 'minify-spine',
    setup(build) {
        build.onLoad({ filter: /spine-webgl.js$/ }, function (args) {
            return {
                contents: readFileSync(
                    args.path.replace('spine-webgl.js', 'spine-webgl.min.js')
                ),
                loader: 'text',
            };
        });
    },
};
export { minifySpinePlugin };
export default minifySpinePlugin;
