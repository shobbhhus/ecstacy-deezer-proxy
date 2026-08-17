const http = require('http');

http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        return res.end();
    }
    
    if (req.url === '/favicon.ico') return res.end();
    
    try {
        let targetUrl;
        if (req.url.startsWith('/proxy/')) {
            targetUrl = decodeURIComponent(req.url.replace('/proxy/', ''));
        } else {
            targetUrl = `https://api.octavestreaming.com${req.url}`;
        }
        
        const fetchRes = await fetch(targetUrl, {
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://octavestreaming.com/',
                'Origin': 'https://octavestreaming.com'
            }
        });
        
        const contentType = fetchRes.headers.get('content-type') || 'application/json';
        const data = await fetchRes.text();
        res.writeHead(fetchRes.status, { 'Content-Type': contentType });
        res.end(data);
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
    }
}).listen(process.env.PORT || 3000, () => console.log('Proxy running'));
