export async function json(req, res) {
    const buffers = [];


    for await (const chunk of req){
        buffers.push(chunk)
    }

   const body = Buffer.concat(buffers).toString()
   console.log('Body recebido:', body)
   req.body = null;

   res. setHeader('Content-Type', 'application/json');
   if (body && body.trim()) {
        try {
            req.body = JSON.parse(body);
        } catch (error) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
            return;
        }
   }
}