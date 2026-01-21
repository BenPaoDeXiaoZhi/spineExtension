import { defineConfig, Options } from 'tsup';
import { WebSocketServer, WebSocket } from 'ws';
import { readFileSync } from 'fs';
import { minifySpinePlugin } from './minify';

function getBanner(env = 'dev', extra = '') {
    const date = new Date();
    const formattedDate = new Intl.DateTimeFormat('zh-CN', {
        timeZone: 'Asia/Shanghai',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(date);
    return `
/* Ciallo～(∠・ω< )⌒★
 - Deploy by ${env}
 - Deploy time: ${formattedDate}
${extra}*/`;
}

export default defineConfig((tsupOptions) => {
    let clients: WebSocket[] = [];
    if (tsupOptions.watch) {
        console.log('Websocket start');
        const server = new WebSocketServer({ port: 8888 });
        server.on('connection', (ws) => {
            clients.push(ws);
            console.log(`new connection ${Date.now()}`);
            let fileDat = '// error';
            try {
                fileDat = readFileSync('./dist/extension.global.js').toString();
            } catch (e) {
                console.error(e);
            }
            ws.send(fileDat);
        });
    }
    const dat: Options = {
        banner: {
            get js() {
                if (tsupOptions.watch) {
                    return getBanner('dev');
                } else {
                    return getBanner(
                        'Github CI/CD',
                        ` - Commit id: ${process.env.GITHUB_SHA}
 - Repository: ${process.env.REPO}
 - Actor: ${process.env.GITHUB_ACTOR}`,
                    );
                }
            },
        },
        entry: {
            extension: 'src/index.ts',
            index: 'src/dev/index.ts',
            component: 'src/dev/file.ts',
            report: 'src/dev/htmlReport.ts',
        },
        splitting: false,
        sourcemap: false,
        clean: true,
        format: 'iife',
        loader: {
            '.css': 'text',
            '.svg': 'text',
            '.png': 'dataurl',
            '.asset.html': 'text',
        },
        publicDir: './public',
        esbuildOptions(options) {
            options.charset = 'utf8';
        },
        async onSuccess() {
            if (tsupOptions.watch) {
                if (clients) {
                    let fileDat = '// error';
                    try {
                        fileDat = readFileSync(
                            './dist/extension.global.js',
                        ).toString();
                    } catch (e) {
                        console.error(e);
                    }
                    for (let client of clients) {
                        client.send(fileDat);
                    }
                }
                console.log('dev Server sent');
            }
        },
        esbuildPlugins: [minifySpinePlugin],
        treeshake: true,
        minify: !tsupOptions.watch,
    };
    return dat;
});
