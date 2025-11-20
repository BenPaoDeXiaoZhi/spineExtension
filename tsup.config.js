import { defineConfig } from 'tsup';
import { WebSocketServer } from 'ws';
import { readFileSync } from 'fs';
const server = new WebSocketServer({ port: 8888 });
/**
 * @type {Array<WebSocket>}
 */
let clients = [];
server.on('connection', (ws) => {
    clients.push(ws);
    ws.send('1');
});
export default defineConfig({
    entry: {
        extension: 'src/index.ts',
        index: 'src/dev/index.ts',
    },
    splitting: false,
    sourcemap: false,
    clean: true,
    format: 'iife',
    esbuildOptions(options) {
        options.charset = 'utf8';
    },
    async onSuccess() {
        const date = new Date();

        // 转换为特定时区
        const options = {
            timeZone: 'Asia/Shanghai',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };

        const formattedDate = new Intl.DateTimeFormat('zh-CN', options).format(
            date
        );
        if (clients) {
            const dat =
                `/* deploy by dev
time: ${formattedDate} */
` + readFileSync('./dist/extension.global.js');
            for (let client of clients) {
                client.send(dat);
            }
        }
        console.log('ok', formattedDate);
    },
});
