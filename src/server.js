import http from 'http';
import { json } from './middlewares/json.js';
import { Database } from './database.js';
import { validateUserData } from './utils/validators.js';
import { logger } from './utils/logger.js';

const database = new Database()

const server = http.createServer(async(req, res) => {
    const startTime = Date.now();
    const { method, url } = req;

    logger.info(`Requisição recebida: ${method} ${url}`);

    // Usar o middleware personalizado para parsing do JSON
    await json(req, res);
    
    // Se o middleware retornou erro, não continuar
    if (res.headersSent) {
        return;
    }

    // GET /user - Listar todos os usuários
    if (method === 'GET' && url === '/user') {
        try {
            const users = database.select('users');
            logger.info('Usuários listados com sucesso', { count: users.length });
            
            const responseTime = Date.now() - startTime;
            logger.api(method, url, 200, responseTime, { count: users.length });
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify(users));
        } catch (error) {
            logger.error('Erro ao listar usuários', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Erro interno do servidor' }));
        }
    }

    // GET /user/:id - Buscar usuário por ID
    if (method === 'GET' && url.startsWith('/user/')) {
        try {
            const id = parseInt(url.split('/')[2]);
            if (isNaN(id)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'ID inválido' }));
            }

            const user = database.findById('users', id);
            if (!user) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Usuário não encontrado' }));
            }

            const responseTime = Date.now() - startTime;
            logger.api(method, url, 200, responseTime, { userId: id });
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify(user));
        } catch (error) {
            logger.error('Erro ao buscar usuário', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Erro interno do servidor' }));
        }
    }
    
    // POST /user - Criar novo usuário
    if (method === 'POST' && url === '/user') {
        try {
            const userData = req.body || {};
            
            // Validação robusta
            const validation = validateUserData(userData);
            if (!validation.isValid) {
                logger.warn('Dados de usuário inválidos', { errors: validation.errors });
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ 
                    error: 'Dados inválidos',
                    details: validation.errors
                }));
            }

            const users = database.select('users');
            const user = {
                id: users.length + 1,
                name: validation.data.name,
                email: validation.data.email,
                createdAt: new Date().toISOString()
            };
            
            database.insert('users', user);
            logger.info('Usuário criado com sucesso', { userId: user.id, name: user.name });
            
            const responseTime = Date.now() - startTime;
            logger.api(method, url, 201, responseTime, { userId: user.id });
            
            res.writeHead(201, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ 
                message: 'Usuário criado com sucesso', 
                user 
            }));
        } catch (error) {
            logger.error('Erro ao criar usuário', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Erro interno do servidor' }));
        }
    }

    // PUT /user/:id - Atualizar usuário
    if (method === 'PUT' && url.startsWith('/user/')) {
        try {
            const id = parseInt(url.split('/')[2]);
            if (isNaN(id)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'ID inválido' }));
            }

            const userData = req.body || {};
            
            // Validação robusta
            const validation = validateUserData(userData);
            if (!validation.isValid) {
                logger.warn('Dados de usuário inválidos para atualização', { errors: validation.errors });
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ 
                    error: 'Dados inválidos',
                    details: validation.errors
                }));
            }

            const updatedUser = database.update('users', id, {
                ...validation.data,
                updatedAt: new Date().toISOString()
            });

            if (!updatedUser) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Usuário não encontrado' }));
            }

            logger.info('Usuário atualizado com sucesso', { userId: id, name: updatedUser.name });
            
            const responseTime = Date.now() - startTime;
            logger.api(method, url, 200, responseTime, { userId: id });
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ 
                message: 'Usuário atualizado com sucesso', 
                user: updatedUser 
            }));
        } catch (error) {
            logger.error('Erro ao atualizar usuário', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Erro interno do servidor' }));
        }
    }

    // DELETE /user/:id - Deletar usuário
    if (method === 'DELETE' && url.startsWith('/user/')) {
        try {
            const id = parseInt(url.split('/')[2]);
            if (isNaN(id)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'ID inválido' }));
            }

            const user = database.findById('users', id);
            if (!user) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Usuário não encontrado' }));
            }

            const deleted = database.delete('users', id);
            if (deleted) {
                logger.info('Usuário deletado com sucesso', { userId: id, name: user.name });
                
                const responseTime = Date.now() - startTime;
                logger.api(method, url, 200, responseTime, { userId: id });
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ 
                    message: 'Usuário deletado com sucesso' 
                }));
            } else {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Erro ao deletar usuário' }));
            }
        } catch (error) {
            logger.error('Erro ao deletar usuário', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Erro interno do servidor' }));
        }
    }
    
    // Rota não encontrada
    const responseTime = Date.now() - startTime;
    logger.api(method, url, 404, responseTime);
    
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Rota não encontrada' }));
});

server.listen(3333, () => console.log('Server running at http://localhost:3333'));