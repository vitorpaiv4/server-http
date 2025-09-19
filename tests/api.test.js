import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import http from 'http';

const API_BASE = 'http://localhost:3333';

// Função auxiliar para fazer requisições HTTP
function makeRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3333,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                try {
                    const jsonBody = body ? JSON.parse(body) : {};
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        body: jsonBody
                    });
                } catch (error) {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        body: body
                    });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

describe('API de Usuários', () => {
    let createdUserId;

    beforeAll(async () => {
        // Aguardar o servidor estar rodando
        await new Promise(resolve => setTimeout(resolve, 1000));
    });

    describe('GET /user', () => {
        it('deve listar todos os usuários', async () => {
            const response = await makeRequest('GET', '/user');
            
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe('POST /user', () => {
        it('deve criar um novo usuário com dados válidos', async () => {
            const userData = {
                name: 'João Silva',
                email: 'joao@email.com'
            };

            const response = await makeRequest('POST', '/user', userData);
            
            expect(response.statusCode).toBe(201);
            expect(response.body.message).toBe('Usuário criado com sucesso');
            expect(response.body.user).toHaveProperty('id');
            expect(response.body.user.name).toBe('João Silva');
            expect(response.body.user.email).toBe('joao@email.com');
            
            createdUserId = response.body.user.id;
        });

        it('deve rejeitar usuário sem nome', async () => {
            const userData = {
                email: 'teste@email.com'
            };

            const response = await makeRequest('POST', '/user', userData);
            
            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe('Dados inválidos');
            expect(response.body.details).toContain('Nome é obrigatório');
        });

        it('deve rejeitar usuário sem email', async () => {
            const userData = {
                name: 'João Silva'
            };

            const response = await makeRequest('POST', '/user', userData);
            
            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe('Dados inválidos');
            expect(response.body.details).toContain('Email é obrigatório');
        });

        it('deve rejeitar email inválido', async () => {
            const userData = {
                name: 'João Silva',
                email: 'email-invalido'
            };

            const response = await makeRequest('POST', '/user', userData);
            
            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe('Dados inválidos');
            expect(response.body.details).toContain('Formato de email inválido');
        });

        it('deve rejeitar nome muito curto', async () => {
            const userData = {
                name: 'A',
                email: 'teste@email.com'
            };

            const response = await makeRequest('POST', '/user', userData);
            
            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe('Dados inválidos');
            expect(response.body.details).toContain('Nome deve ter pelo menos 2 caracteres');
        });
    });

    describe('GET /user/:id', () => {
        it('deve buscar usuário por ID existente', async () => {
            const response = await makeRequest('GET', `/user/${createdUserId}`);
            
            expect(response.statusCode).toBe(200);
            expect(response.body.id).toBe(createdUserId);
            expect(response.body.name).toBe('João Silva');
        });

        it('deve retornar 404 para usuário inexistente', async () => {
            const response = await makeRequest('GET', '/user/999');
            
            expect(response.statusCode).toBe(404);
            expect(response.body.error).toBe('Usuário não encontrado');
        });

        it('deve retornar 400 para ID inválido', async () => {
            const response = await makeRequest('GET', '/user/abc');
            
            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe('ID inválido');
        });
    });

    describe('PUT /user/:id', () => {
        it('deve atualizar usuário existente', async () => {
            const updateData = {
                name: 'João Santos',
                email: 'joao.santos@email.com'
            };

            const response = await makeRequest('PUT', `/user/${createdUserId}`, updateData);
            
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('Usuário atualizado com sucesso');
            expect(response.body.user.name).toBe('João Santos');
            expect(response.body.user.email).toBe('joao.santos@email.com');
        });

        it('deve retornar 404 para usuário inexistente', async () => {
            const updateData = {
                name: 'Teste',
                email: 'teste@email.com'
            };

            const response = await makeRequest('PUT', '/user/999', updateData);
            
            expect(response.statusCode).toBe(404);
            expect(response.body.error).toBe('Usuário não encontrado');
        });

        it('deve rejeitar dados inválidos na atualização', async () => {
            const updateData = {
                name: '',
                email: 'email-invalido'
            };

            const response = await makeRequest('PUT', `/user/${createdUserId}`, updateData);
            
            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe('Dados inválidos');
        });
    });

    describe('DELETE /user/:id', () => {
        it('deve deletar usuário existente', async () => {
            const response = await makeRequest('DELETE', `/user/${createdUserId}`);
            
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('Usuário deletado com sucesso');
        });

        it('deve retornar 404 para usuário inexistente', async () => {
            const response = await makeRequest('DELETE', '/user/999');
            
            expect(response.statusCode).toBe(404);
            expect(response.body.error).toBe('Usuário não encontrado');
        });

        it('deve retornar 400 para ID inválido', async () => {
            const response = await makeRequest('DELETE', '/user/abc');
            
            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe('ID inválido');
        });
    });

    describe('Rotas inexistentes', () => {
        it('deve retornar 404 para rota inexistente', async () => {
            const response = await makeRequest('GET', '/rota-inexistente');
            
            expect(response.statusCode).toBe(404);
            expect(response.body.error).toBe('Rota não encontrada');
        });
    });
});
