const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 8000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg',
    '.webm': 'video/webm',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf'
};

function getLocalIpAddresses() {
    const interfaces = os.networkInterfaces();
    const ips = [];
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                ips.push({ name, ip: iface.address });
            }
        }
    }
    return ips;
}

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed');
        return;
    }

    let reqUrl = decodeURI(req.url.split('?')[0]);
    if (reqUrl === '/' || reqUrl === '') {
        reqUrl = '/index.html';
    }

    const safePath = path.normalize(reqUrl).replace(/^(\.\.[\/\\])+/, '');
    let filePath = path.join(PUBLIC_DIR, safePath);

    fs.stat(filePath, (err, stats) => {
        if (err) {
            if (fs.existsSync(path.join(filePath, 'index.html'))) {
                filePath = path.join(filePath, 'index.html');
                serveStaticFile(req, res, filePath);
                return;
            }
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('404 Not Found: ' + reqUrl);
            return;
        }

        if (stats.isDirectory()) {
            const indexFile = path.join(filePath, 'index.html');
            if (fs.existsSync(indexFile)) {
                serveStaticFile(req, res, indexFile);
            } else {
                res.writeHead(403, { 'Content-Type': 'text/plain' });
                res.end('Directory listing forbidden');
            }
            return;
        }

        serveStaticFile(req, res, filePath, stats);
    });
});

function serveStaticFile(req, res, filePath, stats) {
    if (!stats) {
        try {
            stats = fs.statSync(filePath);
        } catch (e) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('File not found');
            return;
        }
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const totalSize = stats.size;
    const rangeHeader = req.headers.range;

    if (req.method === 'HEAD') {
        res.writeHead(200, {
            'Content-Type': contentType,
            'Content-Length': totalSize,
            'Accept-Ranges': 'bytes'
        });
        res.end();
        return;
    }

    if (rangeHeader && (ext === '.mp3' || ext === '.mp4' || ext === '.wav' || ext === '.webm')) {
        const parts = rangeHeader.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;

        if (start >= totalSize || end >= totalSize || start > end) {
            res.writeHead(416, {
                'Content-Range': `bytes */${totalSize}`,
                'Content-Type': 'text/plain'
            });
            res.end('Requested Range Not Satisfiable');
            return;
        }

        const chunkSize = end - start + 1;
        const fileStream = fs.createReadStream(filePath, { start, end });

        res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${totalSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': contentType
        });

        fileStream.pipe(res);
        fileStream.on('error', (err) => {
            if (!res.headersSent) res.writeHead(500);
            res.end();
        });
    } else {
        res.writeHead(200, {
            'Content-Type': contentType,
            'Content-Length': totalSize,
            'Accept-Ranges': 'bytes',
            'Cache-Control': ext === '.html' || ext === '.js' || ext === '.css' ? 'no-cache' : 'max-age=3600'
        });

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
        fileStream.on('error', (err) => {
            if (!res.headersSent) res.writeHead(500);
            res.end();
        });
    }

    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ua = req.headers['user-agent'] ? req.headers['user-agent'].substring(0, 45) : 'Unknown UA';
    if (ext === '.html' || req.url === '/' || req.url.includes('flores') || req.url.includes('boveda')) {
        console.log(`[REQ] ${new Date().toLocaleTimeString()} | IP: ${clientIp} | GET ${req.url} | UA: ${ua}`);
    }
}

server.listen(PORT, '0.0.0.0', () => {
    const ips = getLocalIpAddresses();
    console.log(`\n======================================================`);
    console.log(`   🚀 SERVIDOR ACTIVO EN PUERTO ${PORT}`);
    console.log(`======================================================`);
    console.log(`   💻 Desde tu PC:`);
    console.log(`      http://localhost:${PORT}/`);
    console.log(`\n   📱 Desde tu celular Redmi / iPhone (en la misma red Wi-Fi):`);
    ips.forEach(item => {
        console.log(`      http://${item.ip}:${PORT}/   (Red: ${item.name})`);
    });
    console.log(`======================================================\n`);
});
