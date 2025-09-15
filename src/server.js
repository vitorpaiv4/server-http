import http from 'http';

const users = [];

const server = http.createServer((req, res) => {
    const { method, url } = req;

    if (method === 'GET' && url === '/user') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(users));
    }
    
    if (method === 'POST' && url === '/user') {
        users.push({
            id: 1,
            name: 'John Doe',
            email: 'johndoe@example.com',
        });
        users.push({
            id: 2,
            name: 'Jane Doe',
            email: 'janedoe@example.com',
        });
        res.writeHead(201);
        return res.end('Criação de usuário');
    }
    res.writeHead(404);
    return res.end('not found');
});

server.listen(3333, () => console.log('Server running at http://localhost:3333'));