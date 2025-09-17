import http from 'http';

const users = [];

 

const server = http.createServer(async(req, res) => {
    const { method, url } = req;

    const buffers = [];


    for await (const chunk of req){
        buffers.push(chunk)
    }

   const body = Buffer.concat(buffers).toString()
   console.log('Body recebido:', body)

    if (method === 'GET' && url === '/user') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(users));
    }
    
    if (method === 'POST' && url === '/user') {
        let userData = {};
        try {
            if (body && body.trim()) {
                userData = JSON.parse(body);
            }
        } catch (error) {
            console.log('Erro no JSON:', error.message);
        }
        const {name, email} = userData;
        console.log('Dados extraídos:', {name, email});

        users.push({
            id: users.length + 1,
            name,
            email,
        });
        console.log('Usuários após inserção:', users);
    
        res.writeHead(201);
        return res.end('Criação de usuário');
    }
    res.writeHead(404);
    return res.end('not found');
});

server.listen(3333, () => console.log('Server running at http://localhost:3333'));