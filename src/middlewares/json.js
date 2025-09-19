export async function json(req, res) {
    const buffers = [];

    for await (const chunk of req){
        buffers.push(chunk)
    }

    const body = Buffer.concat(buffers).toString()
    console.log('Body recebido:', body)
    
    // Inicializar req.body como null
    req.body = null;

    if (body && body.trim()) {
        try {
            req.body = JSON.parse(body);
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
            return;
        }
    }
}