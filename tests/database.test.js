import { describe, it, expect, beforeEach } from 'vitest';
import { Database } from '../src/database.js';
import fs from 'fs/promises';
import path from 'path';

describe('Database', () => {
    let database;
    const testDbPath = path.join(process.cwd(), 'test-database.json');

    beforeEach(async () => {
        // Limpar arquivo de teste se existir
        try {
            await fs.unlink(testDbPath);
        } catch (error) {
            // Arquivo não existe, tudo bem
        }
        
        // Criar nova instância do database
        database = new Database();
        database.dbPath = testDbPath;
        database.database = {};
    });

    describe('select', () => {
        it('deve retornar array vazio para tabela inexistente', () => {
            const result = database.select('users');
            expect(result).toEqual([]);
        });

        it('deve retornar dados existentes', () => {
            database.database.users = [
                { id: 1, name: 'João', email: 'joao@email.com' }
            ];
            
            const result = database.select('users');
            expect(result).toHaveLength(1);
            expect(result[0].name).toBe('João');
        });
    });

    describe('insert', () => {
        it('deve inserir primeiro item na tabela', () => {
            const user = { id: 1, name: 'João', email: 'joao@email.com' };
            
            const result = database.insert('users', user);
            
            expect(result).toEqual(user);
            expect(database.database.users).toHaveLength(1);
            expect(database.database.users[0]).toEqual(user);
        });

        it('deve inserir item adicional na tabela existente', () => {
            database.database.users = [
                { id: 1, name: 'João', email: 'joao@email.com' }
            ];
            
            const newUser = { id: 2, name: 'Maria', email: 'maria@email.com' };
            const result = database.insert('users', newUser);
            
            expect(result).toEqual(newUser);
            expect(database.database.users).toHaveLength(2);
            expect(database.database.users[1]).toEqual(newUser);
        });
    });

    describe('update', () => {
        beforeEach(() => {
            database.database.users = [
                { id: 1, name: 'João', email: 'joao@email.com' },
                { id: 2, name: 'Maria', email: 'maria@email.com' }
            ];
        });

        it('deve atualizar usuário existente', () => {
            const updateData = { name: 'João Silva' };
            
            const result = database.update('users', 1, updateData);
            
            expect(result).toBeDefined();
            expect(result.name).toBe('João Silva');
            expect(result.email).toBe('joao@email.com'); // Deve manter dados não alterados
            expect(database.database.users[0].name).toBe('João Silva');
        });

        it('deve retornar null para usuário inexistente', () => {
            const updateData = { name: 'Teste' };
            
            const result = database.update('users', 999, updateData);
            
            expect(result).toBeNull();
        });

        it('deve retornar null para tabela inexistente', () => {
            const updateData = { name: 'Teste' };
            
            const result = database.update('inexistente', 1, updateData);
            
            expect(result).toBeNull();
        });
    });

    describe('delete', () => {
        beforeEach(() => {
            database.database.users = [
                { id: 1, name: 'João', email: 'joao@email.com' },
                { id: 2, name: 'Maria', email: 'maria@email.com' }
            ];
        });

        it('deve deletar usuário existente', () => {
            const result = database.delete('users', 1);
            
            expect(result).toBe(true);
            expect(database.database.users).toHaveLength(1);
            expect(database.database.users[0].id).toBe(2);
        });

        it('deve retornar false para usuário inexistente', () => {
            const result = database.delete('users', 999);
            
            expect(result).toBe(false);
            expect(database.database.users).toHaveLength(2);
        });

        it('deve retornar false para tabela inexistente', () => {
            const result = database.delete('inexistente', 1);
            
            expect(result).toBe(false);
        });
    });

    describe('findById', () => {
        beforeEach(() => {
            database.database.users = [
                { id: 1, name: 'João', email: 'joao@email.com' },
                { id: 2, name: 'Maria', email: 'maria@email.com' }
            ];
        });

        it('deve encontrar usuário por ID', () => {
            const result = database.findById('users', 1);
            
            expect(result).toBeDefined();
            expect(result.id).toBe(1);
            expect(result.name).toBe('João');
        });

        it('deve retornar null para usuário inexistente', () => {
            const result = database.findById('users', 999);
            
            expect(result).toBeNull();
        });

        it('deve retornar null para tabela inexistente', () => {
            const result = database.findById('inexistente', 1);
            
            expect(result).toBeNull();
        });
    });
});
